const trash = require('express').Router();

const SQLSelectNotes = "SELECT Notes.id, title, name, firstName FROM Notes LEFT OUTER JOIN Users ON Users.id = Notes.userId WHERE Notes.deleted = 1";
const SQLSelectCategories = "SELECT id, name, color FROM Categories WHERE deleted = 1";
const SQLSelectUsers = "SELECT id, name, firstName FROM Users WHERE deleted = 1";

const SQLPatchNote = "UPDATE Notes SET deleted = 0 WHERE id = ?";
const SQLPatchCategory = "UPDATE Categories SET deleted = 0 WHERE id = ?";
const SQLPatchUser = "UPDATE Users SET deleted = 0 WHERE id = ?";

const SQLDeleteNote = "DELETE FROM Notes WHERE id = ?";
const SQLDeleteCategory = "DELETE FROM Categories WHERE id = ?";
const SQLDeleteUser = "DELETE FROM Users WHERE id = ?";

trash.get('/', (req, res) => {
    let notes = [];
    let categories = [];
    let users = [];

    database.all(SQLSelectNotes, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        notes = rows;        

        database.all(SQLSelectCategories, (err, rows) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            categories = rows;

            database.all(SQLSelectUsers, (err, rows) => {
                if (err) {
                    res.status(400).json({error: err});
                    return;
                }
    
                users = rows;

                res.status(200).json({notes: notes, categories: categories, users: users});
            });
        });
    });
});

// Patch
trash.patch('/note/:noteId', (req, res) => {
    let noteId = parseInt(req.params.noteId);

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (trash/note/x)"});
        return;
    }

    database.run(SQLPatchNote, [noteId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Notitie met id ${noteId} is teruggezet!`});
    });
});

trash.patch('/category/:categoryId', (req, res) => {
    let categoryId = parseInt(req.params.categoryId);

    if (!categoryId) {
        res.status(400).json({error: "Parameter categoryId is verplicht (trash/category/x)"});
        return;
    }

    database.run(SQLPatchCategory, [categoryId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Category met id ${categoryId} is teruggezet!`});
    });
});

trash.patch('/user/:userId', (req, res) => {
    let userId = parseInt(req.params.userId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (trash/user/x)"});
        return;
    }

    database.run(SQLPatchUser, [userId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Gebruiker met id ${userId} is teruggezet!`});
    });
});

// Delete
trash.delete('/note/:noteId', (req, res) => {
    let noteId = parseInt(req.params.noteId);

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (trash/note/x)"});
        return;
    }

    database.run(SQLDeleteNote, [noteId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Notitie met id ${noteId} is definitief verwijderd!`});
    });
});

trash.delete('/category/:categoryId', (req, res) => {
    let categoryId = parseInt(req.params.categoryId);

    if (!categoryId) {
        res.status(400).json({error: "Parameter categoryId is verplicht (trash/category/x)"});
        return;
    }

    database.run(SQLDeleteCategory, [categoryId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Category met id ${categoryId} is definitief verwijderd!`});
    });
});

trash.delete('/user/:userId', (req, res) => {
    let userId = parseInt(req.params.userId);

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (trash/user/x)"});
        return;
    }

    database.run(SQLDeleteUser, [userId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Gebruiker met id ${userId} is definitief verwijderd!`});
    });
});

module.exports = trash;