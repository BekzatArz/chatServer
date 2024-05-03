const { trimString } = require('./utils')

let users = [];

const findUser = (user) => {
    const userName = trimString(user.name);
    const userRoom = trimString(user.room);

    return users.find(
        (u) => trimString(u.name) === userName && trimString(u.room) === userRoom)
}

const addUser = (user) => {
    const isExist = findUser(user)
    !isExist && users.push(user) 
    const currentUser = isExist || user;
    return { isExist: isExist, user: currentUser}
}

const getRoomUsers = (room) => users.filter((u) => u.room === room);
const removeUser = (user) => {
    const foundUser = findUser(user)
    if (foundUser){
        users = users.filter(({ room, name }) => room === foundUser.room && name !== foundUser.name)
        console.log('vyppp')
    }
    return foundUser
}
module.exports = { addUser, findUser, getRoomUsers, removeUser }