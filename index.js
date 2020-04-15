// Create Express Application
const app = require('express')();
const routes = require('./routes');
const PORT = process.env.PORT || 8081;

// Connect routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Eindwerk - Backend listening on port ${PORT}`);
});