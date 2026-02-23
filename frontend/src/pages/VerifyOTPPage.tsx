import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { BambooIcon } from '../components/Icons';
import './Auth.css';

const VerifyOTPPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = (location.state as any)?.email || '';

    const [email, setEmail] = useState(emailFromState);
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { data } = await authAPI.verifyOTP(email, otpCode);
            setSuccess(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
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
                <h1>Verify Email</h1>
                <p className="subtitle">Enter the OTP code sent to your email</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="input"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>OTP Code</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <p className="auth-link">
                    <Link to="/login">Back to login</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTPPage;
