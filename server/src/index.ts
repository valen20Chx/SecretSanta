// Express
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Custom Tool Modules
import { Db } from './Db';

// Classes and Interfaces
import { SecretSantaList } from './SecretSantaList';
import {Participant} from './Interfaces';

// DOTENV
import {config} from 'dotenv';
config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// TODO: Change config input method (secret json or env var)
const db = new Db(<string>process.env.DB_USERNAME,
    <string>process.env.DB_HOST,
    <string>process.env.DB_DBNAME,
    <string>process.env.DB_PASSWORD,
    Number(process.env.DB_PORT));

app.use((req, res, next) => {

    // LOG THE REQUEST
    console.log(new Date(Date.now()).toISOString(), req.method, req.path, req.ip);

    if(!db.connected) {
        console.log(`❗ Request cant be completed, DB connection not established.`);
        res.sendStatus(500);
    } else {
        next();
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ⚙️`);
});

// Add a participant
app.post('/add/', (req, res) => {
    if(req.body.name && req.body.email) { // User inputs correct
        let {name, email} = req.body; 
        console.log(`New participant: `, {name, email});
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.get('/list/:id', (req, res) => {
    db.getList(Number(req.params.id)).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(err.code);
    });
});

const DEFAULT_LIST_SIZE = 8;

app.post('/list/create', (req, res) => {
    db.createList(Number(req.body.max_size || DEFAULT_LIST_SIZE)).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(err.code);
    });
});

app.post('/list/insert/creator', (req, res) => {
    if(req.body.name && req.body.email && req.body.listId) {
        db.insertListCreator(Number(req.body.listId), req.body.name, req.body.email).then(result => {
            // console.log(result);
            res.json(result);
        }).catch(err => {
            console.log(err);
            res.sendStatus(err.code);
        });
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/insert/participant', (req, res) => {
    if(req.body.listId && req.body.name && req.body.email) {
        db.insertListParticipant(Number(req.body.listId), req.body.name, req.body.email).then(result => {
            res.json(result);
        }).catch(err => {
            console.log(err);
            res.sendStatus(err.code);
        });
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/scramble', (req, res) => {
    if(req.body.listId) {
        db.getList(Number(req.body.listId)).then(list => {
            const sList = new SecretSantaList<Participant>(list.participants);
            sList.scramble();
            if(sList.completed) { // scramble was successful
                let promises = new Array<Promise<any>>();
                list.participants.forEach(participant => {
                    const receiver = sList.getRecipient(participant);
                    if(receiver) {
                        promises.push(db.insertAssociation(participant.id, receiver.id || 0));
                    } else {
                        console.error(`Error Occurred`, participant);
                    }
                });

                promises.push(db.setScrambled(req.body.listId, true));

                Promise.all(promises).then(() => {
                    res.sendStatus(200);
                }).catch(errors => {
                    console.error(errors);
                    res.status(500).json({
                        msg: 'Error while trying to create the associations'
                    });
                });
            } else {
                res.status(500).json({
                    msg: 'Error scrambling the list'
                });
            }
        }).catch(err => {
            res.status(500).json(err);
        });
    } else {
        res.sendStatus(400);
    }
});

app.get('/list/associations/:id', (req, res) => {
    db.getAssociations(Number(req.params.id)).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(err.code);
    });
});

app.post('/list/delete/participant', (req, res) => {
    if(req.body.pId) {
        db.deleteListParticipant(Number(req.body.pId)).then(result => {
            res.sendStatus(200);
        }).catch(err => {
            console.log(err);
            res.sendStatus(err.code);
        });
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/update/participant', (req, res) => {
    if(req.body.pId && req.body.name && req.body.email) {
        db.updateParticipant(Number(req.body.pId), req.body.name, req.body.email).then(result => {
            res.sendStatus(200);
        }).catch(err => {
            console.log(err);
            res.sendStatus(err.code);
        });
    } else {
        res.sendStatus(400);
    }
});