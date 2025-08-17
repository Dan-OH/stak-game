import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const playerCount = 2; // can increase
  const [mustPickUp, setMustPickUp] = useState(0);
  const [cardsDiscard, setCardsDiscard] = useState([]);
  const [deck, setDeck] = useState(createDeck());
  const [turn, setTurn] = useState(0);

  // Initialize hands dynamically
  const [playerHands, setPlayerHands] = useState(
    Array.from({ length: playerCount }, () => [])
  );

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

  const drawCard = (playerIndex) => {
    const timesToDraw = mustPickUp > 0 ? mustPickUp : 1;

    setPlayerHands((prevHands) => {
      const newHands = prevHands.map((hand) => [...hand]);
      const newDeck = [...deck];

      for (let i = 0; i < timesToDraw; i++) {
        if (newDeck.length === 0) break;

        const randomIndex = Math.floor(Math.random() * newDeck.length);
        const card = newDeck.splice(randomIndex, 1)[0];

        newHands[playerIndex].push(card);
      }

      setDeck(newDeck);
      return newHands;
    });

    if (mustPickUp > 0) setMustPickUp(0);

    nextTurn({ type: null, color: null });
  };

  const nextTurn = (playedCard = null) => {
    if ([10, 16, 17].includes(playedCard?.type)) return;

    if (playedCard?.type === 0) {
      // skip next player
      setTurn((prev) => (prev + 2) % playerCount);
      return;
    }

    if (playedCard?.type === 11) {
      setMustPickUp((prev) => prev + 2);
    }

    setTurn((prev) => (prev + 1) % playerCount);
  };

  const startGame = () => {
    for (let i = 0; i < 8; i++) {
      for (let player = 0; player < playerCount; player++) {
        drawCard(player);
      }
    }

    setDeck((prevDeck) => {
      if (prevDeck.length === 0) return prevDeck;

      const randomIndex = Math.floor(Math.random() * prevDeck.length);
      const card = prevDeck[randomIndex];

      setCardsDiscard([card]);
      return prevDeck.filter((_, i) => i !== randomIndex);
    });
  };

  const handleHandCardClick = (cardIndex, playerIndex) => {
    const clickedCard = playerHands[playerIndex][cardIndex];
    const topDiscard = cardsDiscard[cardsDiscard.length - 1];

    if (playerIndex === turn) {
      if (
        mustPickUp > 0 &&
        (clickedCard.type === 16 || clickedCard.type === 11)
      ) {
        if (clickedCard.type === 16) setMustPickUp(0);
      } else if (
        mustPickUp === 0 &&
        (topDiscard?.color === null ||
          clickedCard.color === topDiscard?.color ||
          clickedCard.type === topDiscard?.type ||
          clickedCard.color === null ||
          (clickedCard.type === 12 && topDiscard?.type === 13))
      ) {
        if (clickedCard.type === 13 && topDiscard) {
          clickedCard.color = topDiscard.color;
        }
      } else {
        return;
      }

      setCardsDiscard((prev) => [...prev, clickedCard]);

      setPlayerHands((prev) =>
        prev.map((hand, idx) =>
          idx === playerIndex ? hand.filter((_, i) => i !== cardIndex) : hand
        )
      );

      nextTurn(clickedCard);
    }
  };

  return (
    <>
      <button className="btn" onClick={() => drawCard(turn)}>
        Draw Card (Player {turn + 1})
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
        {playerHands.map((hand, playerIndex) => (
          <div
            key={playerIndex}
            className={`cards-hand local-player player-${playerIndex + 1}`}
          >
            <h2>Player {playerIndex + 1}</h2>
            <div className="cards-hand-grid">
              {hand.map((card, index) => (
                <Card
                  interactive
                  key={index}
                  type={card.type}
                  color={card.color}
                  onCardClick={() => handleHandCardClick(index, playerIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
