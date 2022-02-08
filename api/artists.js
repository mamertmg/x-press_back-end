// Import Express, create an Express router and export the Express router
const express = require('express');
const artistsRouter = express.Router();


const sqlite3 = require('better-sqlite3');
const db = new sqlite3(process.env.TEST_DATABASE || './database.sqlite');

// CRUD Operations

// Add Router Param to reduce boilerplate code
artistsRouter.param('artistId', (req, res, next, artistId) => {
  const sql = 'SELECT * FROM Artist WHERE Artist.id = $artistId';
  const values = {$artistId: artistId};
  db.get(sql, values, (error, artist) => {
    if (error) {
      next(error);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// GET handler to the router path /api/artists. No need to add all of the path. Already done
artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE Artist.is_currently_employed = 1',
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({artists: artists});
      }
    });
});

// GET /api/artist/:artistId handler
// router param should already handle all of the necessary SQL and error-handling logic and 
// attach the retrieved artist at req.artist
artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({artist: req.artist});
});


// POST handler
artistsRouter.post('/', (req, res, next) => {
  const name = req.body.artist.name,
        dateOfBirth = req.body.artist.dateOfBirth,
        biography = req.body.artist.biography,
        isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  }

  // Execure SQL Query to create new artist
  const sql = 'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)' +
      'VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)';
  const values = {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed
  };

  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`, // newly created artist
        (error, artist) => {
          res.status(201).json({artist: artist});
        });
    }
  });
});

// PUT Handler
artistsRouter.put('/:artistId', (req, res, next) => {
  const name = req.body.artist.name,
        dateOfBirth = req.body.artist.dateOfBirth,
        biography = req.body.artist.biography,
        isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, ' +
      'biography = $biography, is_currently_employed = $isCurrentlyEmployed ' +
      'WHERE Artist.id = $artistId';
  const values = {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $artistId: req.params.artistId
  };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
        (error, artist) => {
          res.status(200).json({artist: artist});
        });
    }
  });
});

// Delete handler
artistsRouter.delete('/:artistId', (req, res, next) => {
  const sql = 'UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId';
  const values = {$artistId: req.params.artistId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
        (error, artist) => {
          res.status(200).json({artist: artist});
        });
    }
  });
});

module.exports = artistsRouter;
