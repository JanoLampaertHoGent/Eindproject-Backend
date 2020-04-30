const categories = require('express').Router({mergeParams: true});

const SQLSelect = "SELECT id, name, color FROM `Categories` LEFT OUTER JOIN Notes_Categories ON Notes_Categories.categoryId = Categories.id WHERE Categories.deleted = 0 AND Notes_Categories.noteId = ?";
const SQLInsert = "INSERT INTO Notes_Categories (noteId, categoryId) VALUES (?, ?)";
const SQLDelete = "DELETE FROM Notes_Categories WHERE noteId = ?";

// Get
categories.get('/', (req, res) => {    
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

    database.all(SQLSelect, [noteId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows);
    });
});

// Post
categories.post('/', (req, res) => {
    let userId = parseInt(req.params.userId);
    let noteId = parseInt(req.params.noteId);
    let categoryIds = req.body.categoryIds;

    if (!userId) {
        res.status(400).json({error: "Parameter userId is verplicht (users/x/notes)"});
        return;
    }

    if (!noteId) {
        res.status(400).json({error: "Parameter noteId is verplicht (users/x/notes/y)"});
        return;
    }

    if (!categoryIds) {
        res.status(400).json({error: "Parameter categoryIds is verplicht!"});
        return;
    }

    if (!Array.isArray(categoryIds)) {
        res.status(400).json({error: "Parameter categoryIds moet een lijst zijn!"});
        return;
    }

    let insert = SQLInsert;
    let params = [noteId, categoryIds[0]];
    if (categoryIds.length > 1) {
        for (x = 1; x < categoryIds.length; x++) {
            insert += ", (?, ?)";
            params.push(noteId, categoryIds[x]);
        }
    }

    database.run(insert, params, (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(201).json({success: `Categorie is gelinkt aan notitie!`});
    });
});

// Delete
categories.delete('/', (req, res) => {    
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

    database.run(SQLDelete, [noteId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(201).json({success: `Categorieën van notitie met id ${noteId} zijn verwijderd!`});
    })
})

module.exports = categories;