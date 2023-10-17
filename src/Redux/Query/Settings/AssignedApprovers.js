import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const assignedApproversApi = createApi({
    reducerPath: 'assignedApproversApi',
    tagTypes: ["AssignedApprovers"],

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
        getAssignedApproversApi: builder.query({
            query: (params) => `assign-approver?search=${params.search}&limit=${params.limit}&status=${params.status}&page=${params.page}`,
            providesTags: ["AssignedApprovers"]
        }),

        getAssignedApproversAllApi: builder.query({
            query: () => `/assign-approver`,
            transformResponse: (response) => response.data,
            providesTags: ["AssignedApprovers"]
        }),

        getAssignedApproversIdApi: builder.query({
            query: (id) => `/assign-approver/${id}`,
        }),

        postAssignedApproversStatusApi: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/assign-approver/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["AssignedApprovers"]
        }),

        postAssignedApproversApi: builder.mutation({
            query: (data) => ({
                url: `/assign-approver`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["AssignedApprovers"]
        }),

        arrangeAssignedApproversApi: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/arrange-layer/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["AssignedApprovers"]
        }),

        deleteAssignedApproversApi: builder.mutation({
            query: (id) => ({
                url: `/assign-approver/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AssignedApprovers"]
        }),


        getApproversApi: builder.query({
            query: () => `/setup-approver`,
            // transformResponse: (response) => response.data,
            providesTags: ["AssignedApprovers"]
        }),
        
    }),
})

export const { useGetAssignedApproversApiQuery, useGetAssignedApproversAllApiQuery, useGetAssignedApproversIdApiQuery,
     usePostAssignedApproversStatusApiMutation, usePostAssignedApproversApiMutation, useArrangeAssignedApproversApiMutation, useDeleteAssignedApproversApiMutation, useGetApproversApiQuery } = assignedApproversApi