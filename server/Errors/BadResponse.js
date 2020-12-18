"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadResponse extends Error {
    constructor(message, service) {
        super(message);
        this.name = "BadResponse";
        this.service = service;
    }
}
exports.default = BadResponse;
//# sourceMappingURL=BadResponse.js.map