import React, { useState } from 'react';
import { IList } from '../../shared/Interfaces';

// Bootstrap
import { Modal, Button, Form, FormControl } from 'react-bootstrap';
import { listStore } from '../../shared/stores';

interface Props {
    infos: IList
}


const ListInfo: React.FC<Props> = (props: Props) => {

    const [showNewPartModal, setShowNewPartModal] = useState(false);
    const [showScrambleModal, setShowScrambleModal] = useState(false);
    const [validated,] = useState(false);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: ''
    });
    const store = listStore();

    const showAddParticipantModal = () => {
        if (props.infos.participants.length >= props.infos.max_participants) {
            alert('Participant limit reached');
        } else {
            setShowNewPartModal(!showNewPartModal);
        }
    }

    const createParticipant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.checkValidity());
        console.log(newParticipant);


        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (props.infos.participants.length >= props.infos.max_participants) {
            alert('Participants limit reached.');
        } else if (props.infos.participants.findIndex(participant => participant.email === newParticipant.email) === -1) {
            store.addParticipant(props.infos.id, newParticipant.name, newParticipant.email);
        } else {
            alert('Email already used in list.');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'name':
                setNewParticipant({
                    ...newParticipant,
                    name: e.target.value
                });
                break;
            case 'email':
                setNewParticipant({
                    ...newParticipant,
                    email: e.target.value
                });
                break;
        }
    }

    const scramble = () => {
        store.scramble();
    }

    return (
        <div>
            <ul>
                <li>Date Created: {new Date(props.infos.date_created).toDateString()}</li>
                <li>Completed: {props.infos.scrambled ? 'Yes' : 'No'}</li>
                <li>Number of Participants: {props.infos.participants.length} / {props.infos.max_participants}</li>
            </ul>
            <Button
                onClick={showAddParticipantModal}
                variant="outline-secondary"
                className="mr-2"
                disabled={props.infos.participants.length >= props.infos.max_participants || props.infos.scrambled}
            >➕</Button>
            <Button
                onClick={() => {setShowScrambleModal(true)}}
                variant="outline-secondary"
                className="mr-2"
                disabled={
                    props.infos.scrambled || props.infos.participants.length < 3
                }
            >🎁</Button>

            <Modal show={showNewPartModal} onHide={() => { setShowNewPartModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={createParticipant}>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <FormControl onInput={handleChange} type="text" name="name" required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <FormControl onInput={handleChange} type="email" name="email" required />
                        </Form.Group>
                        <Button variant="outline-secondary float-right" type="submit">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>


            <Modal show={showScrambleModal} onHide={() => { setShowScrambleModal(false) }}>

            <Modal.Header closeButton>
                    <Modal.Title>Scramble List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>Are you sure about that?</h2>
                    <Button onClick={scramble}>Yes</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListInfo;