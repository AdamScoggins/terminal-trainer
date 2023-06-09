import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Exercise endpoints
const buildExerciseEndpoints = (builder) => ({
    fetchAllExercises: builder.query({
        query: () => 'exercises',
        providesTags: ['Exercises'],
    }),
    fetchExerciseById: builder.query({
        query: (id) => `exercises/${id}`,
    }),
    fetchAllHintsByExerciseId: builder.query({
        query: (exerciseId) => `exercises/${exerciseId}/hints`,
    }),
    updateExerciseById: builder.mutation({
        query: ({ id, exercise }) => ({
            url: `exercises/${id}`,
            method: 'PUT',
            body: exercise,
        }),
        invalidatesTags: ['Exercises'],
    }),
    deleteExerciseById: builder.mutation({
        query: (id) => ({
            url: `exercises/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Exercises'],
    }),
    createExercise: builder.mutation({
        query: (exerciseData) => ({
            url: 'exercises',
            method: 'POST',
            body: exerciseData,
        }),
        invalidatesTags: ['Exercises'],
    }),
});

// User endpoints
const buildUserEndpoints = (builder) => ({
    signupUser: builder.mutation({
        query: (userData) => ({
            url: 'users/register',
            method: 'POST',
            body: userData,
        }),
    }),
    loginUser: builder.mutation({
        query: (userData) => ({
            url: 'users/login',
            method: 'POST',
            body: userData,
        }),
        onSuccess: (data, thunks, cache) => {
            cache.invalidateTags([{ type: 'User', id: 'CURRENT' }]);
        },
        invalidateTags: ['UserBadges'],
    }),
    demoLogin: builder.mutation({
        query: () => ({
            url: 'users/demo-login',
            method: 'POST',
        }),
        onSuccess: (data, thunks, cache) => {
            cache.invalidateTags([{ type: 'User', id: 'CURRENT' }]);
        },
        invalidateTags: ['UserBadges'],
    }),
    fetchCurrentUser: builder.query({
        query: () => 'users/me',
        providesTags: [{ type: 'User', id: 'CURRENT' }],
        onError: (
            error,
            { dispatch },
            { getState, extra, requestId, originalArgs, cache },
        ) => {
            if (error.status === 401) {
                // Invalidate the cache for the fetchCurrentUser query
                cache.invalidateTags([{ type: 'User', id: 'CURRENT' }]);
            }
        },
    }),
    updateCurrentUser: builder.mutation({
        query: (userData) => ({
            url: 'users/me',
            method: 'PUT',
            body: userData,
        }),
    }),
    deleteCurrentUser: builder.mutation({
        query: () => ({
            url: 'users/me',
            method: 'DELETE',
        }),
    }),
});

// User progress endpoints
const buildUserProgressEndpoints = (builder) => ({
    fetchUserProgress: builder.query({
        query: () => `users/me/progress`,
        providesTags: ['UserProgress'],
    }),
    fetchUserProgressById: builder.query({
        query: (progressId) => `users/me/progress/${progressId}`,
        providesTags: ['UserProgress'],
    }),
    createProgress: builder.mutation({
        query: (progressData) => ({
            url: `users/me/progress`,
            method: 'POST',
            body: progressData,
        }),
        invalidatesTags: ['UserProgress'],
    }),
    deleteProgressById: builder.mutation({
        query: (progressId) => ({
            url: `users/me/progress/${progressId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['UserProgress'],
    }),
    updateProgressById: builder.mutation({
        query: ({ progressId, progressData }) => ({
            url: `users/me/progress/${progressId}`,
            method: 'PUT',
            body: progressData,
        }),
        invalidatesTags: ['UserProgress'],
    }),
});

// Badge endpoints
const buildBadgeEndpoints = (builder) => ({
    fetchAllBadges: builder.query({
        query: () => 'badges',
        providesTags: ['Badges', 'UserBadges'],
    }),
    fetchBadgeById: builder.query({
        query: (id) => `badges/${id}`,
        providesTags: ['Badges', 'UserBadges'],
    }),
    // Admin only
    createBadge: builder.mutation({
        query: (badgeData) => ({
            url: 'badges',
            method: 'POST',
            body: badgeData,
        }),
        invalidatesTags: ['Badges', 'UserBadges'],
    }),
    // Admin only
    updateBadgeById: builder.mutation({
        query: ({ id, badgeData }) => ({
            url: `badges/${id}`,
            method: 'PUT',
            body: badgeData,
        }),
        invalidatesTags: ['Badges', 'UserBadges'],
    }),
    // Admin only
    deleteBadgeById: builder.mutation({
        query: (id) => ({
            url: `badges/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Badges', 'UserBadges'],
    }),
});

// User-badge endpoints
const buildUserBadgeEndpoints = (builder) => ({
    fetchUserBadges: builder.query({
        query: ({ userId }) => `user-badges/${userId}`,
    }),
    fetchCurrentUserBadges: builder.query({
        query: () => `user-badges`,
        providesTags: ['UserBadges'],
    }),
    // Admin only
    assignBadgeToUser: builder.mutation({
        query: ({ badgeId, userId }) => ({
            url: `user-badges`,
            method: 'POST',
            body: { badgeId, userId },
        }),
        invalidatesTags: ['UserBadges'],
    }),
});

// Category endpoints
const buildCategoryEndpoints = (builder) => ({
    fetchAllCategories: builder.query({
        query: () => 'categories',
    }),
    fetchCategoryById: builder.query({
        query: (id) => `categories/${id}`,
    }),
    fetchCategoriesByExerciseId: builder.query({
        query: (exerciseId) => `categories/${exerciseId}/exercises`,
    }),
    // Admin only
    createCategory: builder.mutation({
        query: (categoryData) => ({
            url: 'categories',
            method: 'POST',
            body: categoryData,
        }),
    }),
    // Admin only
    updateCategoryById: builder.mutation({
        query: ({ id, categoryData }) => ({
            url: `categories/${id}`,
            method: 'PUT',
            body: categoryData,
        }),
    }),
    // Admin only
    deleteCategoryById: builder.mutation({
        query: (id) => ({
            url: `categories/${id}`,
            method: 'DELETE',
        }),
    }),
});

// Stats endpoints
const buildStatsEndpoints = (builder) => ({
    fetchHomepageStats: builder.query({
        query: () => 'homepage-stats',
    }),
});

// Combine all the endpoints into a single API slice
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        ...buildExerciseEndpoints(builder),
        ...buildUserEndpoints(builder),
        ...buildUserProgressEndpoints(builder),
        ...buildBadgeEndpoints(builder),
        ...buildCategoryEndpoints(builder),
        ...buildUserBadgeEndpoints(builder),
        ...buildStatsEndpoints(builder),
    }),
});

// Export all the hooks for each endpoint
export const {
    // Exercise
    useFetchAllExercisesQuery,
    useFetchExerciseByIdQuery,
    useFetchAllHintsByExerciseIdQuery,
    useUpdateExerciseByIdMutation,
    useDeleteExerciseByIdMutation,
    useCreateExerciseMutation,
    // User
    useSignupUserMutation,
    useLoginUserMutation,
    useDemoLoginMutation,
    useFetchCurrentUserQuery,
    useUpdateCurrentUserMutation,
    useDeleteCurrentUserMutation,
    // User Progress
    useFetchUserProgressQuery,
    useFetchUserProgressByIdQuery,
    useCreateProgressMutation,
    useDeleteProgressByIdMutation,
    useUpdateProgressByIdMutation,
    // Badge
    useFetchAllBadgesQuery,
    useFetchBadgeByIdQuery,
    useCreateBadgeMutation,
    useUpdateBadgeByIdMutation,
    useDeleteBadgeByIdMutation,
    // Category
    useFetchAllCategoriesQuery,
    useFetchCategoryByIdQuery,
    useFetchCategoriesByExerciseIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryByIdMutation,
    useDeleteCategoryByIdMutation,
    // User-badge
    useFetchUserBadgesQuery,
    useAssignBadgeToUserMutation,
    useFetchCurrentUserBadgesQuery,
    // Stats
    useFetchHomepageStatsQuery,
} = api;
