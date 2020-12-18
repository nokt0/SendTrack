"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-var-requires
const express = require('express');
const server = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const tracks_routers_1 = require("./routes/tracks.routers");
const track_routers_1 = require("./routes/track.routers");
server.use(cors());
server.use('/track', track_routers_1.default);
server.use('/tracks', tracks_routers_1.default);
server.use('/SendTrack', express.static(path.join(__dirname, '/build')));
server.use('/SendTrack/static', express.static(path.join(__dirname, '/build/static')));
server.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'build/index.html'));
});
if (module === require.main) {
    // [START server]
    const serv = server.listen(process.env.PORT || 8080, () => {
        const port = serv.address().port;
        console.log(`App listening on port ${port}`);
    });
    // [END server]
}
//# sourceMappingURL=server.js.map