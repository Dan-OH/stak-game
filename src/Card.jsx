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

  // If Blank Stak or Super Stak has a color, display as normal Stak
  const displayType =
    (type === 13 || type === 15) && color !== null ? 12 : type;

  // Use color in filename if it exists
  const fileName =
    color !== null ? `${displayType}-${color}.png` : `${displayType}.png`;

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
