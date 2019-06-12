import React, { Component } from "react";
import Checkbox from "./Checkbox";
import firebase from "./firebase.js";

import "./App.css";

//16
const OPTIONS = ["one", "two", "three"];

const genres = [
  { id: "maincourse" },
  { label: "Main Course" },
  { id: "sidedish" },
  { label: "Side Dish" },
  { id: "dessert" },
  { label: "Dessert" }
];

const foodLabelTypes = {
  maincourse: "Main Course",
  sidedish: "Side Dish",
  dessert: "Dessert"
};

class App extends Component {
  componentWillMount = () => {
    // var firebaseConfig = {
    //   apiKey: "AIzaSyAj0bMYHcsNUbyCDakCQGSzH6kCZ_S3sQQ",
    //   authDomain: "test2-2813f.firebaseapp.com",
    //   databaseURL: "https://test2-2813f.firebaseio.com",
    //   projectId: "test2-2813f",
    //   storageBucket: "test2-2813f.appspot.com",
    //   messagingSenderId: "202543370394",
    //   appId: "1:202543370394:web:3cdb59955d3bea3f"
    // };
    // Initialize Firebase
    //  firebase.initializeApp(firebaseConfig);
    // firebase
    //     .database()
    //     .ref("movies/003")
    //     .set({
    //       movie_val: "Spiderman",
    //       genre_id: "comingofage",
    //       genre_val: "Coming Of Age",
    //       good_use_of_id: "chardialogue",
    //       good_use_of_val: "Character Dialogue"
    //      })
    //   .then(() => {
    //       console.log("Inserted! C'est bon.");
    //     })
    //     .catch(error => {
    //     console.log("Inserted! ERROR! NOO ");
    //    });

    //   this.selectedCheckboxes = new Set();
    // };

    // READ DB
    // firebase
    //   .database()
    //   .ref("movies")
    //   .on("value", data => {
    //     console.log(data.toJSON());
    //   });

    //setTimeout(() => {
    // firebase
    //   .database()
    //   .ref("movies/004")
    //   .set({
    //     movie_val: "Outlander",
    //     genre_id: "drama",
    //     genre_val: "Drama",
    //     good_use_of_id: "characterflaw",
    //     good_use_of_val: "good use of Char flaw"
    //   })
    //   .then(() => {
    //     console.log("Inserted! C'est bon.");
    //   })
    //   .catch(error => {
    //     console.log("Inserted! ERROR! NOO ");
    //   });
    //}, 5000);

    // firebase
    //   .database()
    //   .ref("movies/004")
    //   .update({
    //     gendre_id: "chickflick",
    //     genre_val: "Chick Flick"
    //   });

    this.selectedCheckboxes = new Set();
  };

  constructor() {
    super();
    this.state = {
      currentItem: "",
      userName: "",
      items: [],
      type: {
        dessert: false,
        sidedish: false,
        maincourse: false
      },
      dishLabelTypes: [],
      dishLabelsArrayName: [],
      //16
      checkBoxes: OPTIONS.reduce(
        (options, option) => ({
          ...options,
          [option]: false
        }),
        {}
      )
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

      for (let d in dishLabels) {
        dishLabelsArrayNameTemp[d] = dishLabels[d];
      }
      this.setState({
        dishLabelsArrayName: dishLabelsArrayNameTemp
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
  toggleCheckbox = genre_id => {
    if (this.selectedCheckboxes.has(genre_id)) {
      this.selectedCheckboxes.delete(genre_id);
    } else {
      this.selectedCheckboxes.add(genre_id);
    }
  };

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

    //16
    Object.keys(this.state.checkboxes)
      .filter(checkbox => this.state.checkboxes[checkbox])
      .forEach(checkbox => {
        console.log(checkbox, " is selected");
      });

    console.log("Submit before for loop");
    for (const checkbox of this.selectedCheckboxes) {
      console.log(checkbox, "is selected.");
      this.selectedCheckboxes.delete(checkbox);
    }

    for (let checkbox of this.selectedCheckboxes) {
      dishtypes[checkbox] = true;
    }

    const itemsRef = firebase.database().ref("items");

    const items = {
      currentItem: this.state.currentItem,
      userName: this.state.userName,
      type: dishtypes
    };

    itemsRef.push(items);
    //TO DO this.selectedCheckboxes = new Set();
    this.selectedCheckboxes = new Set();
    this.setState({
      currentItem: "",
      userName: "",
      type: {
        dessert: false,
        sidedish: false,
        maincourse: false
      }
    });
    for (let cb of this.selectedCheckboxes) {
      console.log(cb, " is deleted.");
      this.selectedCheckboxes.delete(cb);
    }
  };

  createCheckbox = (id, label) => (
    <Checkbox
      key={id}
      genre_id={id}
      label={label}
      handleCheckboxChange={this.toggleCheckbox}
    />
  );

  createCheckboxes = () => {
    let labelTypes = this.state.dishLabelsArrayName;
    let listCheckBoxes = [];

    for (let types in labelTypes) {
      listCheckBoxes.push(
        this.createCheckbox(types, this.state.dishLabelsArrayName[types])
      );
    }
    return listCheckBoxes;
  };
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  //16 START
  selectAllCheckboxes = isSelected => {
    Object.keys(this.state.checkboxes).forEach(checkbox => {
      this.setState(prevState => ({
        checkboxes: { ...prevState.checkboxes, [checkbox]: isSelected }
      }));
    });
  };

  selectAll = () => this.selectAllCheckboxes(true);

  deselectAll = () => this.selectAllCheckboxes(false);

  handleCheckboxChange = event => {
    const { name } = event.target;
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };

  //16 END
  renderFoodTypes = types => {
    let stringTypes = "";

    if (types.dessert === true) {
      stringTypes = stringTypes.concat(
        ",",
        this.state.dishLabelsArrayName.dessert
      );
    }
    if (types.sidedish === true) {
      stringTypes = stringTypes.concat(
        ", ",
        this.state.dishLabelsArrayName.sidedish
      );
    }
    if (types.maincourse === true) {
      stringTypes = stringTypes.concat(
        ", ",
        this.state.dishLabelsArrayName.maincourse
      );
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
