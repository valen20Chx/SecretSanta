import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

// Interfaces
import {IParticipant} from '../../shared/Interfaces';

// Store
import {listStore} from '../../shared/stores';

interface Props {
    participant: IParticipant
}

const Participant: React.FC<Props> = (props: Props) => {

    const [showModal, setShowModal] = useState(false);
    const [validated,] = useState(false);
    const [editParticipant, setEditParticipant] = useState({
        name: props.participant.name,
        email: props.participant.email
    });
    const store = listStore();

    const remove = () => store.removeParticipant(props.participant.id);

    const updateParticipant = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.checkValidity());
        console.log(editParticipant);

        
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // Verify that
            store.updateParticipant(props.participant.id, editParticipant.name, editParticipant.email);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name) {
            case 'name':
                setEditParticipant({
                    ...editParticipant,
                    name: e.target.value
                });
                break;
            case 'email':
                setEditParticipant({
                    ...editParticipant,
                    email: e.target.value
                });
                break;
        }
    }

    return (
        <tr>
            <td>{props.participant.name} {props.participant.creator && <>⭐</> }</td>
            <td>{props.participant.email}</td>
            <td>{new Date(props.participant.date_added).toDateString()}</td>
            <td>
                <Button variant="outline-dark" onClick={() => remove()} disabled={props.participant.creator || store.list?.scrambled} className="mr-2">❌</Button>
                <Button variant="outline-dark" onClick={() => setShowModal(true)} disabled={props.participant.creator || store.list?.scrambled} className="mr-2">⚙</Button>
            </td>
            <Modal show={showModal} onHide={() => {setShowModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={updateParticipant}>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onInput={handleChange} type="text" name="name" required value={editParticipant.name} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control onInput={handleChange} type="email" name="email" required value={editParticipant.email} />
                        </Form.Group>
                        <Button variant="outline-secondary float-right" type="submit">Edit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </tr>
    );
};

export default Participant;