const jwt = require('jsonwebtoken');
const {
    SuccessResponse,
    CreatedResponse,
    NotFoundResponse,
    ConflictResponse,
    InternalServerErrorResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
} = require('./responseController');
const { isEmail } = require('./helpers');

const { User } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

async function findUserById(id) {
    return await User.findByPk(id);
}

async function register(req, res) {
    const { username, email, password, firstName, lastName } = req.body;

    if (await User.findOne({ where: { username } })) {
        return new ConflictResponse({ error: 'Username already exists' }, res);
    }

    if (await User.findOne({ where: { email } })) {
        return new ConflictResponse({ error: 'Email already exists' }, res);
    }

    try {
        const newUser = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
        });

        const token = generateToken(newUser.id);

        return new CreatedResponse({ token }, res);
    } catch (err) {
        const errorMessage =
            err.message || 'An error occurred during registration.';

        return new InternalServerErrorResponse({ error: errorMessage }, res);
    }
}

async function login(req, res) {
    const { usernameOrEmail, password } = req.body;

    try {
        const where = {};
        if (isEmail(usernameOrEmail)) {
            where.email = usernameOrEmail;
        } else {
            where.username = usernameOrEmail;
        }

        const user = await User.scope('withPassword').findOne({ where });
        if (!user) {
            return new NotFoundResponse({ error: 'User not found' }, res);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return new UnauthorizedResponse(
                { error: 'Incorrect password' },
                res,
            );
        }

        const token = generateToken(user.id);

        return new SuccessResponse({ token }, res);
    } catch (err) {
        const errorMessage =
            err.message ||
            'An internal server error occured while attempting to login.';

        return new InternalServerErrorResponse({ error: errorMessage }, res);
    }
}

async function getUserProfile(req, res) {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return new NotFoundResponse({ error: 'User not found' }, res);
        }

        user.badges = await user.getBadges();
        user.progress = await user.getProgress();

        return new SuccessResponse(user, res);
    } catch (err) {
        const errorMessage =
            err.message ||
            "An internal server error occured while attempting to get the user's profile.";

        return new InternalServerErrorResponse({ error: errorMessage }, res);
    }
}

async function updateUserProfile(req, res) {
    const { firstName, lastName, terminalTheme } = req.body;

    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return new NotFoundResponse({ error: 'User not found' }, res);
        }

        if (user.id !== req.user.id) {
            return new ForbiddenResponse({ error: 'Forbidden' }, res);
        }

        // We shouldn't try to update fields with empty or null values
        const updateObject = {};
        if (firstName) {
            updateObject.firstName = firstName;
        }
        if (lastName) {
            updateObject.lastName = lastName;
        }
        if (terminalTheme) {
            updateObject.terminalTheme = terminalTheme;
        }

        await user.update(updateObject);

        return new SuccessResponse(user, res);
    } catch (err) {
        const errorMessage =
            err.message ||
            "An internal server error occured while attempting to update the user's profile.";

        return new InternalServerErrorResponse({ error: errorMessage }, res);
    }
}

async function deleteUserAccount(req, res) {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return new NotFoundResponse({ error: 'User not found' }, res);
        }

        if (user.id !== req.user.id) {
            return new ForbiddenResponse({ error: 'Forbidden' }, res);
        }

        await user.destroy();

        return new SuccessResponse({ message: 'User deleted.' }, res);
    } catch (err) {
        const errorMessage =
            err.message ||
            "An internal server error occured while attempting to delete the user's account.";

        return new InternalServerErrorResponse({ error: errorMessage }, res);
    }
}

module.exports = {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
};