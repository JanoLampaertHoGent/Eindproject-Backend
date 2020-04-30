const categories = require('express').Router();

const SQLSelect = "SELECT id, name, color FROM Categories WHERE deleted = 0";
const SQLCheckCategoryExists = "SELECT id FROM Categories WHERE name = ? AND deleted = 0";
const SQLCheckCategoryDeleted = "SELECT id FROM Categories WHERE id = ? AND deleted = 1";
const SQLUpdate = "UPDATE Categories SET name = ?, color = ? WHERE id = ?";
const SQLInsert = "INSERT INTO Categories (name, color) VALUES (?, ?)";
const SQLDelete = "UPDATE Categories SET deleted = 1 WHERE id = ?";

// Get
categories.get('/', (req, res) => {
    database.all(SQLSelect, (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json(rows)
    })
});

// Post
categories.post('/', (req, res) => {
    let name = String(req.body.name).trim();
    let color = String(req.body.color).trim();

    if (color.length == 6) color = `#${color}`;

    if (!name) {
        res.status(400).json({error: "Naam is verplicht!"});
        return;
    }

    if (!color) {
        res.status(400).json({error: "Kleur is verplicht!"});
        return;
    }

    // Check User Already Exists
    database.all(SQLCheckCategoryExists, [name], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length) {
            res.status(406).json({error: `Categorie "${name}" bestaat al!`});
            return
        }

        // Insert User If Not Exists
        database.run(SQLInsert, [name, color], (err) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            res.status(201).json({success: `Categorie "${name}" is aangemaakt!`});
        });
    });
});

// Put
categories.put('/:categoryId', (req, res) => {
    let categoryId = parseInt(req.params.categoryId);
    let name = String(req.body.name).trim();
    let color = String(req.body.color).trim();

    if (!categoryId) {
        res.status(400).json({error: "Parameter categoryId is verplicht (categories/x)"});
        return;
    }

    if (!name) {
        res.status(400).json({error: "Naam is verplicht!"});
        return;
    }

    if (!color) {
        res.status(400).json({error: "Kleur is verplicht!"});
        return;
    }

    // Update Category
    database.run(SQLUpdate, [name, color, categoryId], (err) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        res.status(200).json({success: `Categorie "${name}" is aangepast!`});
    });
});

// Delete
categories.delete('/:categoryId', (req, res) => {
    let categoryId = parseInt(req.params.categoryId);

    if (!categoryId) {
        res.status(400).json({error: "Parameter categoryId is verplicht (categories/x)"});
        return;
    }

    // Check if user is already deleted
    database.all(SQLCheckCategoryDeleted, [categoryId], (err, rows) => {
        if (err) {
            res.status(400).json({error: err});
            return;
        }

        if (rows.length) {
            res.status(404).json({error: `Categorie met id ${categoryId} is al verwijderd!`});
            return
        }

        // Delete User
        database.run(SQLDelete, [categoryId], (err) => {
            if (err) {
                res.status(400).json({error: err});
                return;
            }

            res.status(200).json({success: `Categorie met id ${categoryId} is verwijderd!`});
        });
    });
});

module.exports = categories;