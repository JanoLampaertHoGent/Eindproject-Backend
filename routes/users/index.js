const users = require('express').Router();

const SQLSelect = "SELECT id, name, firstName FROM Users WHERE deleted = 0";
const SQLUpdate = "UPDATE Users SET name = ?, firstName = ? WHERE id = ?";
const SQLInsert = "INSERT INTO Users (name, firstName) VALUES (?, ?)";
const SQLDelete = "UPDATE Users SET deleted = 0 WHERE id = ?";

users.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

module.exports = users;