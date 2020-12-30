// DOTENV
import {config} from 'dotenv';
config();

// Express
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Custom Tool Modules
import {List, Participant} from './Db';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {

    // LOG THE REQUEST
    console.log(new Date(Date.now()).toISOString(), req.method, req.path, req.ip);
    
    next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ⚙️`);
});

// ----- Routes -----

// Fetches the list data: 
app.get('/list/:id', async (req, res) => {
    try {
        const list = (await List.findByPk(req.params.id));
        const list_data = {
            ...(await list?.toJSON()),
            participants: (await list?.getParticipants())?.map(participant => participant.toJSON()),
            associations: (await list?.getAssociations())?.map(association => association.toJSON())
        };
        res.json(list_data);
        return;
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
        return;
    };
});

app.post('/list/create', async (req, res) => {
    try {
        const DEFAULT_MAX_PARTICIPANTS = 8;
        const list = await List.create({max_participants: Number(req.body.max_size) || DEFAULT_MAX_PARTICIPANTS});
        res.json(list.toJSON());

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

app.post('/list/insert/creator', async (req, res) => {
    if(req.body.listId && req.body.name && req.body.email) {
        try {
            const createdParticipant = await Participant.create({
                list_id: Number(req.body.listId),
                name: req.body.name,
                email: req.body.email,
                creator: true
            });
            res.json(createdParticipant.toJSON());
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/insert/participant', async (req, res) => {
    if(req.body.listId && req.body.name && req.body.email) {
        try {
            const createdParticipant = await Participant.create({
                list_id: Number(req.body.listId),
                name: req.body.name,
                email: req.body.email
            });
            res.json(createdParticipant.toJSON());
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/scramble', async (req, res) => {
    if(req.body.listId) {
        try {
            await (await List.findByPk(req.body.listId))?.scramble();
            res.sendStatus(200);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get('/list/associations/:id', async (req, res) => {
    try {
        const associations = await (await List.findByPk(req.params.id))?.getAssociations();
        res.json(associations?.map(association => association.toJSON()));
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

app.post('/list/delete/participant', async (req, res) => {
    if(req.body.pId) {
        try {
            await (await Participant.findByPk(req.body.pId))?.destroy();
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/list/update/participant', async (req, res) => {
    if(req.body.pId && req.body.name && req.body.email) {
        try {
            await (await Participant.findByPk(Number(req.body.pId)))
                ?.update({name: req.body.name, email: req.body.email});
            res.sendStatus(200);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
            return;
        }
    } else {
        res.sendStatus(400);
    }
});