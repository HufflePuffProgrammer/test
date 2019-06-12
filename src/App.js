import React, { Component } from "react";
import Checkbox from "./Checkbox";
import firebase from "./firebase.js";

import "./App.css";

// const movies = {
//   movie01: {
//     movie_id: "001",
//     title: "Godzilla",
//     director: "Michael Dougherty",
//     writer: "Zach Shields"
//   },
//   movie02: {
//     movie_id: "002",
//     title: "John Wick",
//     director: "Chad Stahelski",
//     writer: "Derek Kolstud"
//   },
//   movie03: {
//     movie_id: "003",
//     title: "Edge of Seventeen",
//     director: "Kelly Fremon Craig",
//     writer: "Kelly Femon Craig"
//   }
// };

// const comments = {
//   comment001: {
//     comment_id: "101",
//     movie_id: "001",
//     comment_text: "This movie kicks ass.",
//     genres: {
//       coming_of_age: true,
//       golden_fleece: true,
//       monster_in_house: true
//     },
//     good_characteristics: {
//       g_char_intro: true,
//       g_opening_shot: false,
//       g_dialogue: false
//     },
//     bad_characteristics: {
//       b_char_intro: true,
//       b_opening_shot: true,
//       b_dialogue: true
//     }
//   },
//   comment002: {
//     comment_id: "102",
//     movie_id: "002",
//     comment_text: "Action flick of the decade",
//     genres: {
//       coming_of_age: true,
//       golden_fleece: true,
//       monster_in_house: true
//     },
//     good_characteristics: {
//       g_char_intro: true,
//       g_opening_shot: false,
//       g_dialogue: false
//     },
//     bad_characteristics: {
//       b_char_intro: true,
//       b_opening_shot: true,
//       b_dialogue: true
//     }
//   },
//   comment003: {
//     comment_id: "103",
//     movie_id: "003",
//     comment_text: "Laughed my ass off",
//     genres: {
//       coming_of_age: true,
//       golden_fleece: true,
//       monster_in_house: true
//     },
//     good_characteristics: {
//       g_char_intro: true,
//       g_opening_shot: true,
//       g_dialogue: true
//     },
//     bad_characteristics: {
//       b_char_intro: true,
//       b_opening_shot: true,
//       b_dialogue: true
//     }
//   }
// };

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      userName: "",
      items: [],
      dishLabelTypes: [],
      dishLabelsArrayName: [],
      checkboxes: [],
      currentMovie: "",
      director: "",
      movies: [],
      comments: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount = () => {
    var firebaseConfig = {
      apiKey: "AIzaSyAj0bMYHcsNUbyCDakCQGSzH6kCZ_S3sQQ",
      authDomain: "test2-2813f.firebaseapp.com",
      databaseURL: "https://test2-2813f.firebaseio.com",
      projectId: "test2-2813f",
      storageBucket: "test2-2813f.appspot.com",
      messagingSenderId: "202543370394",
      appId: "1:202543370394:web:3cdb59955d3bea3f"
    };
    //Initialize Firebase
    //firebase.initializeApp(firebaseConfig);

    //INSERT INTO DB
    // firebase
    //   .database()
    //   .ref("comments")
    //   .set(comments)
    //   .then(() => {
    //     console.log("Inserted! C'est bon.");
    //   })
    //   .catch(error => {
    //     console.log("Inserted! ERROR! NOO ");
    //   });

    //READ DB
    // console.log("Read from DB");
    // firebase
    //   .database()
    //   .ref("comments")
    //   .on("value", data => {
    //     console.log(data.toJSON());
    //   });

    // setTimeout(() => {
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
    // }, 5000);

    //  firebase
    //    .database()
    //    .ref("movies/004")
    //    .update({
    //      gendre_id: "chickflick",
    //      genre_val: "Chick Flick"
    //    });
  };
  componentDidMount() {
    const dishlabelsRef = firebase.database().ref("dishlabels");

    // Read Checkbox label names and types from DB.
    dishlabelsRef.on("value", snapshot => {
      let dishLabels = snapshot.val();
      let dishLabelsArrayNameTemp = [];
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

    //const itemsRef = firebase.database().ref("items");
    //  itemsRef.on("value", snapshot => {
    //   let items = snapshot.val();
    //   let newState = [];
    //   for (let item in items) {
    //     newState.push({
    //       id: item,
    //       title: items[item].currentItem,
    //       user: items[item].userName,
    //       dishLabelTypes: items[item].type
    //     });
    //   }
    //   this.setState({
    //     items: newState
    //   });
    // });

    const moviesRef = firebase.database().ref("movies");

    moviesRef.on("value", snapshot => {
      let movies = snapshot.val();
      let newStateMovies = [];
      let newStateComments = [];
      //console.log("movies");
      //console.log(movies);
      for (let movie in movies) {
        newStateMovies.push({
          movie_id: movies[movie].movie_id,
          title: movies[movie].title,
          director: movies[movie].director,
          writer: movies[movie].writer
        });

        let movie_id = movies[movie].movie_id;
        //read DB Comments where movie_id= comments.
        //.equalTo(movies[movie].movie_id)
        const commentsRef = firebase.database().ref("comments");
        commentsRef
          .orderByChild("movie_id")
          .equalTo(movie_id)
          .on("value", function(snapshot) {
            let comments = snapshot.val();

            for (let comment in comments) {
              //console.log("comment.comment_id");
              //console.log(comments[comment].comment_id);
              let newComment = {
                comment_id: comments[comment].comment_id,
                movie_id: comments[comment].movie_id,
                comment_text: comments[comment].comment_text,
                genres: comments[comment].genres,
                good_characteristics: comments[comment].good_characteristics,
                bad_characteristics: comments[comment].bad_characteristics
              };
              console.log("new Comment");
              //console.log(newComment);
              newStateComments.push(newComment);
              // console.log("Movie Comment");
              console.log(newStateComments);
              // console.log("MovieID");
              //console.log(movies[movie].movie_id);
            }
          });
      }

      this.setState({
        movies: newStateMovies,
        comments: newStateComments
      });
      console.log("comments");
      console.log(this.state.comments);
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

  renderGenres = genres => {
    let stringTypes = "";

    Object.keys(genres).forEach(function(genre) {
      if (genres[genre]) {
        if (genre === "coming_of_age") {
          stringTypes = stringTypes.concat(",", "Coming Of Age");
          console.log("Coming of Age");
        }
        if (genre === "golden_fleece") {
          stringTypes = stringTypes.concat(",", "Golden Fleece");
          console.log("Golden Fleece");
        }
        if (genre === "monster_in_house") {
          stringTypes = stringTypes.concat(",", "Monster In House");
          console.log("Monster");
        }
      }
      return stringTypes;
    });
    let stringReturn = stringTypes;
    if (stringTypes.indexOf(",") === 0) {
      stringReturn = stringTypes.slice(1);
    }
    return stringReturn;
  };

  renderGoodChars = chars => {
    let stringTypes = "";

    Object.keys(chars).forEach(function(char) {
      if (chars[char]) {
        if (char === "g_char_intro") {
          stringTypes = stringTypes.concat(",", "character introduction");
          console.log("character ntroduction");
        }
        if (char === "g_dialogue") {
          stringTypes = stringTypes.concat(",", "dialogue");
          console.log("g dialogue");
        }
        if (char === "g_opening_shot") {
          stringTypes = stringTypes.concat(",", "opening shot");
          console.log("g opening shot");
        }
      }
      return stringTypes;
    });
    let stringReturn = stringTypes;
    if (stringTypes.indexOf(",") === 0) {
      stringReturn = stringTypes.slice(1);
    }
    return stringReturn;
  };
  renderBadChars = chars => {
    let stringTypes = "";

    Object.keys(chars).forEach(function(char) {
      if (chars[char]) {
        if (char === "b_char_intro") {
          stringTypes = stringTypes.concat(",", "character introduction");
          console.log("character ntroduction");
        }
        if (char === "b_dialogue") {
          stringTypes = stringTypes.concat(",", "dialogue");
          console.log("g dialogue");
        }
        if (char === "b_opening_shot") {
          stringTypes = stringTypes.concat(",", "opening shot");
          console.log("b opening shot");
        }
      }
      return stringTypes;
    });
    let stringReturn = stringTypes;
    if (stringTypes.indexOf(",") === 0) {
      stringReturn = stringTypes.slice(1);
    }
    return stringReturn;
  };

  renderComments = movie_id => {
    let stringCommentItems = "";
    let { comments } = this.state;
    console.log("render Comments");
    console.log(this.state.comments);

    //const names = friends.map(p => p.name);
    //const mappingFunction = p => <li>{p.name}</li>;

    const mycomments = [
      {
        comment001: {
          comment_id: "101",
          comment_text: "This movie kicks ass."
        }
      },
      {
        comment002: {
          comment_id: "102",
          comment_text: "This movie kicks ass."
        }
      }
    ];
    console.log("Comments");
    console.log(mycomments);
    // let stringReturn = this.state.comments.forEach(comment => {
    //   return <h1>text: {comment}</h1>;
    // });

    // console.log("StringReturn");
    // console.log(stringReturn);
    let stringArray = [];
    let stringReturn = comments.map(comment => {
      return <p>text:{comment.comment_text}</p>;
    });

    console.log("StringReturn");
    console.log(stringReturn);

    // stringReturn = comments.map(comment => {
    //   console.log("comment map");
    //   console.log(comment);
    //   return (
    //     <li key={comment.comment_id}>
    //       <h3>{comment.comment_text}</h3>
    //       <p>comment: {comment.comment_id}</p>
    //       <p>movie-id:{comment.movie_id} </p>
    //       {this.renderGenres(comment.genres)}
    //       <p>Good: {this.renderGoodChars(comment.good_characteristics)}</p>
    //       <p>Bad: {this.renderBadChars(comment.bad_characteristics)}</p>
    //     </li>
    //   );
    // });

    // for (let comment in comments) {
    //   console.log("movie_id");
    //   console.log(movie_id);
    //   console.log("comment movieid");
    //   console.log(comment.movie_id);
    //   if (comment.movie_id === movie_id) {
    //     console.log("Equal");
    //   }
    // }

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
          {/* <section className="display-item">
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
          </section> */}
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.movies.map(movie => {
                  return (
                    <li key={movie.movie_id}>
                      <h3>{movie.title}</h3>

                      <p>
                        <i>director</i> {movie.director}
                      </p>
                      <p>
                        <i>writer</i> {movie.writer}
                      </p>
                      <p>{this.renderComments(movie.movie_id)}</p>
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
