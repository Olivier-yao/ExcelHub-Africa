import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Nom : 2 caractères minimum'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterForm) {
    setServerError(undefined);
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/');
    } catch (error) {
      setServerError(getErrorMessage(error, 'Impossible de créer le compte'));
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
          <h1>Créer un compte</h1>
          <p className="auth-lead">Rejoignez ExcelHub Africa en quelques secondes.</p>

          <label htmlFor="name">Nom</label>
          <input id="name" type="text" autoComplete="name" {...register('name')} />
          {errors.name && <span className="form-error">{errors.name.message}</span>}

          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}

          {serverError && <p className="form-error form-error-server">{serverError}</p>}

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Création…' : 'Créer mon compte'}
          </button>

          <p className="auth-switch">
            Déjà un compte ? <Link to="/connexion">Se connecter</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
