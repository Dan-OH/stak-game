import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const [cardsDiscard, setCardsDiscard] = useState([]);
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

  const drawRandomCard = (fromArray, setFromArray, toArray, setToArray) => {
    if (fromArray.length === 0) return;

    const randomIndex = Math.floor(Math.random() * fromArray.length);
    const card = fromArray[randomIndex];

    setToArray((prev) => [...prev, card]);

    setFromArray((prev) => prev.filter((_, i) => i !== randomIndex));
  };

  const drawCard = () => drawRandomCard(deck, setDeck, cardsHand, setCardsHand);
  const startDiscard = () =>
    drawRandomCard(deck, setDeck, cardsDiscard, setCardsDiscard);

  const handleHandCardClick = (cardIndex) => {
    const clickedCard = cardsHand[cardIndex];

    // add the card to the top of the discard pile
    setCardsDiscard((prev) => [...prev, clickedCard]);

    // remove the card from the hand
    setCardsHand((prev) => prev.filter((_, i) => i !== cardIndex));
  };

  return (
    <>
      <button onClick={drawCard}>Draw Card</button>
      <button onClick={startDiscard}>Add to Discard</button>

      <div>Cards left: {deck.length}</div>

      <div className="discard-pile">
        {cardsDiscard.length > 0 ? (
          <Card
            type={cardsDiscard[cardsDiscard.length - 1].type}
            color={cardsDiscard[cardsDiscard.length - 1].color}
          />
        ) : (
          <div>Empty</div>
        )}
      </div>

      <div className="cards-hand">
        {cardsHand.map((card, index) => (
          <Card
            key={index}
            type={card.type}
            color={card.color}
            onCardClick={() => handleHandCardClick(index)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
