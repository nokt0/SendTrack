"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundMatch extends Error {
    constructor(message, toCompare, response) {
        super(message);
        this.name = "NotFoundMatch";
        this.toCompare = toCompare;
    }
}
exports.default = NotFoundMatch;
//# sourceMappingURL=NotFoundMatch.js.map