const categories = require('express').Router();

const SQLSelect = "SELECT id, name, color FROM Categories WHERE deleted = 0";
const SQLUpdate = "UPDATE Categories SET name = ?, color = ? WHERE id = ?";
const SQLInsert = "INSERT INTO Categories (name, color) VALUES (?, ?)";
const SQLDelete = "UPDATE Categories SET deleted = 0 WHERE id = ?";

categories.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

module.exports = categories;