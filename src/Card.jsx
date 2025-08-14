function Card({ type, color }) {
  return (
    <div
      className={`card ${type.toLowerCase()} ${
        color ? color.toLowerCase() : ''
      }`}
    >
      <h2>{color ? `${type}` : type}</h2>
    </div>
  );
}

export default Card;
