import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;

        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userId = params.get('userId');
        const email = params.get('email');

        if (accessToken && refreshToken && userId && email) {
            hasProcessed.current = true;
            login(accessToken, refreshToken, { _id: userId, email });
            // Small delay to ensure state updates or just navigate immediately
            navigate('/chat', { replace: true });
        } else {
            console.error('Google Auth Failed: Missing tokens');
            navigate('/login', { replace: true });
        }
    }, [location.search, login, navigate]);

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner">Completing login...</div>
        </div>
    );
};

export default GoogleCallback;
