import React from 'react';
import { Button } from 'react-bootstrap';

// Interfaces
import {IParticipant} from '../../shared/Interfaces';

// Store
import {listStore} from '../../shared/stores';

interface Props {
    participant: IParticipant
}

const Participant: React.FC<Props> = (props: Props) => {

    const store = listStore();

    const remove = () => store.removeParticipant(props.participant.id);

    return (
        <tr>
            <td>{props.participant.name} {props.participant.creator && <>⭐</> }</td>
            <td>{props.participant.email}</td>
            <td>{new Date(props.participant.date_added).toDateString()}</td>
            <td>
                <Button variant="outline-dark" onClick={() => remove()} disabled={props.participant.creator} className="mr-2">❌</Button>
                <Button variant="outline-dark" onClick={() => alert('EDIT')} disabled={props.participant.creator} className="mr-2">⚙</Button>
            </td>
        </tr>
    );
};

export default Participant;