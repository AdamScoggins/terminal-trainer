'use strict';

const { getQueryInterfaceOptions } = require('../utils/seederUtils');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const demoUserProgress = [
            {
                userId: 1,
                exerciseId: 1,
                score: 100,
                hintsUsed: 0,
                timeSpent: 120,
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                exerciseId: 2,
                score: 80,
                hintsUsed: 1,
                timeSpent: 240,
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                exerciseId: 3,
                score: 0,
                hintsUsed: 0,
                timeSpent: 0,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        try {
            await queryInterface.bulkInsert(
                'UserProgress',
                demoUserProgress,
                getQueryInterfaceOptions(),
            );
        } catch (error) {
            console.warn('Unable to seed user progress');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete(
            'UserProgress',
            null,
            getQueryInterfaceOptions(),
        );
    },
};
