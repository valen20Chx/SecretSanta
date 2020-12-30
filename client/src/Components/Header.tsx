import React from 'react';

import {useHistory} from 'react-router';
import {Button, Col, Container, FormControl, InputGroup, Row} from 'react-bootstrap';

const Header: React.FC = () => {

    let history = useHistory();

    function goHome() {
        history.push('/');
    }

    function goToList() {
        const listId: number = Number((document.getElementById('listId') as HTMLInputElement).value);
        if(!isNaN(listId) && isFinite(listId)) {
            history.push(`/list/${listId}`);
        }
    }

    return <Container className="my-2">
        <Row>
            <Col>
                <Button onClick={goHome} variant="outline-secondary">Home</Button>
            </Col>
            <Col>
                <h2>Secret 🎅 </h2>
                {/* <h2>Secret Santa 🎅 </h2> */}
            </Col>
            <Col>
                <InputGroup>
                    <FormControl id="listId" />
                    <InputGroup.Append>
                        <Button onClick={goToList} variant="outline-secondary">To List</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Col>
        </Row>
    </Container>;
};

export default Header;