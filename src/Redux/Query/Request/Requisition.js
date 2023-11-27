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

      // if (endpoint === "postRequisitionApi") {
      //   headers.set(
      //     "Content-Type",
      //     "multipart/form-data; charset=utf-8; boundary=---------------------------" +
      //       Math.random().toString().substr(2)
      //   );
      // }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getRequisitionApi: builder.query({
      query: (params) =>
        `asset-request?=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["Requisition"],
    }),

    getRequisitionIdApi: builder.query({
      query: (id) => `asset-request/${id}`,
    }),

    patchRequisitionStatusApi: builder.mutation({
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
        url: `/move-to-asset-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),

    // postRequisitionApi: builder.mutation({
    //   query: (data) => ({
    //     url: `/asset-request`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Requisition"],
    // }),

    updateRequisitionApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-request/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),

    voidRequisitionApi: builder.mutation({
      query: (body) => ({
        url: `/void-request/${body?.transaction_number}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Requisition"],
    }),
  }),
});

export const {
  useGetRequisitionApiQuery,
  useGetRequisitionAllApiQuery,
  useGetRequisitionIdApiQuery,
  usePatchRequisitionStatusApiMutation,
  usePostRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
  useVoidRequisitionApiMutation,
} = requisitionApi;
