import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { useHistory } from 'react-router';

const Home: React.FC = () => {
    let history = useHistory();

    function goToCreate() {
        history.push('/new');
    }

    return <Container>
        <Row>
            <Col>
                <Button onClick={goToCreate} variant="outline-secondary">Create new list</Button>
            </Col>
        </Row>
    </Container>;
};

export default Home;