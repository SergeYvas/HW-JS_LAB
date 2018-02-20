const stdout = process.stdout;
const stdin  = process.stdin;


class CardDeck {
    constructor(name){
        this.deckName = name;
        this.initialCards = {
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
            ten: 10,
            king: 10,
            quin: 10,
            jack: 10,
            ace: 11
        };
        this.cards = this._formatObj();
    }

    _formatObj(){
        let names           = Object.keys(this.initialCards);
        let values          = Object.values(this.initialCards);
        let formattedValues = {};

        names.forEach((item, index )=> {
            formattedValues[`${this.deckName} ${item}`] = values[index];
        });

        return formattedValues;
    }
}

class ShuffleMachine {
    constructor(num){
        this.diamonds   = new CardDeck('Diamonds');
        this.hearts     = new CardDeck('Hearts');
        this.spades     = new CardDeck('Spades');
        this.clubs      = new CardDeck('Clubs');
        this.mainBase = {...this.diamonds.cards,
                           ...this.hearts.cards,
                           ...this.spades.cards,
                           ...this.clubs.cards };
        this.countOfDecks = parseInt(num) || 1;
        this.currentDeck  = this.shuffle(this.createPlayDeck());
    }
    createPlayDeck(){
        let keysArr     = Object.keys(this.mainBase);
        let currentDeck = [];
        let count       = this.countOfDecks;
            for(let i = 0; i < count; i++){
                let cloneArray = keysArr.slice(0);
                currentDeck.push(...cloneArray)
            }
        return currentDeck;
    }

    shuffle(arr){
        if (Array.isArray(arr)){

            return arr.sort(_randomize)
        } else {
            this.currentDeck.sort(_randomize);
            console.log(this.currentDeck);
        }


        function _randomize() {
            return Math.round(Math.random() * (1 - (-1)) + (-1));
        }
    }


    giveCard(){
        let cardName = this.currentDeck.pop();
        let card = {
            name:cardName,
            cost:this.mainBase[cardName]
        };


        return card;
    }
}

let shuffleBase = new ShuffleMachine(3);

let score = 0;
let card  = null;

stdin.on('data', data => {
    let buf = data.slice(0,data.length-2).toString();
    switch(buf){
        case 'give':
            card = shuffleBase.giveCard();
            card.cost === 11 && console.log('You have Ace! Chose value 11 or 1!');
            score = score + card.cost;

            score === 21 && console.log("\x1b[33m",'\nYou win',"\x1b[0m");
            score > 21 && console.log("\x1b[31m",'\nYou lose',"\x1b[0m");

            console.log(`\nCard ${card.name} with cost ${card.cost}`);
            console.log(`You'r score ${score}`);
            console.log(`Card in the desk ${shuffleBase.currentDeck.length}\n\n`);
            break;
        case 'score':
            console.log(`You'r score ${score}\n\n`);
            break;
        case 'reset':
            score = 0;
            shuffleBase = new ShuffleMachine(3);
            console.log(`You'r game is reset. New desk lenght is ${shuffleBase.currentDeck.length}}\n\n`);
            break;
    }


});

