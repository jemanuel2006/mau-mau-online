import { Scene } from 'phaser';
import cardsJson from './assets/cards.json';
import { Card } from './card';
import { Hand } from './hand';
import { shuffle } from './helpers';

class BoardScene extends Scene {
    constructor() {
        super('scene-game');
        this.stack = [];
        this.deck = [];
        this.hand = null;
    }

    preload (){
        this.load.atlas('cards', 'assets/cards.png', 'assets/cards.json');
    }

    create (){
        //  Create a stack of random cards
        let frames = shuffle(this.textures.get('cards').getFrameNames().filter(c => c !== 'back'));

        let x = 100;
        const y = 450;

        const selectedCards = [];

        for (var i = 0; i < 7; i++) {
            const frame = Phaser.Math.RND.pick(frames);
            const image = this.add.image(x, y, 'cards', frame).setScale(.75).setInteractive({ clickable: true });
            const [ cardInfo ] = cardsJson.frames.filter(c => c.filename === frame);

            selectedCards.push(new Card(cardInfo.info.suit, cardInfo.info.value, image));

            x += 30;

            frames.splice(frames.indexOf(frame), 1);
        }

        this.deck = frames.map(f => {
            const [ cardInfo ] = cardsJson.frames.filter(c => c.filename === f);
            const obj = this.add.image(x, y, 'cards', f);
            obj.visible = false;

            return new Card(cardInfo.info.suit, cardInfo.info.value, obj);
        });

        this.hand = new Hand(selectedCards, this.onPlayCard.bind(this), this.onNotAllowedCard.bind(this));

        //Deck
        const deck = this.add.image(450, 250, 'cards', 'back').setScale(.75).setInteractive({ clickable: true });

        this.input.on('pointerover', (_, justOver) => {
            const [ obj ] = justOver;

            if(obj == deck){
                return;
            }

            obj.y -= 40;
        });

        this.input.on('pointerout', (_, justOut) => {
            const [ obj ] = justOut;

            if(obj == deck){
                return;
            }

            obj.y += 40;
        });

        this.input.on('pointerup', (_, currentlyOver) => {
            const [ obj ] = currentlyOver;

            if(!obj){
                return;
            }

            if(obj === deck){
                const draw = this.deck.pop();

                if(!draw){
                    //reshuffle
                    this.showMessage('Cards are over, Reshuffling...')
                }

                const gameObject = this.add.image(x, y, 'cards', draw.gameObject.frame.name).setScale(.75).setInteractive({ clickable: true });
                this.hand.addCard(new Card(draw.suit, draw.value, gameObject));
                this.reorderCards(this.hand);
            } else {
                this.hand.playCard(obj, this.stack.length ? this.stack[this.stack.length - 1] : undefined);
                this.reorderCards(this.hand);
            }
        });
    }

    reorderCards(hand){
        let x = 100;
        hand.cards.forEach(c => {
            c.gameObject.x = x;
            x += 30;
        });
    }

    onPlayCard(card){
        const obj = this.add.image(575, 250, 'cards', card.gameObject.frame.name).setScale(.75);
        card.gameObject.destroy();
        card.gameObject = obj;
        this.stack.push(card);
        this.reorderCards(this.hand);
    }

    onNotAllowedCard(card){
        this.showMessage('Not allowed to play this card');
    }

    showMessage(text){
        const textObject = this.add.text(16, 16, text, { fontSize: '32px', fill: '#000' });
        setTimeout(() => {
            textObject.destroy();
        }, 3000);
    }
}
export {
    BoardScene
};