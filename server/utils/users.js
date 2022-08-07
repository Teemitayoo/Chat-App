class Users {
  constructor() {
    this.user = [];
  }
  addUser(id, name, room) {
    let user = { id, name, room };
    this.users.push(user);
    return user;
  }
}

module.exports = { Users };
