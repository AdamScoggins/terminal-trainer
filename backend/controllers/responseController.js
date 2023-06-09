// Base ResponseController class
class ResponseController {
    constructor(statusCode, payload, res) {
        this.statusCode = statusCode;
        this.payload = payload;

        if (res) {
            console.log('sending statusCode', statusCode);
            this.sendJSON(res);
        }
    }

    // Send the response with the specified payload and status code
    sendJSON(res) {
        res.status(this.statusCode).json(this.payload);
    }
}

class SuccessResponse extends ResponseController {
    constructor(payload, res) {
        super(200, payload, res);
    }
}

class CreatedResponse extends ResponseController {
    constructor(payload, res) {
        super(201, payload, res);
    }
}

class NoContentResponse extends ResponseController {
    constructor(res) {
        super(204, {}, res);
    }
}

class BadRequestResponse extends ResponseController {
    constructor(payload, res) {
        super(400, payload, res);
    }
}

class UnauthorizedResponse extends ResponseController {
    constructor(payload, res) {
        super(401, payload, res);
    }
}

class ForbiddenResponse extends ResponseController {
    constructor(payload, res) {
        super(403, payload, res);
    }
}

class NotFoundResponse extends ResponseController {
    constructor(payload, res) {
        super(404, payload, res);
    }
}

class ConflictResponse extends ResponseController {
    constructor(payload, res) {
        super(409, payload, res);
    }
}

class ValidationErrorResponse extends ResponseController {
    constructor(payload, res) {
        super(422, payload, res);
    }
}

class InternalServerErrorResponse extends ResponseController {
    constructor(payload, res) {
        super(500, payload, res);
    }
}

module.exports = {
    ResponseController,
    SuccessResponse,
    CreatedResponse,
    NoContentResponse,
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
    ConflictResponse,
    ValidationErrorResponse,
    InternalServerErrorResponse,
};
