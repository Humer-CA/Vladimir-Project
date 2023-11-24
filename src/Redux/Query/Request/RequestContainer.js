import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { id } from "date-fns/esm/locale";

export const requisitionApi = createApi({
  reducerPath: "requisitionApi",
  tagTypes: ["RequestContainer"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);
      headers.set("Content-Type", "multipart/form-data");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getRequestContainerAllApi: builder.query({
      query: () => `request-container`,
      transformResponse: (response) => response.data,
      providesTags: ["RequestContainer"],
    }),

    postRequestContainerApi: builder.mutation({
      query: (data) => ({
        url: `/request-container`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RequestContainer"],
    }),

    updateRequestContainerApi: builder.mutation({
      query: (data) => ({
        url: `/request-container`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RequestContainer"],
    }),

    deleteRequestContainerApi: builder.mutation({
      query: (id) => ({
        url: `/remove-container-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RequestContainer"],
    }),

    deleteRequestContainerAllApi: builder.mutation({
      query: (data) => ({
        url: `/remove-container-item/`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["RequestContainer"],
    }),
  }),
});

export const {
  useGetRequestContainerAllApiQuery,
  usePostRequestContainerApiMutation,
  useDeleteRequestContainerApiMutation,
  useDeleteRequestContainerAllApiMutation,
} = requisitionApi;
