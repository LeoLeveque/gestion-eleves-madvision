import type { DataProvider } from "@refinedev/core";

import axios from "axios";

/**
 * Base URL of the backend API.
 * Can be configured via the `VITE_API_URL` environment variable.
 */
export const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters, sorters }) => {
        const { current = 1, pageSize = 10 } = pagination ?? {};

        const query: Record<string, any> = {
            page: current.toString(),
            pageSize: pageSize.toString(),
        };

        filters?.forEach((filter) => {
            if ("field" in filter && filter.value !== undefined) {
                query[filter.field] = filter.value;
            }
        });

        if (sorters && sorters.length > 0) {
            query.sortBy = sorters[0].field;
            query.sortOrder = sorters[0].order;
            if (sorters[1]) {
                query.secondarySortBy = sorters[1].field;
                query.secondarySortOrder = sorters[1].order;
            }
        }

        const response = await axiosInstance.get(`/${resource}`, {
            params: query,
        });
        return {
            data: response.data.data,
            total: response.data.total,
        };
    },


    getOne: async ({ resource, id }) => {
        const response = await axiosInstance.get(`/${resource}/${id}`);
        return { data: response.data };
    },

    create: async ({ resource, variables }) => {
        const response = await axiosInstance.post(`/${resource}`, variables);
        return { data: response.data };
    },

    update: async ({ resource, id, variables }) => {
        const response = await axiosInstance.put(`/${resource}/${id}`, variables);
        return { data: response.data };
    },

    deleteOne: async ({ resource, id }) => {
        const response = await axiosInstance.delete(`/${resource}/${id}`);
        return { data: response.data };
    },

    getMany: async () => {
        throw new Error("Not implemented");
    },

    createMany: async () => {
        throw new Error("Not implemented");
    },

    updateMany: async () => {
        throw new Error("Not implemented");
    },

    deleteMany: async () => {
        throw new Error("Not implemented");
    },

    getApiUrl: () => API_URL,

    custom: async () => {
        throw new Error("Not implemented");
    },
};
