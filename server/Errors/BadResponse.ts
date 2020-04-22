import {Services} from "../const";

export default class BadResponse extends Error {
    constructor(message: string, service: Services,) {
        super(message);
        this.name = "BadResponse";
        this.service = service;
    }

    service: Services;
}
