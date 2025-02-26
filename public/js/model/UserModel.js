class UserModel {
    constructor() {
        this.users = [];
    }

    async loadUsers() {
        const response = await fetch("../data/initial-data.json");
        const data = await response.json();
        this.users = data.users;
    }

    getUserById(id) {
        return this.users.find(user => user.id === parseInt(id));
    }
}