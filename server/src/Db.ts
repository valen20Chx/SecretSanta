import pg from 'pg';
import fs from 'fs';
import {Participant, List} from './Interfaces';

const dbFilesDirPath = './db/';

// interface DB_Error {
//     err: any | null,
//     msg: string,
//     code: number
// };

export class Db {
    config: Object;
    connected: boolean;
    client: pg.Client;

    constructor(user: string, host: string, database: string, password: string, port: number) {
        this.config = {user, host, database, password, port};
        this.connected = false;
        this.client = new pg.Client(this.config);
        
        this.connect();

        this.client.on('end', () => {
            console.error('❗ Disconnected from DB, retrying...');
            this.connect();
        });
    }

    connect() {
        this.client.connect().then(() => {
            console.log('Connection to DB established 🔗');
            this.connected = true;
            this.client.query(fs.readFileSync(dbFilesDirPath + 'CREATE_TABLES.pgsql').toString()).then(result => {
                // console.log(result);
            }).catch(err => {
                console.error(err);
            });
        }).catch(err => {
            console.error('❗ pg connection error', err.stack);
            console.error('Retrying in 10 sec 🕛');
            this.connected = false;
    
            // Recursive call ➰ delayed by 10 seconds
            setTimeout(this.connect, 1000 * 10);
        });
    }

    getList(id: number) {
        const query1 = fs.readFileSync(dbFilesDirPath + 'GET_LIST.pgsql').toString();
        const query2 = fs.readFileSync(dbFilesDirPath + 'GET_LIST_PARTICIPANTS.pgsql').toString();
        const query3 = fs.readFileSync(dbFilesDirPath + 'GET_LIST_ASSOCIATIONS.pgsql').toString();
        return new Promise<List>((resolve, reject) => {
            this.client.query(query1, [id]).then(q1Res => {
                if(q1Res.rowCount == 0) { // List Not Existant
                    reject({
                        msg: 'list is innexistant',
                        code: 400
                    });
                } else {
                    Promise.all([this.client.query(query2, [id]), this.client.query(query3, [id])]).then(results => {
                        let list_data : List = q1Res.rows[0];
                        list_data.participants = results[0].rows;
                        list_data.associations = results[1].rows;
                        resolve(list_data);
                    }).catch(errors => {
                        reject({
                            err: errors,
                            code: 500
                        });
                    });
                }
            });
        });
    }

    createList(max_participants: number = 8) {
        const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST.pgsql').toString();
        return new Promise((resolve, reject) => {
            this.client.query(query, [max_participants]).then(result => {
                resolve(result.rows[0]);
            }).catch(errors => {
                reject({
                    err: errors,
                    code: 500
                });
            });
        });
    }

    insertListCreator(listId: number, name: string, email: string) {
        const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST_CREATOR.pgsql').toString();
        return new Promise((resolve, reject) => {
            this.client.query(query, [listId, name, email]).then(result => {
                resolve(result.rows[0]);
            }).catch(errors => {
                reject({
                    err: errors,
                    code: 500
                });
            });
        });
    }

    insertListParticipant(listId: number, name: string, email: string) {
        return new Promise((resolve, reject) => {

            this.getList(listId).then(result => {
                if(result.participants.length >= result.max_participants) {
                    reject({
                        msg: 'Participants limit reached',
                        code: 500
                    });
                } else {
                    const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST_PARTICIPANT.pgsql').toString();
                    this.client.query(query, [listId, name, email]).then(result => {
                        resolve(result.rows[0]);
                    }).catch(errors => {
                        reject({
                            err: errors,
                            code: 500
                        });
                    });
                }
            }).catch(err => {
                reject({
                    err: err,
                    code: 500
                });
            });
        });
    }

    insertAssociation(gifter_id: number, receiver_id: number) {
        return new Promise((resolve, reject) => {
            const query = fs.readFileSync(dbFilesDirPath + 'INSERT_ASSOCIATION.pgsql').toString();
            this.client.query(query, [gifter_id, receiver_id]).then(result =>{
                resolve(null);
            }).catch(err => {
                reject({
                    err: err,
                    code: 500
                });
            });
        });
    }

    getAssociations(listId: number) {
        return new Promise((resolve, reject) => {
            const query = fs.readFileSync(dbFilesDirPath + 'GET_LIST_ASSOCIATIONS.pgsql').toString();
            this.client.query(query, [listId]).then(result => {
                if(result.rowCount == 0) {
                    reject({
                        msg: 'No associations found',
                        code: 400
                    });
                } else {
                    resolve(result.rows);
                }
            }).catch(err => {
                reject({
                    err: err,
                    code: 500
                });
            });
        });
    }

    deleteListParticipant(pId: number) {
        return new Promise((resolve, reject) => {
            const query = fs.readFileSync(dbFilesDirPath + 'REMOVE_LIST_PARTICIPANT.pgsql').toString();
            this.client.query(query, [pId]).then(result => {
                resolve(result);
            }).catch(err => {
                reject({
                    err: err,
                    code: 500
                });
            });
        });
    }

    updateParticipant(id: number, name: string, email: string) {
        return new Promise((resolve, reject) => {
            const query = fs.readFileSync(dbFilesDirPath + 'UPDATE_LIST_PARTIOCIPANT.pgsql').toString();
            this.client.query(query, [id, name, email]).then(result => {
                resolve(result);
            }).catch(err => {
                reject({
                    err: err,
                    code: 500
                });
            });
        });
    }
};