import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const companyApi = createApi({
    reducerPath: 'companyApi',
    tagTypes: ["Company"],


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
        getCompanyApi: builder.query({
            query: (params) => `/companies/search?search=${params.search}&page=${params.page}&limit=${params.limit}&status=${params.status}`,
            providesTags: ["Company"]
        }),

        getCompanyAllApi: builder.query({
            query: () => `/company/`,
        }),

        postCompanyApi: builder.mutation({
            query: (data) => ({
                url: `/company`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Company"]
        }),


    }),
})

export const { useGetCompanyApiQuery, useGetCompanyAllApiQuery, usePostCompanyApiMutation } = companyApi