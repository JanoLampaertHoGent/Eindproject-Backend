const users = require('express').Router();

const SQLSelect = "SELECT id, name, firstName FROM Users WHERE deleted = 0";
const SQLSelectSingle = "SELECT id, name, firstName FROM Users WHERE id = ? AND deleted = 0";
const SQLCheckUserExists = "SELECT id FROM Users WHERE name = ? AND firstName = ? AND deleted = 0";
const SQLCheckUserDeleted = "SELECT id FROM Users WHERE id = ? AND deleted = 1";
const SQLInsert = "INSERT INTO Users (name, firstName) VALUES (?, ?)";
const SQLUpdate = "UPDATE Users SET name = ?, firstName = ? WHERE id = ?";
const SQLDelete = "UPDATE Users SET deleted = 1 WHERE id = ?";

// Get
users.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

users.get('/:userId', (req, res) => {
    let userId = parseInt(req.params.userId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x)"});
        return;
    }

    database.all(SQLSelectSingle, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length == 0) {
            res.status(404).json({error: `Geen gebruiker gevonden met id ${userId}`});
            return;
        }

        res.status(200).json(rows);
    });
});

// Post
users.post('/', (req, res) => {
    let name = req.body.name;
    let firstName = req.body.firstName;

    if (!name) {
        res.status(400).json({error: "Naam is verplicht!"});
        return;
    }

    // Check User Already Exists
    database.all(SQLCheckUserExists, [name, firstName], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length) {
            res.status(406).json({error: `Gebruiker "${name}${firstName ? ' ' + firstName : ""}" bestaat al!`});
            return
        }

        // Insert User If Not Exists
        database.run(SQLInsert, [name, firstName], (err) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            res.status(201).json({success: `Gebruiker "${name}${firstName ? ' ' + firstName : ""}" is aangemaakt!`});
        });
    });
});

// Put
users.put('/:userId', (req, res) => {
    let userId = parseInt(req.params.userId);
    let name = req.body.name;
    let firstName = req.body.firstName;

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x)"});
        return;
    }

    if (!name) {
        res.status(400).json({error: "Naam is verplicht!"});
        return;
    }

    // Update User
    database.run(SQLUpdate, [name, firstName, userId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Gebruiker "${name}${firstName ? ' ' + firstName : ""}" is aangepast!`});
    });
});

// Delete
users.delete('/:userId', (req, res) => {
    let userId = parseInt(req.params.userId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x)"});
        return;
    }

    // Check if user is already deleted
    database.all(SQLCheckUserDeleted, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length) {
            res.status(404).json({error: `Gebruiker met id ${userId} is al verwijderd!`});
            return
        }

        // Delete User
        database.run(SQLDelete, [userId], (err) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            res.status(200).json({success: `Gebruiker met id ${userId} is verwijderd!`});
        });
    });
});

module.exports = users;