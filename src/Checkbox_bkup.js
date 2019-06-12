import React, { Component } from "react";
import PropTypes from "prop-types";

class Checkbox extends Component {
  state = {
    isChecked: false
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, genre_id } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }));
    console.log("is checked");
    console.log(isChecked);
    console.log("genre_id");
    console.log(genre_id);
    handleCheckboxChange(genre_id);
  };

  render() {
    const { label, genre_id } = this.props;
    const { isChecked } = this.state;

    console.log("label");
    console.log(label);
    console.log("is checked");
    console.log(isChecked);
    return (
      <div className="checkbox">
        <label>
          {label}{" "}
          <input
            type="checkbox"
            value={genre_id}
            onChange={this.toggleCheckboxChange}
            checked={isChecked}
          />
        </label>
      </div>
    );
  }
}
Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired
};
export default Checkbox;
