function Card({ interactive, type, color, onCardClick }) {
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

  // Build the file name exactly like your naming convention
  const fileName = color !== null ? `${type}-${color}.png` : `${type}.png`;

  // The key in cardImages must match the relative path used in the glob
  const imageSrc = `/cards/${fileName}`;

  return (
    <button
      onClick={() => onCardClick(type)}
      className={`card ${interactive ? 'interactive' : ''}`}
    >
      <img src={imageSrc} alt={cardNames[type]} />
    </button>
  );
}

export default Card;
