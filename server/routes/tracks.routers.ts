
// tslint:disable-next-line:no-var-requires
const express = require('express');
const tracksRouter = express.Router();
import {Services} from '../const';
import {searchById, searchEverywhere} from '../app';

tracksRouter.get('/byId/youtube', async (request, response) => {
    const responseJson = await searchById(Services.YOUTUBE, request.query);
    response.json(responseJson);
});

tracksRouter.get('/byId/spotify', async (request, response) => {
    const responseJson = await searchById(Services.SPOTIFY, request.query);
    response.json(responseJson);
});

tracksRouter.get('/byId/deezer', async (request, response) => {
    const responseJson = await searchById(Services.DEEZER, request.query);
    response.json(responseJson);
});

tracksRouter.get('/byName', async (request, response) => {
    const responseJson = await searchEverywhere(request.query);
    response.json(responseJson);
});
export default tracksRouter;
