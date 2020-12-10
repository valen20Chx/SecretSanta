"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Db_1 = require("./Db");
const app = express_1.default();
app.use(body_parser_1.default.json());
// TODO: Change config input method (secret json or env var)
const db = new Db_1.Db('secret-santa-admin', 'localhost', 'secret-santa', 'secretsantapassword', 5432);
app.use((req, res, next) => {
    // LOG THE REQUEST
    console.log(new Date(Date.now()).toISOString(), req.method, req.path, req.ip);
    if (!db.connected) {
        console.log(`❗ Request cant be completed, DB connection not established.`);
        res.sendStatus(500);
    }
    else {
        next();
    }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ⚙️`);
});
// Add a participant
app.post('/add/', (req, res) => {
    if (req.body.name && req.body.email) { // User inputs correct
        let { name, email } = req.body;
        console.log(`New participant: `, { name, email });
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});
// Scramble the list
app.post('/scramble', (req, res) => {
    res.sendStatus(200);
});
app.get('/list/:id', (req, res) => {
    db.getList(Number(req.params.id)).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
app.post('/list/create', (req, res) => {
    db.createList(Number(req.body.max_size)).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
app.post('/list/insert/creator', (req, res) => {
    db.insertListCreator(Number(req.body.listId), req.body.name, req.body.email).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
app.post('/list/insert/participant', (req, res) => {
    db.insertListParticipant(Number(req.body.listId), req.body.name, req.body.email).then(result => {
        // console.log(result);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
