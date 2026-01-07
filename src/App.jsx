import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ExpenseProvider } from './context/ExpenseContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication status on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // Optional: Validate token with the server
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('jwt');
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                setError('Failed to verify authentication status');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = (success) => {
        if (success) {
            setIsAuthenticated(true);
            setError(null);
        } else {
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = async () => {
        try {
            // Optional: Call logout API to invalidate the token
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('jwt');
            setIsAuthenticated(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
                    <p className="text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            </div>
        );
    }

    // Get Google Client ID from environment variables
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <ErrorBoundary>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    {!isAuthenticated ? (
                        <Login 
                            onLogin={handleLogin} 
                            error={error} 
                            onGoogleSuccess={handleLogin}
                        />
                    ) : (
                        <ExpenseProvider>
                            <Dashboard onLogout={handleLogout} />
                        </ExpenseProvider>
                    )}
                    <Toaster 
                        position="top-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#fff',
                                color: '#1f2937',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '0.75rem',
                                padding: '1rem 1.5rem',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10B981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#EF4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
            </ErrorBoundary>
        </GoogleOAuthProvider>
    );
}

export default App;