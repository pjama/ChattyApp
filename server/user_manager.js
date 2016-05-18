"use strict"

class UserManager {
  constructor() {
    this.users = {}; // { connectionId: username }
  }

  addUser(connectionId, username) {
    if (!connectionId) {
      return;
    }
    this.users[connectionId] = username;
  }

  removeUser(connectionId) {
    delete this.users[connectionId];
  }

  getUsersArray() {
    return this.users;
  }
}

module.exports = UserManager;
