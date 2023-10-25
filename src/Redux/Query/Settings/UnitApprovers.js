import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitApproversApi = createApi({
  reducerPath: "unitApproversApi",
  tagTypes: ["UnitApprovers"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getUnitApproversApi: builder.query({
      query: (params) =>
        `assign-approver?search=${params.search}&limit=${params.limit}&status=${params.status}&page=${params.page}`,
      providesTags: ["UnitApprovers"],
    }),

    getUnitApproversAllApi: builder.query({
      query: () => `/assign-approver`,
      transformResponse: (response) => response.data,
      providesTags: ["UnitApprovers"],
    }),

    getUnitApproversIdApi: builder.query({
      query: (id) => `/assign-approver/${id}`,
    }),

    postUnitApproversStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assign-approver/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UnitApprovers"],
    }),

    postUnitApproversApi: builder.mutation({
      query: (data) => ({
        url: `/assign-approver`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UnitApprovers"],
    }),

    arrangeUnitApproversApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/arrange-layer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UnitApprovers"],
    }),

    deleteUnitApproversApi: builder.mutation({
      query: (id) => ({
        url: `/assign-approver/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UnitApprovers"],
    }),

    getApproversApi: builder.query({
      query: () => `/setup-approver`,
      // transformResponse: (response) => response.data,
      providesTags: ["UnitApprovers"],
    }),
  }),
});

export const {
  useGetUnitApproversApiQuery,
  useGetUnitApproversAllApiQuery,
  useGetUnitApproversIdApiQuery,
  usePostUnitApproversStatusApiMutation,
  usePostUnitApproversApiMutation,
  useArrangeUnitApproversApiMutation,
  useDeleteUnitApproversApiMutation,
  useGetApproversApiQuery,
} = unitApproversApi;
