// SelectColor.jsx
import './SelectColor.scss';

function SelectColor({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const handleClick = (colorNumber) => {
    if (onSelect) onSelect(colorNumber); // send number
    if (onClose) onClose(); // close modal
  };

  return (
    <div className="select-color-wrapper">
      <div className="select-color">
        <button
          onClick={() => handleClick(0)}
          className="select-color-button select-color-button--green"
        />
        <button
          onClick={() => handleClick(1)}
          className="select-color-button select-color-button--red"
        />
        <button
          onClick={() => handleClick(2)}
          className="select-color-button select-color-button--blue"
        />
        <button
          onClick={() => handleClick(3)}
          className="select-color-button select-color-button--yellow"
        />
      </div>
    </div>
  );
}

export default SelectColor;
