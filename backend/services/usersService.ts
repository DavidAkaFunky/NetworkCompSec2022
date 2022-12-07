const { userDatabase } = require('../database');

const addUser = async (username: string, pwd: string): Promise<void> => {
    userDatabase.addUser(username, pwd);
};

module.exports = {
    addUser
};