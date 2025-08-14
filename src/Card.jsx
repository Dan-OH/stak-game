function Card({ type, color }) {
  return (
    <div
      className="card"
      style={{
        backgroundColor: color ? color.toLowerCase() : 'lightgray',
      }}
    >
      <h2 className="card-type">{color ? `${type}` : type}</h2>
    </div>
  );
}

export default Card;
