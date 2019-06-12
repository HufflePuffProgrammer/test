import React, { Component } from "react";
import Checkbox from "./Checkbox";
import firebase from "./firebase.js";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      userName: "",
      items: [],
      dishLabelTypes: [],
      dishLabelsArrayName: [],
      checkboxes: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const dishlabelsRef = firebase.database().ref("dishlabels");

    // Read Checkbox label names and types from DB.
    dishlabelsRef.on("value", snapshot => {
      let dishLabels = snapshot.val();
      let dishLabelsArrayNameTemp = [];
      //let { checkboxes } = this.state;
      let checkboxesTemp = [];

      for (let d in dishLabels) {
        dishLabelsArrayNameTemp[d] = dishLabels[d];
        checkboxesTemp[d] = false;
      }

      this.setState({
        dishLabelsArrayName: dishLabelsArrayNameTemp,
        checkboxes: checkboxesTemp
      });
    });

    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].currentItem,
          user: items[item].userName,
          dishLabelTypes: items[item].type
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  removeItem(itemID) {
    const itemsRef = firebase.database().ref(`/items/${itemID}`);
    itemsRef.remove();
  }

  handleSubmit = event => {
    event.preventDefault();
    let dishtypes = {
      dessert: false,
      sidedish: false,
      maincourse: false
    };

    const itemsRef = firebase.database().ref("items");

    const items = {
      currentItem: this.state.currentItem,
      userName: this.state.userName,
      type: this.state.checkboxes
    };

    itemsRef.push(items);

    this.setState({
      currentItem: "",
      userName: "",
      checkboxes: []
    });
  };

  createCheckbox = (id, label) => (
    <Checkbox
      label={label}
      genre_id={id}
      isSelected={this.state.checkboxes[id]}
      onCheckboxChange={this.handleCheckboxChange}
      key={id}
    />
  );

  createCheckboxes = () => {
    let labelTypes = this.state.dishLabelsArrayName;
    let listCheckBoxes = [];

    for (let type in labelTypes) {
      listCheckBoxes.push(this.createCheckbox(type, labelTypes[type]));
    }
    return listCheckBoxes;
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  selectAllCheckboxes = isSelected => {
    for (let checkbox in this.state.checkboxes) {
      this.setState(prevState => ({
        checkboxes: { ...prevState.checkboxes, [checkbox]: isSelected }
      }));
    }
  };

  selectAll = () => this.selectAllCheckboxes(true);

  deselectAll = () => this.selectAllCheckboxes(false);

  handleCheckboxChange = event => {
    const { name, value } = event.target;

    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [value]: !prevState.checkboxes[value]
      }
    }));
  };

  renderFoodTypes = types => {
    let stringTypes = "";

    for (let type in types) {
      if (types[type]) {
        stringTypes = stringTypes.concat(
          ",",
          this.state.dishLabelsArrayName[type]
        );
      }
    }
    let stringReturn = stringTypes;
    if (stringTypes.indexOf(",") === 0) {
      stringReturn = stringTypes.slice(1);
    }
    return stringReturn;
  };

  render() {
    return (
      <div>
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="userName"
                placeholder="What's your name?"
                value={this.state.userName}
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="currentItem"
                placeholder="What are you bringing?"
                value={this.state.currentItem}
                onChange={this.handleChange}
              />

              {this.createCheckboxes()}
              <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.selectAll}
              >
                {" "}
                Select All
              </button>
              <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.deselectAll}
              >
                Deselect All
              </button>
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map(item => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>brought by - {item.user}</p>
                      <p>{this.renderFoodTypes(item.dishLabelTypes)}</p>
                      <button
                        onClick={() => {
                          this.removeItem(item.id);
                        }}
                      >
                        Remove Item
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
