import Axios from 'axios';
import create from 'zustand';
import { IList } from './Interfaces';

type ListState = {
    list: IList | null,
    fetchList: (id: number) => void,
    removeParticipant: (id: number) => void
};

const API_HOST = 'http://localhost:5000';

export const listStore = create<ListState>(set => ({
    list: null,
    fetchList: (id: number) => {
        Axios.get(`${API_HOST}/list/${id}`).then(res => {
            set(state => ({ ...state, list: res.data }));
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    },
    removeParticipant: (id: number) => {
        set(state => {
            let cpyState = Object.assign({}, state);
            if(state.list) {
                state.list.participants = state.list.participants.filter(participant => participant.id !== id);
            };
            return cpyState;
         });
    }
}));