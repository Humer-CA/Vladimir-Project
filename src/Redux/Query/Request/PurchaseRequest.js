import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseRequestApi = createApi({
  reducerPath: "purchaseRequestApi",
  tagTypes: ["PurchaseRequest"],

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
    getPurchaseRequestApi: builder.query({
      query: (params) =>
        `adding-pr?toPr=1&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["PurchaseRequest"],
    }),

    getPurchaseRequestAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["PurchaseRequest"],
    }),

    putPurchaseRequestApi: builder.mutation({
      query: (data) => ({
        url: `/adding-pr`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),

    putPurchaseRequestApi: builder.mutation({
      query: (body) => ({
        url: `/remove-pr/${body?.reference_number}`,
        method: "PUT",
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),
  }),
});

export const {
  useGetPurchaseRequestApiQuery,
  useGetPurchaseRequestAllApiQuery,
  useLazyGetPurchaseRequestAllApiQuery,
  useLazyGetPurchaseRequestApiQuery,
} = purchaseRequestApi;
