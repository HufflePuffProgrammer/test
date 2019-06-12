import React from "react";

const Checkbox = ({ label, genre_id, isSelected, onCheckboxChange }) => (
  <div className="checkbox">
    <label>
      <input
        type="checkbox"
        key={genre_id}
        name={label}
        value={genre_id}
        onChange={onCheckboxChange}
        checked={isSelected}
        className="form-check-input"
      />
      {label}
    </label>
  </div>
);

export default Checkbox;
