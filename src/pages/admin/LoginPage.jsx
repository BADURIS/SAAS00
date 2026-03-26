import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/shared/Button';
import logo from '../../assets/logo.png';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const role = login(username, password);
        if (role === 'manager') {
            navigate('/admin');
        } else if (role === 'employee') {
            navigate('/admin/pos');
        } else {
            setError('Credenciais inválidas');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f0b',
            backgroundImage: 'radial-gradient(circle at 50% 0%, #2a1005 0%, #0f0f0b 70%)'
        }}>
            <div style={{
                backgroundColor: '#18181b',
                padding: '2.5rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 77, 0, 0.2)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logo} alt="Logo" style={{ height: '80px', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255, 77, 0, 0.3))' }} />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f3f4f6' }}>Área Restrita</h1>
                    <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Acesso exclusivo administrativo</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#d1d5db' }}>Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #3f3f46',
                                backgroundColor: '#27272a',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#d1d5db' }}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #3f3f46',
                                backgroundColor: '#27272a',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        style={{
                            justifyContent: 'center',
                            marginTop: '0.5rem',
                            backgroundColor: '#FF4D00',
                            height: '48px',
                            fontSize: '1rem'
                        }}
                    >
                        <Lock size={18} />
                        Acessar Painel
                    </Button>
                </form>
            </div>
        </div>
    );
}
