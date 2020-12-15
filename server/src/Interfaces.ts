export interface Participant {
    id: number,
    name: string,
    email: string,
    date_added: string | Date,
    creator: boolean,
    list_id: number
}

export interface List {
    id: number,
    date_created: string | Date,
    scrambled: boolean,
    max_participants: number,
    participants: Array<Participant>,
    associations: Array<Association>
}

export interface Association {
    id: number,
    gifter_id: number,
    receiver_id: number,
    date_created: Date | string
}