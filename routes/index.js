const routes = require("express").Router();

const categories = require('./categories');
const trash = require('./trash');
const users = require('./users');

routes.use('/categories', categories);
routes.use('/trash', trash);
routes.use('/users', users);

routes.get('/', (request, response) => {
    response.status(200).json({message: 'Verbonden!'});
});

module.exports = routes;