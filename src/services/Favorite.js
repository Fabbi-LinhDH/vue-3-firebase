import firebase from "../firebase";

// const db = firebase.ref("/TrendingSoon");
const db = firebase.ref("/Favorite");

class Favorite {
  getAll() {
    return db;
  }

  create(coin) {
    return db.push(coin);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new Favorite();
