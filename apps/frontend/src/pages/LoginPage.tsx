import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    setServerError(undefined);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (error) {
      setServerError(getErrorMessage(error, 'Email ou mot de passe incorrect'));
    }
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <Link className="back-link" to="/">
          ← Retour à l’accueil
        </Link>
      </header>
      <main className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h1>Connexion</h1>
          <p className="auth-lead">Accédez à votre compte ExcelHub Africa.</p>

          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}

          {serverError && <p className="form-error form-error-server">{serverError}</p>}

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>

          <p className="auth-switch">
            Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
