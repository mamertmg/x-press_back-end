const express = require('express');
// Since all routes in this project have paths starting at the /api subpath, 
// we will create an API router that will prepend this path segment.

// Instance of express router
const apiRouter = express.Router();

// Import routers
const artistsRouter = require('./artists.js');
const seriesRouter = require('./series.js');

// Mound routers
apiRouter.use('/artists', artistsRouter);
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;