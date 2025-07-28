
import type { UserIdentity } from '../authProvider'
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import {useGetIdentity} from "@refinedev/core";

type Props = {
    children: ReactNode;
};

export const AdminOnly = ({ children }: Props) => {
    const { data, isLoading } = useGetIdentity();
    const user = data as UserIdentity | undefined;

    if (isLoading) return null;

    if (!user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
