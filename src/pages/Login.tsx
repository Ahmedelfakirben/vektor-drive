import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Globe, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo201M from '../components/layout/Logo201M';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleLang = () => {
    const nextLng = isAr ? 'fr' : 'ar';
    i18n.changeLanguage(nextLng);
    document.documentElement.dir = nextLng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLng;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: email.split('@')[0],
              role: 'employee'
            }
          }
        });
        if (authError) throw authError;
        alert(isAr ? 'تم إنشاء الحساب! يمكنك الآن تسجيل الدخول.' : 'Compte créé ! Vous pouvez maintenant vous connecter.');
        setMode('login');
      }

      if (mode === 'login') {
        setLoading(false);
        navigate('/');
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || (isAr ? 'حدث خطأ' : 'Une erreur est survenue'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="bg-shape bg-shape-1" />
        <div className="bg-shape bg-shape-2" />
        <div className="bg-shape bg-shape-3" />
      </div>

      <button className="login-lang-btn" onClick={toggleLang}>
        <Globe size={16} /> {isAr ? 'Français' : 'العربية'}
      </button>

      <div className="login-container">
        <div className="login-brand-panel">
          <div className="login-brand-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="login-brand-logo" style={{ marginBottom: '2rem' }}>
              <Logo201M variant="badge" size="xl" />
            </div>
            <div className="login-brand-features">
              <div className="brand-feature"><span className="brand-feature-dot" /> {isAr ? 'إدارة الأسطول' : 'Gestion de Flotte'}</div>
              <div className="brand-feature"><span className="brand-feature-dot" /> {isAr ? 'العقود والحجوزات' : 'Contrats & Réservations'}</div>
              <div className="brand-feature"><span className="brand-feature-dot" /> {isAr ? 'الفواتير والمالية' : 'Facturation & Finance'}</div>
            </div>
          </div>
          <p className="login-brand-footer">
            © 2026 Vektor Drive — Premium Fleet Management
          </p>
        </div>

        <div className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-header">
              <h2>{mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Connexion') : (isAr ? 'إنشاء حساب' : 'Créer un cuenta')}</h2>
              <p>{mode === 'login' 
                ? (isAr ? 'أدخل بيانات الاعتماد الخاصة بك' : 'Entrez vos identifiants para acceder al sistema')
                : (isAr ? 'قم بإنشاء حسابك الأول للبدء' : 'Créez votre premier compte pour commencer')}
              </p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="input-group">
              <label className="input-label">
                <Mail size={16} /> {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <Lock size={16} /> {isAr ? 'كلمة المرور' : 'Mot de passe'}
              </label>
              <div className="login-password-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="login-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="login-form-options">
                <label className="login-checkbox-label">
                  <input type="checkbox" /> {isAr ? 'تذكرني' : 'Se souvenir de moi'}
                </label>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : (mode === 'login' ? (isAr ? 'دخول' : 'Se connecter') : (isAr ? 'تسجيل' : 'S\'inscrire'))}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', opacity: 0.6 }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ margin: '0 10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{isAr ? 'أو تجربة سريعة' : 'ou accès démo'}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail('mouad@rentcar.com');
                setPassword('x3z9Sm9sKE$m');
                setTimeout(() => {
                  const formEl = document.querySelector('form.login-form') as HTMLFormElement;
                  if (formEl) formEl.requestSubmit();
                }, 50);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                color: '#10B981',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              <span>🚀 {isAr ? 'تجربة تفاعلية (بنقرة واحدة)' : 'Tester la Démo Interactive (1 Clic)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
