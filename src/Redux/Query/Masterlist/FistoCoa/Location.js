import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const locationApi = createApi({
    reducerPath: 'locationApi',
    tagTypes: ["Location"],


    baseQuery: fetchBaseQuery({
        baseUrl: process.env.VLADIMIR_BASE_URL,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            headers.set('Authorization', `Bearer ${token}`)
            headers.set('Accept', `application/json`)
            return headers
        }
    }),

    endpoints: (builder) => ({
        getLocationApi: builder.query({
            query: (params) => `/locations/search?search=${params.search}&page=${params.page}&limit=${params.limit}&status=${params.status}`,
            providesTags: ["Location"]
        }),

        getLocationAllApi: builder.query({
            query: () => `/location/`,
            transformResponse: (response) => response.data,
        }),

        postLocationApi: builder.mutation({
            query: (data) => ({
                url: `/location`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Location"]
        }),
    }),
})

export const { useGetLocationApiQuery, useGetLocationAllApiQuery, usePostLocationApiMutation } = locationApi