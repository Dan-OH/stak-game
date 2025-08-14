import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const [count, setCount] = useState(0);
  const [cardsHand, setCardsHand] = useState([]);
  const [deck, setDeck] = useState(createDeck());

  //colored cards
  function createDeck() {
    const baseCards = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '+2',
      'Block',
      'STAK',
      'Plus',
    ];
    const colors = ['Green', 'Red', 'Blue', 'Yellow'];

    let deck = [];

    for (const color of colors) {
      for (const card of baseCards) {
        deck.push({ type: card, color });
      }
    }

    //special cards
    deck.push({ type: 'Blank STAK' }, { type: 'Blank STAK' });
    deck.push({ type: 'Inverted STAK' }, { type: 'Inverted STAK' });
    deck.push({ type: 'Star' }, { type: 'Star' });
    deck.push({ type: 'Super STAK' }, { type: 'Super STAK' });
    deck.push(
      { type: 'Color Wheel' },
      { type: 'Color Wheel' },
      { type: 'Color Wheel' },
      { type: 'Color Wheel' }
    );

    return deck;
  }

  const drawCard = () => {
    if (deck.length === 0) return;

    const randomIndex = Math.floor(Math.random() * deck.length); // pick random index
    const card = deck[randomIndex];

    setCardsHand((prev) => [...prev, card]); // add to hand
    setDeck((prevDeck) => prevDeck.filter((_, i) => i !== randomIndex)); // remove from deck
  };

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <button onClick={drawCard}>Draw Card</button>

      <div className="cards-hand">
        {cardsHand.map((card, index) => (
          <Card key={index} type={card.type} color={card.color} />
        ))}
      </div>

      <div>Cards left: {deck.length}</div>
    </>
  );
}

export default App;
