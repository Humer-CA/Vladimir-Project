import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requisitionApi = createApi({
  reducerPath: "requisitionApi",
  tagTypes: ["Requisition"],

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
    getRequisitionApi: builder.query({
      query: (params) =>
        `asset-request?search=${params.search}&limit=${params.limit}&status=${params.status}&page=${params.page}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionAllApi: builder.query({
      query: () => `asset-request`,
      transformResponse: (response) => response.data,
      providesTags: ["Requisition"],
    }),

    getRequisitionIdApi: builder.query({
      query: (id) => `asset-request/${id}`,
    }),

    postRequisitionStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/asset-request/archived-tor/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Requisition"],
    }),

    postRequisitionApi: builder.mutation({
      query: (data) => ({
        url: `/asset-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),

    updateRequisitionApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-request/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),
  }),
});

export const {
  useGetRequisitionApiQuery,
  useGetRequisitionAllApiQuery,
  useGetRequisitionIdApiQuery,
  usePostRequisitionStatusApiMutation,
  usePostRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
} = requisitionApi;