import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const [count, setCount] = useState(0);
  const [cardsHand, setCardsHand] = useState([]);

  const drawCard = () => {
    setCardsHand((prevCards) => [
      ...prevCards,
      <Card key={prevCards.length} type="1" />,
    ]);

    console.log(cardsHand);
  };

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <button onClick={drawCard}>Draw Card</button>

      <div className="cards-hand">{cardsHand}</div>
    </>
  );
}

export default App;
