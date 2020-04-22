"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-var-requires
const express = require('express');
const trackRouter = express.Router();
const app_1 = require("../app");
const const_1 = require("../const");
trackRouter.get('/spotify', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.fetchService(const_1.Services.SPOTIFY, request.query);
    response.json(result);
}));
trackRouter.get('/deezer', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.fetchService(const_1.Services.DEEZER, request.query);
    response.json(result);
}));
trackRouter.get('/youtube', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.fetchService(const_1.Services.YOUTUBE, request.query);
    response.json(result);
}));
exports.default = trackRouter;
//# sourceMappingURL=track.routers.js.map