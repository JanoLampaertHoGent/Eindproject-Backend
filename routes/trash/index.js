const trash = require('express').Router();

const SQLSelect = "SELECT id, type, itemId FROM Trash WHERE deleted = 0";
const SQLInsert = "INSERT INTO Trash (type, itemId) VALUES (?, ?)";
const SQLDelete = "UPDATE Trash SET deleted = 0 WHERE id = ?";

trash.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

module.exports = trash;