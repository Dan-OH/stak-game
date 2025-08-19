import { useState } from 'react';
import './App.scss';
import Card from './Card';
import SelectColor from './SelectColor';

// Build a deck of cards
function createDeck() {
  const colors = [0, 1, 2, 3];
  const deck = [];

  // Colored cards (0–12)
  const coloredCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  colors.forEach((color) => {
    coloredCards.forEach((type) => {
      deck.push({ type, color });
      deck.push({ type, color });
    });
  });

  // Colorless specials (13–16)
  const colorlessSpecials = [13, 14, 15, 16];
  colorlessSpecials.forEach((type) => {
    for (let i = 0; i < 2; i++) {
      deck.push({ type, color: null });
    }
  });

  // Wilds (17)
  for (let i = 0; i < 4; i++) {
    deck.push({ type: 17, color: null });
  }

  return deck;
}

function App() {
  const playerCount = 2; // can increase
  const [mustPickUp, setMustPickUp] = useState(0);
  const [cardsDiscard, setCardsDiscard] = useState([]);
  const [deck, setDeck] = useState(() => createDeck());
  const [turn, setTurn] = useState(0);
  const [stackColor, setStackColor] = useState(null);
  const [isInverted, setIsInverted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wildCardSelection, setWildCardSelection] = useState(null); // {player, index} or null

  // Initialize hands dynamically
  const [playerHands, setPlayerHands] = useState(
    Array.from({ length: playerCount }, () => [])
  );

  const drawCard = (playerIndex) => {
    if (stackColor !== null || isInverted) return;
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

  const handleColorSelect = (colorNumber) => {
    if (!wildCardSelection) return;

    const { player, index } = wildCardSelection;

    setPlayerHands((prevHands) => {
      const newHands = prevHands.map((hand) => [...hand]);
      const chosenCard = { ...newHands[player][index], color: colorNumber };

      // Move card to discard
      setCardsDiscard((prev) => [...prev, chosenCard]);

      // Remove card from player’s hand
      newHands[player] = newHands[player].filter((_, i) => i !== index);

      // Continue game
      nextTurn(chosenCard);

      return newHands;
    });

    setWildCardSelection(null);
    setModalOpen(false);
  };

  const endTurn = () => {
    const lastPlayed = cardsDiscard[cardsDiscard.length - 1];
    if (stackColor !== null || isInverted || lastPlayed?.type === 17) {
      // Skip next player
      if (lastPlayed) {
        // Skip functionality
        if (lastPlayed.type === 0) {
          setTurn((prev) => (prev + 2) % playerCount);
          setStackColor(null);
          setIsInverted(false);
          return;
        }

        // +2 functionality
        if (lastPlayed.type === 11) {
          setMustPickUp((prev) => prev + 2);
        }
      }

      setStackColor(null);
      setIsInverted(false);
      setTurn((prev) => (prev + 1) % playerCount);
    }
  };

  const nextTurn = (
    playedCard = null,
    currentStackColor = stackColor,
    currentIsInverted = isInverted
  ) => {
    if ([10, 16, 17].includes(playedCard?.type) || currentIsInverted) return;

    if (playedCard?.type === 0) {
      setTurn((prev) => (prev + 2) % playerCount);
      return;
    }

    if (playedCard?.type === 11 && currentStackColor === null) {
      setMustPickUp((prev) => prev + 2);
    }

    // Stackable cards
    if ([12, 13, 15].includes(playedCard?.type) && playedCard.color !== null) {
      setStackColor(playedCard.color);
      return;
    }

    // Inverted STAK
    if (playedCard?.type === 14) {
      setIsInverted(true);
      const discardLength = cardsDiscard.length;
      if (discardLength >= 1) {
        const cardBelow = cardsDiscard[discardLength - 1];
        setStackColor(cardBelow.color);
      }
      return;
    }

    // Handle stacking color rules
    if (currentStackColor != null && playedCard.color !== currentStackColor) {
      if (playedCard?.type === 11) {
        setMustPickUp((prev) => prev + 2);
      }
      setStackColor(null);
    } else if (
      currentStackColor != null &&
      playedCard.color === currentStackColor
    ) {
      return;
    }

    setTurn((prev) => (prev + 1) % playerCount);
  };

  const startGame = () => {
    // Rebuild a fresh deck
    setDeck(() => {
      let freshDeck = createDeck();

      // Reset states
      const hands = Array.from({ length: playerCount }, () => []);
      setPlayerHands(hands);
      setTurn(0);
      setMustPickUp(0);
      setStackColor(null);
      setIsInverted(false);

      // Deal 8 to each player
      for (let i = 0; i < 8; i++) {
        for (let p = 0; p < playerCount; p++) {
          if (freshDeck.length === 0) break;
          const idx = Math.floor(Math.random() * freshDeck.length);
          const card = freshDeck.splice(idx, 1)[0];
          hands[p].push(card);
        }
      }

      // Flip starting discard
      if (freshDeck.length > 0) {
        const idx = Math.floor(Math.random() * freshDeck.length);
        const top = freshDeck.splice(idx, 1)[0];
        setCardsDiscard([top]);
      } else {
        setCardsDiscard([]);
      }

      // Apply updated hands
      setPlayerHands(hands);
      return freshDeck;
    });
  };

  const handleHandCardClick = (cardIndex, playerIndex) => {
    const clickedCard = playerHands[playerIndex][cardIndex];
    const topDiscard = cardsDiscard[cardsDiscard.length - 1];

    if (playerIndex !== turn) return;

    // Handle Inverted STAK
    if (isInverted) {
      if (
        clickedCard.color === stackColor ||
        !(clickedCard.type >= 1 && clickedCard.type <= 9)
      ) {
        return;
      }
    } else {
      // Handle mustPickUp rules
      if (
        mustPickUp > 0 &&
        (clickedCard.type === 16 || clickedCard.type === 11)
      ) {
        if (clickedCard.type === 16) setMustPickUp(0);
      } else if (mustPickUp === 0) {
        // Handle normal play rules
        if (
          clickedCard.type === 14 &&
          (!topDiscard || topDiscard.color === null)
        ) {
          // cannot play inverted STAK here
          return;
        }

        if (
          topDiscard?.color === null ||
          clickedCard.color === topDiscard?.color ||
          clickedCard.type === topDiscard?.type ||
          clickedCard.color === null ||
          (clickedCard.type === 12 && topDiscard?.type === 13)
        ) {
          if (
            clickedCard.type === 13 &&
            topDiscard &&
            topDiscard.color !== null
          ) {
            clickedCard.color = topDiscard.color;
          }
          if ([17, 15].includes(clickedCard.type)) {
            setWildCardSelection({ player: playerIndex, index: cardIndex });
            setModalOpen(true);
            // stop until color is chosen
            return;
          }
        } else {
          return;
        }
      } else {
        return;
      }
    }

    // Play the card
    setCardsDiscard((prev) => [...prev, clickedCard]);
    setPlayerHands((prev) =>
      prev.map((hand, idx) =>
        idx === playerIndex ? hand.filter((_, i) => i !== cardIndex) : hand
      )
    );
    nextTurn(clickedCard);
  };

  return (
    <>
      <button className="btn" onClick={startGame}>
        Start Game
      </button>
      <button className="btn" onClick={() => drawCard(turn)}>
        Draw Card (Player {turn + 1})
      </button>
      <button className="btn" onClick={endTurn}>
        End Turn
      </button>

      <div>Cards left: {deck.length}</div>

      <div className="discard-pile">
        {cardsDiscard.length > 0 && (
          <Card
            type={cardsDiscard[cardsDiscard.length - 1].type}
            color={cardsDiscard[cardsDiscard.length - 1].color}
          />
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
                  interactive={playerIndex === turn}
                  key={index}
                  type={card.type}
                  color={card.color}
                  onCardClick={() => handleHandCardClick(index, playerIndex)}
                  grayed={playerIndex !== turn}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SelectColor
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleColorSelect}
      />
    </>
  );
}

export default App;
