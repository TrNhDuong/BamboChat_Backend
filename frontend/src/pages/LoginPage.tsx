import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BambooIcon } from '../components/Icons';
import './Auth.css';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await authAPI.login(id, password);
            const userData = { _id: (data.user as any)._id || (data.user as any).id, email: data.user.email };
            login(data.accessToken, data.refreshToken, userData);
            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <BambooIcon size={40} style={{ color: 'var(--white)' }} />
                    </div>
                    <span className="auth-brand-name">BamboChat</span>
                </div>
                <h1>Welcome back</h1>
                <p className="subtitle">Sign in to continue chatting</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User ID</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter your user ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>


                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px' }}
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.8c2.2-2.1 3.6-5.2 3.6-8.6z" />
                            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5H1.4v3.1C3.4 21.4 7.5 24 12 24z" />
                            <path fill="#FBBC05" d="M5.2 14.3c-.3-.8-.4-1.6-.4-2.3s.1-1.5.4-2.3V6.6H1.4C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.4l3.8-3.1z" />
                            <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.5 0 3.4 2.6 1.4 6.6l3.8 3.1c1-2.9 3.6-5 6.8-5z" />
                        </svg>
                        Sign in with Google
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
