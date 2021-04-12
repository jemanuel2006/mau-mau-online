export class Card {
    constructor(suit, value, gameObject){
        this.suit = suit;
        this.value = value;
        this.gameObject = gameObject;
    }

    allowedToPlayOver(card){
        return this.suit === card.suit || this.value === card.value;
    }
}