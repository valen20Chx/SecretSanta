import { listStore } from '../shared/stores';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';

const Create: React.FC = () => {


    const [state, setState] = useState({
        name: '',
        email: ''
    });
    const history = useHistory();
    const store = listStore();

    const [validated,] = useState(false);

    const createList = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            store.createList(state.name, state.email).then((id) => {
                history.push(`/list/${id}`);
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name) {
            case 'name':
                setState({
                    ...state,
                    name: e.target.value
                });
                break;
            case 'email':
                setState({
                    ...state,
                    email: e.target.value
                });
                break;
            default:
                break;
        }
    }

    return <Container>
        <Row>
            <Col>
                <h2>New List</h2>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form className="mb-3" onSubmit={createList} validated={validated}>
                    <Form.Group controlId="validationName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" onInput={handleChange} name="name" required />
                    </Form.Group>
                    <Form.Group controlId="validationEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="john.doe@email.com" onInput={handleChange} name="email" required />
                    </Form.Group>
                    <Button type="submit" variant="outline-secondary">Create</Button>
                </Form>
            </Col>
        </Row>
    </Container>;
};

export default Create;