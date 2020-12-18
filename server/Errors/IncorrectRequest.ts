export default class IncorrectRequest extends Error {
    constructor(message: string, badRequest:object) {
        super(message);
        this.name = "IncorrectRequest"
        this.badRequest = badRequest;
    }

    badRequest:object;
}

