import { useEffect, useState } from 'react';
import './App.scss';
import Card from './Card';
import SelectColor from './SelectColor';

function App() {
  const playerCount = 2; // can increase
  const [mustPickUp, setMustPickUp] = useState(0);
  const [cardsDiscard, setCardsDiscard] = useState([]);
  const [deck, setDeck] = useState(createDeck());
  const [turn, setTurn] = useState(0);
  const [stakColor, setStakColor] = useState(null);
  const [invertedState, setInvertedState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wildCardIndex, setWildCardIndex] = useState(null); // track which card is being colored
  const [wildCardPlayer, setWildCardPlayer] = useState(null);
  // Initialize hands dynamically
  const [playerHands, setPlayerHands] = useState(
    Array.from({ length: playerCount }, () => [])
  );

  // win conditions
  useEffect(() => {
    for (let i = 0; i < playerCount; i++) {
      if (playerHands[i].length === 0) {
        console.log('you win');
      }
    }
  }, [turn]);

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
    if (stakColor !== null || invertedState === true) return;
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
    if (wildCardIndex !== null && wildCardPlayer !== null) {
      setPlayerHands((prevHands) => {
        const newHands = prevHands.map((hand) => [...hand]);
        newHands[wildCardPlayer][wildCardIndex].color = colorNumber;
        return newHands;
      });

      // Pull the card after color is assigned
      const card = playerHands[wildCardPlayer][wildCardIndex];
      card.color = colorNumber; // ensure color is set

      setCardsDiscard((prev) => [...prev, card]);

      setPlayerHands((prevHands) =>
        prevHands.map((hand, idx) =>
          idx === wildCardPlayer
            ? hand.filter((_, i) => i !== wildCardIndex)
            : hand
        )
      );

      // Now that color is set, STAK rules will work
      nextTurn(card);

      setWildCardIndex(null);
      setWildCardPlayer(null);
      setModalOpen(false);
    }
  };

  const endTurn = () => {
    const lastPlayed = cardsDiscard[cardsDiscard.length - 1];
    if (
      stakColor !== null ||
      invertedState === true ||
      lastPlayed.type === 17
    ) {
      if (lastPlayed) {
        // Skip next player
        if (lastPlayed.type === 0) {
          setTurn((prev) => (prev + 2) % playerCount);
          setStakColor(null);
          setInvertedState(false);
          return;
        }

        // +2 functionality
        if (lastPlayed.type === 11) {
          setMustPickUp((prev) => prev + 2);
        }
      }

      // Clear STAK/inverted and advance turn
      setStakColor(null);
      setInvertedState(false);
      setTurn((prev) => (prev + 1) % playerCount);
    }
  };

  const nextTurn = (
    playedCard = null,
    currentStakColor = stakColor,
    currentInvertedState = invertedState
  ) => {
    if (
      [10, 16, 17].includes(playedCard?.type) ||
      currentInvertedState === true
    )
      return;

    // Skip next player
    if (playedCard?.type === 0) {
      setTurn((prev) => (prev + 2) % playerCount);
      return;
    }

    // +2 functionality
    if (playedCard?.type === 11 && currentStakColor === null) {
      setMustPickUp((prev) => prev + 2);
    }

    // STAK cards
    if ([12, 13, 15].includes(playedCard?.type)) {
      if (playedCard.color !== null) {
        // only apply once color is chosen
        setStakColor(playedCard.color);
        return;
      }
    }

    // Inverted STAK
    if (playedCard?.type === 14) {
      setInvertedState(true);

      // get color of the card below this one in discard pile
      const discardLength = cardsDiscard.length;
      if (discardLength >= 1) {
        const cardBelow = cardsDiscard[discardLength - 1]; // card below is last in array
        setStakColor(cardBelow.color);
      }

      return;
    }

    // Handle stacking color rules
    if (currentStakColor != null && playedCard.color !== currentStakColor) {
      if (playedCard?.type === 11) {
        setMustPickUp((prev) => prev + 2);
      }
      setStakColor(null);
    } else if (
      currentStakColor != null &&
      playedCard.color === currentStakColor
    ) {
      return;
    }

    setTurn((prev) => (prev + 1) % playerCount);
  };

  const startGame = () => {
    setDeck(() => {
      // Rebuild a fresh deck
      let freshDeck = createDeck();

      // Reset states
      const hands = Array.from({ length: playerCount }, () => []);
      setPlayerHands(hands);
      setTurn(0);
      setMustPickUp(0);
      setStakColor(null);
      setInvertedState(false);

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
    if (invertedState === true) {
      if (
        clickedCard.color === stakColor ||
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
      }
      // Handle normal play rules
      else if (mustPickUp === 0) {
        // Prevent inverted STAK (type 14) on colorless cards
        if (
          clickedCard.type === 14 &&
          (!topDiscard || topDiscard.color === null)
        ) {
          return; // cannot play inverted STAK here
        }

        if (
          topDiscard?.color === null ||
          clickedCard.color === topDiscard?.color ||
          clickedCard.type === topDiscard?.type ||
          clickedCard.color === null ||
          (clickedCard.type === 12 && topDiscard?.type === 13)
        ) {
          if (clickedCard.type === 13 && topDiscard) {
            if (topDiscard.color === null) {
              return;
            }
            clickedCard.color = topDiscard.color;
          }
          if (
            (clickedCard.type === 17 || clickedCard.type === 15) &&
            topDiscard
          ) {
            setWildCardIndex(cardIndex);
            setWildCardPlayer(playerIndex);
            setModalOpen(true);
            return; // stop until color is chosen
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
