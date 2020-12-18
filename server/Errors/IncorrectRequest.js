"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IncorrectRequest extends Error {
    constructor(message, badRequest) {
        super(message);
        this.name = "IncorrectRequest";
        this.badRequest = badRequest;
    }
}
exports.default = IncorrectRequest;
//# sourceMappingURL=IncorrectRequest.js.map