import React, { useState } from 'react';
import {IList} from '../../shared/Interfaces';

// Bootstrap
import { Modal, Button, Form, FormControl } from 'react-bootstrap';

interface Props {
    infos :IList
}


const ListInfo: React.FC<Props> = (props: Props) => {

    const [showModal, setShowModal] = useState(false);
    const [validated,] = useState(false);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: ''
    });

    const showAddParticipantModal = () => {
        if(props.infos.participants.length >= props.infos.max_participants) {
            alert('Participant limit reached');
        } else {
            setShowModal(!showModal);
        }
    }

    const createParticipant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.checkValidity());
        console.log(newParticipant);

        
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // Verify that
            if(props.infos.participants.findIndex(participant => participant.email === newParticipant.email) === -1) {
                alert('creating');
            } else {
                alert('Email already used in list.');
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name) {
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

    return (
        <div>
            <ul>
                <li>Date Created: {new Date(props.infos.date_created).toDateString()}</li>
                <li>Completed: {props.infos.scrambled ? 'Yes' : 'No'}</li>
                <li>Number of Participants: {props.infos.participants.length} / {props.infos.max_participants}</li>
            </ul>
            <Button onClick={showAddParticipantModal} variant="outline-secondary" className="mr-2">➕</Button>
            <Button onClick={() => alert('SCRAMBLEING')} variant="outline-secondary" className="mr-2">🎁</Button>

            <Modal show={showModal} onHide={() => {setShowModal(false)}}>
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

        </div>
    );
};

export default ListInfo;