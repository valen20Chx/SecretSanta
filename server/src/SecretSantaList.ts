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

        let possibleRecipients = this.participants.slice(); // Clone participents array
    
        this.StoRassociations = new Map<T, T>();
        this.RtoSassociations = new Map<T, T>();

        this.participants.forEach((participant, index) => { // Gifter
            while(!this.StoRassociations.has(participant)) {
                const randIndex = Math.floor(Math.random() * possibleRecipients.length);
                const randRecipient = possibleRecipients[randIndex];
                
                // TODO : Triangle method (last 3 exchange to avoid that the last is alone)
                if(possibleRecipients.length == 1 && possibleRecipients[0] == participant) { // Check if case where last is alone
                    this.scramble();
                    return;
                }
        
                if(randRecipient != participant) {
                    this.StoRassociations.set(participant, randRecipient);
                    this.RtoSassociations.set(randRecipient, participant);
                    possibleRecipients.splice(randIndex, 1);
                }
            }
        });
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