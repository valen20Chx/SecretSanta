import pg from 'pg';
import fs from 'fs';
import {Participant, List} from './Interfaces';

const dbFilesDirPath = __dirname + '/db/';

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
        return new Promise<List>((resolve, reject) => {
            Promise.all([this.client.query(query1, [id]), this.client.query(query2, [id])]).then(results => {
                let list_data : List = results[0].rows[0];
                list_data.participants = results[1].rows;
                resolve(list_data);
            }).catch(errors => {
                reject(errors);
            });
        });
    }

    createList(max_participants: number = 8) {
        const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST.pgsql').toString();
        return new Promise((resolve, reject) => {
            this.client.query(query, [max_participants]).then(result => {
                resolve(result.rows[0]);
            }).catch(errors => {
                reject(errors);
            });
        });
    }

    insertListCreator(listId: number, name: string, email: string) {
        const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST_CREATOR.pgsql').toString();
        return new Promise((resolve, reject) => {
            this.client.query(query, [listId, name, email]).then(result => {
                resolve(result.rows[0]);
            }).catch(errors => {
                reject(errors);
            });
        });
    }

    insertListParticipant(listId: number, name: string, email: string) {
        return new Promise((resolve, reject) => {

            this.getList(listId).then(result => {
                if(result.participants.length >= result.max_participants) {
                    reject({
                        msg: 'Participants limit reached'
                    });
                } else {
                    const query = fs.readFileSync(dbFilesDirPath + 'INSERT_LIST_CREATOR.pgsql').toString();
                    this.client.query(query, [listId, name, email]).then(result => {
                        resolve(result.rows[0]);
                    }).catch(errors => {
                        reject(errors);
                    });
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
};