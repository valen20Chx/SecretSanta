import React from 'react';

// Component
import Participant from './Participant';

// Store
import {listStore} from '../../shared/stores';

// Interfaces
import {IParticipant} from '../../shared/Interfaces';
import { Table } from 'react-bootstrap';

const ListParticipants: React.FC<{}> = () => {

    const store = listStore();

    return (
        <Table bordered hover className="mt-2">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date of Creation</th>
                    <th>Remove / Edit</th>
                </tr>
            </thead>
            <tbody>
                {
                    store.list?.participants &&
                    store.list.participants.map((el: IParticipant) => (
                        <Participant key={el.id} participant={el} />
                    ))
                }
            </tbody>
        </Table>
    );
};

export default ListParticipants;