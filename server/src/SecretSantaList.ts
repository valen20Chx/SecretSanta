import {List, Participant} from './Interfaces';

export class SecretSantaList<T> {
    participants: Array<T>;
    StoRassociations: Map<T, T>;
    RtoSassociations: Map<T, T>;
    completed: boolean;

    constructor(list: Array<T>) {
        this.participants = list;
        if(this.participants.length < 3) {
            console.error('Not enough participants (3 min)')
            this.completed = true;
        }
        else {
            this.completed = false;
        }

        this.StoRassociations = new Map<T, T>();
        this.RtoSassociations = new Map<T, T>();
    }
    
    scramble(): void {
        if(this.completed) return; // To not run again and no infinity loop on case 1 participant
    
        this.StoRassociations = new Map<T, T>();
        this.RtoSassociations = new Map<T, T>();

        const randArr = shuffleArray(this.participants);

        const shift = Math.floor(Math.random() * randArr.length);

        randArr.forEach((participant, index) => { // Gifter

            const nextParticipant = randArr[(index + shift) % randArr.length];

            this.StoRassociations.set(participant, nextParticipant);
            this.RtoSassociations.set(nextParticipant, participant);
        });
        this.completed = true;
    }

    isCompleted(): boolean {
        return this.completed;
    }

    getSanta(recipient: T) {
        return this.RtoSassociations.get(recipient);
    }

    getRecipient(santa: T) {
        return this.StoRassociations.get(santa);
    }
}

function shuffleArray<T>(arr: Array<T>): Array<T> {
    let cpyArr = arr.slice();
    for(let index = 0; index < cpyArr.length; index++) {
        let randIndx = Math.floor(Math.random() * cpyArr.length - 1);
        if(randIndx >= index)
            randIndx++;
        // Swap a <-> b
        let tempEle = cpyArr[index];
        cpyArr[index] = cpyArr[randIndx];
        cpyArr[randIndx] = tempEle;
    }
    return cpyArr;
}