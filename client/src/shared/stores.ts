import Axios from 'axios';
import create from 'zustand';
import { IList } from './Interfaces';

type ListState = {
    list: IList | null,
    fetchList: (id: number) => void,
    removeParticipant: (id: number) => void,
    addParticipant: (listId: number, name: string, email: string) => void,
    updateParticipant: (pId: number, name: string, email: string) => void
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
            Axios.get(`${API_HOST}/list/${get().list?.id}`).then(res => {
                set(state => ({ ...state, list: res.data }));
            }).catch(err => {
                console.error(err);
                if (err.response.status === 400) {
                    console.log('Not Found');
                }
            });
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
            Axios.get(`${API_HOST}/list/${listId}`).then(res => {
                set(state => ({ ...state, list: res.data }));
            }).catch(err => {
                console.error(err);
                if (err.response.status === 400) {
                    console.log('Not Found');
                }
            });
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    },

    updateParticipant: (pId: number, name: string, email: string) => {
        if(get().list?.scrambled) return; // Night remove this one
        Axios.post(`${API_HOST}/list/update/participant`, {
            pId: pId,
            name: name,
            email: email
        }).then(() => {
            Axios.get(`${API_HOST}/list/${get().list?.id}`).then(res => {
                set(state => ({ ...state, list: res.data }));
            }).catch(err => {
                console.error(err);
                if (err.response.status === 400) {
                    console.log('Not Found');
                }
            });
        }).catch(err => {
            console.error(err);
            if (err.response.status === 400) {
                console.log('Not Found');
            }
        });
    }
}));