"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    agentToken: string | null;
    login: (agentToken: string) => void;
    logout: () => void;
}

const AgencyAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AgencyAuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AgencyAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [agentToken, setAgentToken] = useState<string | null>(null);

    const login = (agentToken: string) => {
        setAgentToken(agentToken);
        Cookies.set('agentToken', agentToken, { expires: 30 });
    };

    const logout = () => {
        setAgentToken(null);
        Cookies.remove('agentToken');
    };

    useEffect(() => {
        const tokenFromCookie = Cookies.get('agentToken');
        if (tokenFromCookie) {
            setAgentToken(tokenFromCookie);
        }
    }, []);

    return (
        <AgencyAuthContext.Provider value={{ agentToken, login, logout }}>
            {children}
        </AgencyAuthContext.Provider>
    );
};
