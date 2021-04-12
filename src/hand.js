export class Hand {
    constructor(cards, onPlayCard, onNotAllowedCard){
        this.cards = cards;
        this.onPlayCard = onPlayCard;
        this.onNotAllowedCard = onNotAllowedCard;
    }

    playCard(gameObject, cardOnTop){
        const [ card ] = this.cards.filter(c => c.gameObject === gameObject);

        if(!cardOnTop || card.allowedToPlayOver(cardOnTop)){
            this.cards.splice(this.cards.indexOf(card), 1);
            this.onPlayCard(card);
        } else {
            this.onNotAllowedCard(card);
        }
    }

    addCard(card){
        this.cards.push(card);
    }
}