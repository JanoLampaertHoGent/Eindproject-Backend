const notes = require('express').Router();

const SQLSelect = "SELECT id, title, content FROM Notes WHERE deleted = 0";
const SQLUpdate = "UPDATE Notes SET title = ?, content = ? WHERE id = ?";
const SQLInsert = "INSERT INTO Notes (title, content) VALUES (?, ?)";
const SQLDelete = "UPDATE Notes SET deleted = 0 WHERE id = ?";

notes.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

module.exports = notes;