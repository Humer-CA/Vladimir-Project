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
        `asset-request?&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionMonitoringApi: builder.query({
      query: (params) =>
        `asset-request?&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}&for_monitoring=1`,
      providesTags: ["Requisition"],
    }),

    getRequisitionAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["Requisition"],
    }),

    getRequisitionIdApi: builder.query({
      query: (id) => `asset-request/${id}`,
      providesTags: ["Requisition"],
    }),

    getTimelineIdApi: builder.query({
      query: (transaction_number) => `per-request/${transaction_number}`,
      providesTags: ["Requisition"],
    }),

    getByTransactionApi: builder.query({
      query: ({ transaction_number }) => `asset-request/${transaction_number}`,
      providesTags: ["Requisition"],
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

    // postResubmitRequisitionApi: builder.mutation({
    //   query: ({ transaction_number, ...body }) => ({
    //     url: `/resubmit-request/${transaction_number}`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["Requisition"],
    // }),
    postResubmitRequisitionApi: builder.mutation({
      query: ({ transaction_number, body }) => ({
        url: `/resubmit-request`,
        method: "PATCH",
        body: { transaction_number },
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

    voidRequisitionReferenceApi: builder.mutation({
      query: (body) => ({
        url: `/void-request/${body?.transaction_number}/${body?.reference_number}`,
        method: "PATCH",
        // body,
      }),

      invalidatesTags: ["Requisition"],
    }),
  }),
});

export const {
  useGetRequisitionApiQuery,
  useGetRequisitionMonitoringApiQuery,
  useGetRequisitionAllApiQuery,
  useLazyGetRequisitionAllApiQuery,
  useGetRequisitionIdApiQuery,
  useGetByTransactionApiQuery,
  usePatchRequisitionStatusApiMutation,
  usePostRequisitionApiMutation,
  usePostResubmitRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
  useVoidRequisitionApiMutation,
  useVoidRequisitionReferenceApiMutation,
} = requisitionApi;
