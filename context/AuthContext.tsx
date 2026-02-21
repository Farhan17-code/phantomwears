import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
import { supabase } from '../supabase';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async (userId: string, email: string, name: string) => {
        console.log('AUTH DEBUG: Checking role for', email);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            let role: 'admin' | 'user' = 'user';
            
            if (error) {
                console.log('AUTH DEBUG: Profile fetch error (role defaults to user):', error.message);
            }

            if (data) {
                role = data.role as 'admin' | 'user';
                console.log('AUTH DEBUG: Role from DB is:', role);
            }
            
            if (email === ADMIN_EMAIL) {
                console.log('AUTH DEBUG: Email matches hardcoded admin! Forcing admin role.');
                role = 'admin';
            }

            return {
                id: userId,
                email,
                name,
                role
            };
        } catch (error) {
            console.error('AUTH DEBUG: Profile fetch crashed:', error);
            return { id: userId, email, name, role: 'user' as const };
        }
    };

    useEffect(() => {
        let isMounted = true;

        const syncUser = async (session: any) => {
            if (session?.user) {
                const userData = await fetchUserProfile(
                    session.user.id,
                    session.user.email || '',
                    session.user.user_metadata.name || 'User'
                );
                if (isMounted) {
                    setUser(userData);
                    setToken(session.access_token);
                    setIsLoading(false);
                }
            } else {
                if (isMounted) {
                    setUser(null);
                    setToken(null);
                    setIsLoading(false);
                }
            }
        };

        // 1. Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (isMounted) {
                if (session) {
                    syncUser(session);
                } else {
                    setIsLoading(false);
                }
            }
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AUTH DEBUG: Auth state changed event:', event);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                syncUser(session);
            } else if (event === 'SIGNED_OUT') {
                if (isMounted) {
                    setUser(null);
                    setToken(null);
                    setIsLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, role: 'user' }
                }
            });
            if (error) throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            login,
            loginWithGoogle,
            signup,
            logout,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
