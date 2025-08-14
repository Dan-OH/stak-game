function Card({ type, color, onCardClick }) {
  const cardNames = {
    0: 'Block',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'Plus',
    11: 'Plus 2',
    12: 'Stak',
    13: 'Blank Stak',
    14: 'Inverted Stak',
    15: 'Super Stak',
    16: 'Star',
    17: 'Color Wheel',
  };

  return (
    <button
      onClick={() => onCardClick(type)}
      className={`card ${color !== null ? 'color-' + color : ''}`}
    >
      <h2>{cardNames[type]}</h2>
    </button>
  );
}

export default Card;
