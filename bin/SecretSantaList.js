"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretSantaList = void 0;
class SecretSantaList {
    constructor(list) {
        this.participants = list;
        if (this.participants.length < 3) {
            console.error('Not enough participants (3 min)');
            this.completed = true;
        }
        else {
            this.completed = false;
        }
        this.StoRassociations = new Map();
        this.RtoSassociations = new Map();
    }
    scramble() {
        if (this.completed)
            return; // To not run again and no infinity loop on case 1 participant
        let possibleRecipients = this.participants.slice(); // Clone participents array
        this.StoRassociations = new Map();
        this.RtoSassociations = new Map();
        this.participants.forEach((participant, index) => {
            while (!this.StoRassociations.has(participant)) {
                const randIndex = Math.floor(Math.random() * possibleRecipients.length);
                const randRecipient = possibleRecipients[randIndex];
                // TODO : Triangle method (last 3 exchange to avoid that the last is alone)
                if (possibleRecipients.length == 1 && possibleRecipients[0] == participant) { // Check if case where last is alone
                    this.scramble();
                    return;
                }
                if (randRecipient != participant) {
                    this.StoRassociations.set(participant, randRecipient);
                    this.RtoSassociations.set(randRecipient, participant);
                    possibleRecipients.splice(randIndex, 1);
                }
            }
        });
    }
    isCompleted() {
        return this.completed;
    }
    getSanta(recipient) {
        return this.RtoSassociations.get(recipient);
    }
    getRecipient(santa) {
        return this.StoRassociations.get(santa);
    }
}
exports.SecretSantaList = SecretSantaList;
