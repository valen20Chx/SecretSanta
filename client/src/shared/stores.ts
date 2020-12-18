import Axios from 'axios';
import create from 'zustand';
import { IList } from './Interfaces';

type ListState = {
    list: IList | null,
    fetchList: (id: number) => void,
    removeParticipant: (id: number) => void,
    addParticipant: (listId: number, name: string, email: string) => void,
    updateParticipant: (pId: number, name: string, email: string) => void,
    scramble: () => void
};

const API_HOST = 'http://localhost:5000';

export const listStore = create<ListState>((set, get) => ({
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
        if(get().list?.scrambled) return;
        Axios.post(`${API_HOST}/list/delete/participant`, {
            pId: id
        }).then(() => {
            const listId = get().list?.id;
            if(listId)
                get().fetchList(listId);
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    },
    addParticipant: (listId: number, name: string, email: string) => {
        if(get().list?.scrambled) return;
        Axios.post(`${API_HOST}/list/insert/participant`, {
            listId: listId,
            name: name,
            email: email
        }).then(() => {
            get().fetchList(listId);
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    },

    updateParticipant: (pId: number, name: string, email: string) => {
        if(get().list?.scrambled) return; // Might remove this one
        const listId = get().list?.id;
        Axios.post(`${API_HOST}/list/update/participant`, {
            pId: pId,
            name: name,
            email: email
        }).then(() => {
            if(listId)
                get().fetchList(listId);
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    },
    
    scramble: () => {
        if(get().list?.scrambled) return;
        const listId = get().list?.id;
        Axios.post(`${API_HOST}/list/scramble`, {
            listId: listId
        }).then(() => {
            if(listId)
                get().fetchList(listId);
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    }
}));