import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const [cardsDiscard, setCardsDiscard] = useState([]);
  const [cardsHand, setCardsHand] = useState([]);
  const [deck, setDeck] = useState(createDeck());
  const [cardsHandTwo, setCardsHandTwo] = useState([]);

  //colored cards
  function createDeck() {
    const colors = [0, 1, 2, 3]; // Representing the 4 colors
    const deck = [];

    // Cards per color
    const coloredCards = [
      0, // block
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10, // PLUS
      11, // PLUS 2
      12, // STAK
    ];

    // Add colored cards (1 of each per color)
    colors.forEach((color) => {
      coloredCards.forEach((type) => {
        deck.push({ type, color });
      });
    });

    // Colorless cards (2 copies each)
    const colorlessSpecials = [
      13, // Blank STAK
      14, // Inverted STAK
      15, // Super STAK
      16, // STAR
    ];

    colorlessSpecials.forEach((type) => {
      for (let i = 0; i < 2; i++) {
        deck.push({ type, color: null });
      }
    });

    // Color Wheel cards (4 copies)
    for (let i = 0; i < 4; i++) {
      deck.push({ type: 17, color: null });
    }

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

  // discarding cards
  const handleHandCardClick = (cardIndex) => {
    const clickedCard = cardsHand[cardIndex];

    const topDiscard = cardsDiscard[cardsDiscard.length - 1];

    if (
      topDiscard.color === null ||
      clickedCard.color === topDiscard.color ||
      clickedCard.type === topDiscard.type ||
      clickedCard.color === null
    ) {
      // add to discard
      setCardsDiscard((prev) => [...prev, clickedCard]);

      // remove from hand
      setCardsHand((prev) => prev.filter((_, i) => i !== cardIndex));
    }
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

      <div className="local-players">
        <div className="cards-hand local-player player-1">
          {cardsHand.map((card, index) => (
            <Card
              key={index}
              type={card.type}
              color={card.color}
              onCardClick={() => handleHandCardClick(index)}
            />
          ))}
        </div>

        <div className="cards-hand local-player player-2">
          {cardsHandTwo.map((card, index) => (
            <Card
              key={index}
              type={card.type}
              color={card.color}
              onCardClick={() => handleHandCardClick(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
