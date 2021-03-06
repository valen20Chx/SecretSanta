import Axios from 'axios';
import create from 'zustand';
import { IList } from './Interfaces';

type ListState = {
    list: IList | null,
    fetchList: (id: number) => Promise<void>,
    removeParticipant: (id: number) => void,
    addParticipant: (listId: number, name: string, email: string) => void,
    updateParticipant: (pId: number, name: string, email: string) => void,
    scramble: () => void,
    createList: (name: string, email: string) => Promise<void>
};

const API_HOST = 'http://localhost:5000';

export const listStore = create<ListState>((set, get) => ({
    list: null,
    fetchList: (id: number) => {
        return Axios.get(`${API_HOST}/list/${id}`).then(res => {
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
            listId: get().list?.id
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
    
    createList: (name: string, email: string) => {
        return new Promise((resolve, reject) => {
            Axios.post(`${API_HOST}/list/create`).then(response => {
                const newListId = response.data.id;
                Axios.post(`${API_HOST}/list/insert/creator`, {
                    name,
                    email,
                    listId: newListId
                }).then(() => {
                    get().fetchList(newListId).then(() => {
                        resolve(newListId);
                    });
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        })
    }
}));