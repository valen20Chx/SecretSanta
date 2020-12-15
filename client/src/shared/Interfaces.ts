export interface IParticipant {
    id: number,
    name: string,
    email: string,
    date_added: string | Date,
    creator: boolean,
    list_id: number
}

export interface IAssociation {
    id: number,
    gifter_id: number,
    receiver_id: number,
    date_created: Date | string
}

export interface IList {
    id: number,
    date_created: string | Date,
    scrambled: boolean,
    max_participants: number,
    participants: Array<IParticipant>,
    associations: Array<IAssociation>
}