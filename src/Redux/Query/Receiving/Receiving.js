import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const receivingApi = createApi({
  reducerPath: "receivingApi",
  tagTypes: ["Receiving"],

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
    getReceivingApi: builder.query({
      query: (params) =>
        `adding-pr?toPr=1&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["Receiving"],
    }),

    getReceivedApi: builder.query({
      query: (params) =>
        `adding-pr?toPr=0&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["Receiving"],
    }),

    getReceivingAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["Receiving"],
    }),

    addReceivingApi: builder.mutation({
      query: (data) => ({
        url: `/adding-pr/${data?.transaction_number}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Receiving"],
    }),

    removeReceivingApi: builder.mutation({
      query: (body) => ({
        url: `/remove-pr/${body?.transaction_number}`,
        method: "PUT",
        body: console.log(body),
      }),
      invalidatesTags: ["Receiving"],
    }),
  }),
});

export const {
  useGetReceivingApiQuery,
  useGetReceivedApiQuery,
  useGetReceivingAllApiQuery,
  useLazyGetReceivingAllApiQuery,
  useLazyGetReceivingApiQuery,
  useAddReceivingApiMutation,
  useRemoveReceivingApiMutation,
} = receivingApi;
