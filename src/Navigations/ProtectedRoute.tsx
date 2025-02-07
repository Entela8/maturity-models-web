import React, { ReactElement } from "react"
import { inject, observer } from "mobx-react";
import { Navigate } from "react-router-dom";
import UserStore from "../Stores/UserStore";

interface ProtectedRouteProps {
    userStore?: UserStore,
    element: ReactElement
}

export const ProtectedRoute = inject("userStore")(observer(({ userStore, element }: ProtectedRouteProps) => {
    if (!userStore) {
        return null
    }
    // Vérifie si l'utilisateur est connecté
    const isAuthenticated = userStore.user !== undefined;
    // Si l'utilisateur est connecté, affiche le composant demandé
    // Sinon, redirige vers la page de connexion
    return isAuthenticated ? element : <Navigate to="/login" />;
}))
