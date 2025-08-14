function Card({ type, color, onCardClick }) {
  return (
    <button
      onClick={() => onCardClick(type)}
      className={`card ${type.toLowerCase()} ${
        color ? color.toLowerCase() : ''
      }`}
    >
      <h2>{color ? `${type}` : type}</h2>
    </button>
  );
}

export default Card;
