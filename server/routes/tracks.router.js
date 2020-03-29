const express = require('express');
// eslint-disable-next-line new-cap
const tracksRouter = express.Router();
const constants = require('../consts');
const app = require('../app');

tracksRouter.get('/byId/youtube', async (request, response) => {
  const responseJson = await app.search.byId({
    ...request.query,
    service: constants.YOUTUBE,
  });
  response.json(responseJson);
});

tracksRouter.get('/byId/spotify', async (request, response) => {
  const responseJson = await app.search.byId({
    ...request.query,
    service: constants.SPOTIFY,
  });
  response.json(responseJson);
});

tracksRouter.get('/byId/deezer', async (request, response) => {
  const responseJson = await app.search.byId(
      {...request.query,
        service: constants.DEEZER,
      });
  response.json(responseJson);
});

tracksRouter.get('/byName', async (request, response) => {
  const responseJson = await app.search.everywhere(request.query);
  response.json(responseJson);
});

module.exports = tracksRouter;
