const express = require('express');
const trackRouter = express.Router();
const app = require('../apps');
const constants = require('../consts');

trackRouter.get('/spotify', async (request, response) => {
  const result = await app.req.spotify(request.query, constants.TRACK_REQUEST);
  response.json(result);
});
trackRouter.get('/deezer', async (request, response) => {
  const result = await app.req.deezer(request.query, constants.TRACK_REQUEST);
  response.json(result);
});
trackRouter.get('/youtube', async (request, response) => {
  const result = await app.req.youtube(request.query, constants.TRACK_REQUEST);
  response.json(result);
});

module.exports = trackRouter;
