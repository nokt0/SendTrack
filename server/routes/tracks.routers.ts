
// tslint:disable-next-line:no-var-requires
const express = require('express');
const tracksRouter = express.Router();
import {Services} from '../const';
import {searchEverywhere} from '../app';

tracksRouter.get('/byId/youtube', async (request, response) => {
});

tracksRouter.get('/byId/spotify', async (request, response) => {
});

tracksRouter.get('/byId/deezer', async (request, response) => {
    const responseJson = await searchEverywhere(request.query);
    response.json(responseJson);
});

tracksRouter.get('/byName', async (request, response) => {
    const responseJson = await searchEverywhere(request.query);
    response.json(responseJson);
});
export default tracksRouter;
