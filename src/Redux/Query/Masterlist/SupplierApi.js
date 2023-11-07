import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  tagTypes: ["Supplier"],

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
    getSupplierApi: builder.query({
      query: (params) =>
        `suppliers?search=${params.search}&page=${params.page}&limit=${params.limit}&status=${params.status}`,
      providesTags: ["Supplier"],
    }),

    getSupplierIdApi: builder.query({
      query: (id) => `setup/getById/${id}`,
    }),

    postSupplierStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/supplier/archived-supplier/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Supplier"],
    }),

    postSupplierApi: builder.mutation({
      query: (data) => ({
        url: `/supplier`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),

    updateSupplierApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/supplier/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSupplierApiQuery,
  useGetSupplierIdApiQuery,
  usePostSupplierStatusApiMutation,
  usePostSupplierApiMutation,
  useUpdateSupplierApiMutation,
} = supplierApi;
