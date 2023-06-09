const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const {
    ValidationErrorResponse,
} = require('../controllers/responseController');

// Middleware for validating user registration
const validateUserRegistration = [
    check('username', 'Username is required').notEmpty(),
    check('email', 'A valid Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    _handleValidationErrors,
];

// Middleware for validating user login
const validateUserLogin = [
    check('usernameOrEmail', 'Username or email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    _handleValidationErrors,
];

// Middleware for validating badge creation
const validateCreateBadge = [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('icon', 'Icon is required').notEmpty(),
    _handleValidationErrors,
];

// Middleware for creating a user badge relationship
const validateCreateUserBadge = [
    check('userId').notEmpty().withMessage('User id is required'),
    check('badgeId').notEmpty().withMessage('Badge id is required'),
    _handleValidationErrors,
];

// If there are any validation errors, send a response with the errors,
// otherwise, move on to the next middlware.
async function _handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return new ValidationErrorResponse([...errors.array()], res);
    } else {
        next();
    }
}

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateCreateBadge,
    validateCreateUserBadge,
};
