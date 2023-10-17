import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const acquisitionApi = createApi({
    reducerPath: 'acquisitionApi',
    tagTypes: ["Acquisition"],

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
        getAcquisitionApi: builder.query({
            query: (params) => `asset-request?search=${params.search}&limit=${params.limit}&status=${params.status}&page=${params.page}`,
            providesTags: ["Acquisition"]
        }),

        getAcquisitionAllApi: builder.query({
            query: () => `asset-request`,
            transformResponse: (response) => response.data,
            providesTags: ["Acquisition"]
        }),

        getAcquisitionIdApi: builder.query({
            query: (id) => `asset-request/${id}`,
        }),

        postAcquisitionStatusApi: builder.mutation({
            query: ({ id, status }) => ({
                url: `/asset-request/archived-tor/${id}`,
                method: "PATCH",
                body: {
                    status: status
                }
            }),
            invalidatesTags: ["Acquisition"]
        }),

        postAcquisitionApi: builder.mutation({
            query: (data) => ({
                url: `/asset-request`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Acquisition"]
        }),

        updateAcquisitionApi: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/asset-request/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Acquisition"]
        }),
    }),
})

export const { useGetAcquisitionApiQuery, useGetAcquisitionAllApiQuery, useGetAcquisitionIdApiQuery, usePostAcquisitionStatusApiMutation, usePostAcquisitionApiMutation, useUpdateAcquisitionApiMutation } = acquisitionApi