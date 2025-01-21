const express = require('express');
const route = require('./route/index');

const app = express();
const port = process.env.PORT || '5000';

// Add middlewares to automatically parse json data and
// form data in request body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Add the routes defined in index to app
app.use('/', route);

// Add listener to app
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
