const express = require('express');
// eslint-disable-next-line new-cap
const tracksRouter = express.Router();
const constants = require('../cnst');
const app = require('../apps');

tracksRouter.get('/byId/youtube', async (request, response) => {
  const responseJson = await app.search.byId({
    ...request.query,
    service: constants.YOUTUBE,
  });
  response.json(responseJson);
});

tracksRouter.get('/byId/spotify', async (request, response) => {
  const responseJson = await app.searchById(request.query);
  response.json(responseJson);
});

tracksRouter.get('/byId/deezer', async (request, response) => {
  const responseJson = await app.searchEverywhere(request.query);
  response.json(responseJson);
});

tracksRouter.get('/byName', async (request, response) => {
  const responseJson = await app.searchEverywhere(request.query);
  response.json(responseJson);
});

module.exports = tracksRouter;
