import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const playerCount = 2; // change later
  const [mustPickUp, setMustPickUp] = useState(0);
  const [cardsDiscard, setCardsDiscard] = useState([]);
  const [cardsHand, setCardsHand] = useState([]);
  const [cardsHandTwo, setCardsHandTwo] = useState([]);
  const [deck, setDeck] = useState(createDeck());
  const [turn, setTurn] = useState(1);

  function createDeck() {
    const colors = [0, 1, 2, 3];
    const deck = [];

    const coloredCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    colors.forEach((color) => {
      coloredCards.forEach((type) => {
        deck.push({ type, color });
        deck.push({ type, color });
      });
    });

    const colorlessSpecials = [13, 14, 15, 16];
    colorlessSpecials.forEach((type) => {
      for (let i = 0; i < 2; i++) {
        deck.push({ type, color: null });
      }
    });

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

  const drawCard = (player) => {
    const playerHand = player === 1 ? cardsHand : cardsHandTwo;
    const setPlayerHand = player === 1 ? setCardsHand : setCardsHandTwo;

    const timesToDraw = mustPickUp > 0 ? mustPickUp : 1;
    for (let i = 0; i < timesToDraw; i++) {
      drawRandomCard(deck, setDeck, playerHand, setPlayerHand);
    }

    if (mustPickUp > 0) setMustPickUp(0);

    nextTurn({ type: null, color: null });
  };

  const nextTurn = (playedCard = null) => {
    if ([10, 16, 17].includes(playedCard?.type)) return; // Plus, Star, Color Wheel

    if (playedCard?.type === 0) {
      setTurn((prev) => ((prev + 1) % playerCount) + 1);
      return;
    }

    // +2 card
    if (playedCard?.type === 11) {
      setMustPickUp((prev) => prev + 2);
    }

    setTurn((prev) => (prev % playerCount) + 1);
  };

  const startGame = () => {
    for (let i = 0; i < 8; i++) {
      for (let player = 1; player <= playerCount; player++) {
        drawCard(player);
      }
    }
    drawRandomCard(deck, setDeck, cardsDiscard, setCardsDiscard);
  };

  const handleHandCardClick = (cardIndex, player) => {
    const playerHand = player === 1 ? cardsHand : cardsHandTwo;
    const setPlayerHand = player === 1 ? setCardsHand : setCardsHandTwo;
    const clickedCard = playerHand[cardIndex];
    const topDiscard = cardsDiscard[cardsDiscard.length - 1];

    if (mustPickUp > 0) {
      if (
        player === turn &&
        (clickedCard.type === 16 || clickedCard.type === 11)
      ) {
        if (clickedCard.type === 16) setMustPickUp(0);
        setCardsDiscard((prev) => [...prev, clickedCard]);
        setPlayerHand((prev) => prev.filter((_, i) => i !== cardIndex));
        nextTurn(clickedCard);
      }
    } else {
      if (
        player === turn &&
        (topDiscard?.color === null ||
          clickedCard.color === topDiscard?.color ||
          clickedCard.type === topDiscard?.type ||
          clickedCard.color === null ||
          (clickedCard.type === 12 && topDiscard?.type === 15))
      ) {
        if (clickedCard.type === 15 && topDiscard) {
          clickedCard.color = topDiscard.color;
        }

        setCardsDiscard((prev) => [...prev, clickedCard]);
        setPlayerHand((prev) => prev.filter((_, i) => i !== cardIndex));

        nextTurn(clickedCard);
      }
    }
  };

  return (
    <>
      <button className="btn" onClick={() => drawCard(turn)}>
        Draw Card (Player {turn})
      </button>
      <button className="btn" onClick={startGame}>
        Start Game
      </button>

      <div>Cards left: {deck.length}</div>
      <div>Pickup Amount: {mustPickUp}</div>

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
        {[1, 2].map((playerNum) => {
          const playerHand = playerNum === 1 ? cardsHand : cardsHandTwo;
          return (
            <div
              key={playerNum}
              className={`cards-hand local-player player-${playerNum}`}
            >
              <h2>Player {playerNum}</h2>
              <div className="cards-hand-grid">
                {playerHand.map((card, index) => (
                  <Card
                    interactive
                    key={index}
                    type={card.type}
                    color={card.color}
                    onCardClick={() => handleHandCardClick(index, playerNum)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
