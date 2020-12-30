import React from 'react';

// Store
import {listStore} from '../shared/stores';

// Components
import ListInfo from './List/ListInfo';
import ListParticipants from './List/ListParticipants';

import {Col, Container, Row} from 'react-bootstrap';

const List: React.FC<any> = () => {

    const store = listStore();

    const list_id = Number(window.location.hash.split('/').reverse()[0]);

    if(!store.list || store.list.id !== list_id) {
        store.fetchList(list_id);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h3>🎁 List</h3>
                    {store.list && <ListInfo infos={store.list} />}
                    {store.list && <ListParticipants />}
                </Col>
            </Row>
        </Container>
    );
};
export default List;