export const authProvider = {
    login: async () => {
        return { success: true };
    },

    logout: async () => {
        localStorage.removeItem("token");
        return {
            logout: true,
            success: true,
            redirectTo: "/login",
            authenticated: false
        };
    },

    check: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            return { authenticated: true };
        }
        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },

    onError: async (error:any) => {
        if (error.status === 401) {
            return {
                logout: true,
                redirectTo: "/login",
                authenticated: false
            };
        }
        return {};
    },

    getPermissions: async () => Promise.resolve(),

    getIdentity: async () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const { id, nomPrenom, isAdmin } = payload;

            return Promise.resolve({
                id,
                nomPrenom,
                isAdmin,
            });
        } catch (error) {
            return null;
        }
    },

};
