// tslint:disable:no-var-requires
const express = require('express');
const trackRouter = express.Router();
import {fetchService} from '../app'
import {Services} from '../const'
trackRouter.get('/spotify', async (request, response) => {
    const result = await fetchService(Services.SPOTIFY,request.query);
    response.json(result);
});
trackRouter.get('/deezer', async (request, response) => {
    const result = await fetchService(Services.DEEZER,request.query);
    response.json(result);
});
trackRouter.get('/youtube', async (request, response) => {
    const result = await fetchService(Services.YOUTUBE,request.query);
    response.json(result);
});
export default trackRouter;

