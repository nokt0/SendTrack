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
// tslint:disable-next-line:no-var-requires
const express = require('express');
const tracksRouter = express.Router();
const const_1 = require("../const");
const app_1 = require("../app");
tracksRouter.get('/byId/youtube', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
}));
tracksRouter.get('/byId/spotify', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
}));
tracksRouter.get('/byId/deezer', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = yield app_1.searchById(const_1.Services.DEEZER, request.query);
    response.json(responseJson);
}));
tracksRouter.get('/byName', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const responseJson = yield app_1.searchEverywhere(request.query);
    response.json(responseJson);
}));
exports.default = tracksRouter;
//# sourceMappingURL=tracks.routers.js.map