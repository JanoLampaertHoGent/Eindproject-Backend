const notes = require('express').Router({mergeParams: true});
const categories = require("./categories");

const SQLSelect = "SELECT id, title, content FROM Notes WHERE userId = ? AND deleted = 0";
const SQLSelectSingle = "SELECT id, title, content FROM Notes WHERE id = ? AND deleted = 0";
const SQLCheckNoteDeleted = "SELECT id FROM Notes WHERE userId = ? AND id = ? AND deleted = 1";
const SQLUpdate = "UPDATE Notes SET title = ?, content = ? WHERE id = ? AND userId = ?";
const SQLInsert = "INSERT INTO Notes (title, content, userId) VALUES (?, ?, ?)";
const SQLDelete = "UPDATE Notes SET deleted = 1 WHERE userId = ? AND id = ?";

const SQLGetLastID = "SELECT last_insert_rowid()";

notes.use('/:noteId/categories', categories);

// Get
notes.get('/', (req, res) => {
    let userId = parseInt(req.params.userId);

    database.all(SQLSelect, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

notes.get('/:noteId', (req, res) => {
    let userId = parseInt(req.params.userId);
    let noteId = parseInt(req.params.noteId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x/notes)"});
        return;
    }

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (users/x/notes/y)"});
        return;
    }

    database.all(SQLSelectSingle, [noteId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length == 0) {
            res.status(404).json({error: `Geen notitie gevonden met id ${noteId}`});
            return;
        }

        res.status(200).json(rows);
    });
});

// Post
notes.post('/', (req, res) => {
    let userId = parseInt(req.params.userId);
    let title = String(req.body.title).trim();
    let content = String(req.body.content).trim();

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x/notes)"});
        return;
    }

    if (!title) {
        res.status(400).json({error: "Titel is verplicht!"});
        return;
    }

    // Insert note
    database.run(SQLInsert, [title, content, userId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        database.all(SQLGetLastID, (error, rows) => {
            if (error) {
                res.status(400).json({error: error});
                return;
            }

            res.status(201).json({success: `Notitie met titel "${title}" is aangemaakt!`, id: rows[0]['last_insert_rowid()']});
        });
    })
});

// Put
notes.put('/:noteId', (req, res) => {
    let userId = parseInt(req.params.userId);
    let noteId = parseInt(req.params.noteId);
    let title = String(req.body.title).trim();
    let content = String(req.body.content).trim();

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x/notes)"});
        return;
    }

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (users/x/notes/y)"});
        return;
    }

    if (!title) {
        res.status(400).json({error: "Titel is verplicht!"});
        return;
    }

    // Update note
    database.run(SQLUpdate, [title, content, noteId, userId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(201).json({success: `Notitie met titel "${title}" is aangepast!`});
    })
});

// Delete
notes.delete('/:noteId', (req, res) => {
    let userId = parseInt(req.params.userId);
    let noteId = parseInt(req.params.noteId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x/notes)"});
        return;
    }

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (users/x/notes/y)"});
        return;
    }

    // Check if note is already deleted
    database.all(SQLCheckNoteDeleted, [userId, noteId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length) {
            res.status(404).json({error: `Notitie met id ${noteId} is al verwijderd!`});
            return
        }

        // Delete note
        database.run(SQLDelete, [userId, noteId], (err) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            res.status(200).json({success: `Notitie met id ${noteId} is verwijderd!`});
        });
    });
});

module.exports = notes;