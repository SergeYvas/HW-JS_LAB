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

class Player {
    constructor(role = 'person'){
        this.role = role;
        this.score = 0;
        this.currentCard = {};
        this.cardInHand = [];
    }
    takeCard(){
        if(this.role === 'person'){
            this.currentCard = shuffleBase.giveCard();
            this.cardInHand.cost === 11 && this.choseValueOfAce();
            console.log(`${this.role} take a ${this.currentCard.name} with cost ${this.currentCard.cost}\n`);
            this.figureoutScore();
            this.cardInHand.push(this.currentCard)
        } else {
            this.currentCard = shuffleBase.giveCard();
            console.log(`${this.role} take aa ${this.currentCard.name} with cost ${this.currentCard.cost}\n`);
            this.figureoutScore();
            this.cardInHand.push(this.currentCard)
        }
    }
    choseValueOfAce(){
        stdout.write('You have Ace! Chose value 11 or 1!\n');
        stdin.on('data', data => {
            let buf = parseInt(data.slice(0,data.length-2));
            switch (buf){
                case buf === 1:
                    this.currentCard.cost = 1;
                    break;
                case buf === 11:
                    this.currentCard.cost = 11;
                    break;
                default:
                    this.currentCard.cost = 11;
                    break;
            }
        })
    }
    figureoutScore(){
        this.score = this.score + this.currentCard.cost;
    }
    showScore(){
        console.log(`The ${this.role} score is ${this.score}\n`)
    }
    myCards(){
        this.cardInHand.forEach(item=>{
            let msg = `Card ${item.name} with cost ${item.cost}\n`;
            stdout.write(msg)
        })
    }
    reset(){
        this.score = 0;
        this.currentCard = {};
        this.cardInHand = [];
    }
}



blackJack();
const shuffleBase = new ShuffleMachine(3);
const dialer = new Player('dialer');
const person = new Player('person');

function blackJack() {
    stdout.write('Welcome to BlackJack!\n');
    stdin.on('data', data => {
        let buf = data.slice(0,data.length-2).toString();
        switch(buf){
            case 'take':
                person.takeCard();
                dialer.takeCard();
                if(person.score > 21){
                    console.log('Person lose');
                    person.showScore();
                    dialer.showScore();
                    person.myCards();
                    dialer.reset();
                    person.reset();
                    break;
                } else if (person.score === 21){
                    console.log('Person win');
                    person.showScore();
                    dialer.showScore();
                    person.myCards();
                    dialer.reset();
                    person.reset();
                    break;
                } else {
                    person.showScore();
                }
                if(dialer.score > 21){
                    console.log('Dialer lose');
                    dialer.showScore();
                    person.showScore();
                    dialer.myCards();
                    dialer.reset();
                    person.reset();
                    break;
                } else if (dialer.score === 21){
                    console.log('Dialer win');
                    dialer.showScore();
                    person.showScore();
                    dialer.myCards();
                    dialer.reset();
                    person.reset();
                    break;
                } else {
                    dialer.showScore();
                }

                break;
            case 'my cards':
                person.myCards();
                break;
            case 'score':
                person.showScore();
                dialer.showScore();
                break;
        }


    });

}

