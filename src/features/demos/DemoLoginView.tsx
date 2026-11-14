import React, { useState } from 'react';
import {
  ArrowRight,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { Badge, Button, Checkbox, Input } from '../../components/primitives';

export type LoginVariety = 'split' | 'centered' | 'sso';

export interface DemoLoginViewProps {
  brandName: string;
  brandSubtitle: string;
  brandInitial: string;
  defaultEmail?: string;
  accentNote?: string;
  onSuccess: () => void;
}

export const DemoLoginView: React.FC<DemoLoginViewProps> = ({
  brandName,
  brandSubtitle,
  brandInitial,
  defaultEmail = 'daniel@uxigl.io',
  accentNote = 'SOC 2 Type II • End-to-End Encrypted Workspace',
  onSuccess,
}) => {
  const { resolvedMode } = useTheme();
  const { notify } = useToast();
  const isDark = resolvedMode === 'dark';

  const [variety, setVariety] = useState<LoginVariety>('split');
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [workspaceSlug, setWorkspaceSlug] = useState(
    brandName.toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  const [remember, setRemember] = useState(true);

  const palette = {
    cardBg: 'var(--uxu-surface-tonal)',
    cardElevated: 'var(--uxu-surface-tonal-high)',
    border: 'var(--uxu-border-subtle)',
    borderStrong: 'var(--uxu-primary)',
    text: 'var(--uxu-text-primary)',
    muted: 'var(--uxu-text-secondary)',
    subtle: 'var(--uxu-text-muted)',
    primary: 'var(--uxu-primary)',
    primaryContainer: 'var(--uxu-primary-container)',
    onPrimaryContainer: 'var(--uxu-on-primary-container)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notify({
      title: `Signed in to ${brandName}`,
      description: `Authenticated as ${email} (${variety.toUpperCase()} mode).`,
      tone: 'success',
    });
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Variety Switcher Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {brandName} Authentication
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: palette.muted }}>
            Switch between 3 ready-to-use login layouts adapted to your active uxiGL theme.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            padding: 4,
            borderRadius: 999,
            backgroundColor: palette.cardBg,
            border: `1px solid ${palette.border}`,
            gap: 4,
          }}
        >
          {(
            [
              { id: 'split', label: 'Split Showcase' },
              { id: 'centered', label: 'Centered Glass' },
              { id: 'sso', label: 'Enterprise SSO' },
            ] as const
          ).map((tab) => {
            const active = variety === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVariety(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: 600,
                  backgroundColor: active ? palette.primary : 'transparent',
                  color: active ? '#FFFFFF' : palette.muted,
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VARIETY 1: SPLIT SHOWCASE */}
      {variety === 'split' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            borderRadius: 22,
            overflow: 'hidden',
            border: `1px solid ${palette.border}`,
            backgroundColor: palette.cardBg,
            boxShadow: isDark
              ? '0 20px 50px rgba(0, 0, 0, 0.35)'
              : '0 16px 40px rgba(15, 23, 42, 0.06)',
          }}
        >
          {/* Left Visual Brand Panel */}
          <div
            style={{
              padding: '36px 32px',
              background:
                'linear-gradient(145deg, var(--uxu-primary) 0%, var(--uxu-secondary) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 400,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                {brandInitial}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{brandName}</div>
                <div style={{ fontSize: 11.5, opacity: 0.85 }}>{brandSubtitle}</div>
              </div>
            </div>

            <div style={{ margin: '28px 0' }}>
              <Badge size="sm" variant="tonal" tone="info" style={{ marginBottom: 14 }}>
                {accentNote}
              </Badge>
              <h3 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
                Welcome back to {brandName}.
              </h3>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
                Unified access to real-time telemetry, automated workflows, and adaptive uxiGL design tokens.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 12.5, opacity: 0.9 }}>
              <span>99.99% Uptime</span>
              <span>•</span>
              <span>SAML 2.0 &amp; Passkeys</span>
            </div>
          </div>

          {/* Right Sign-In Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Sign in</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13.5, color: palette.muted }}>
                Enter your credentials to continue to your workspace.
              </p>
            </div>

            <Input label="Work Email" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: palette.muted, cursor: 'pointer' }}>
                <Checkbox value={remember} onChange={setRemember} />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => notify({ title: 'Password Reset', description: `Reset link sent to ${email}.`, tone: 'info' })}
                style={{ border: 'none', background: 'transparent', color: palette.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="filled" size="md" trailingIcon={<ArrowRight size={15} />}>
              Sign in to {brandName}
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => {
                  notify({ title: 'Google OAuth', description: `Signed in as ${email}.`, tone: 'success' });
                  onSuccess();
                }}
              >
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => {
                  notify({ title: 'GitHub OAuth', description: `Signed in as ${email}.`, tone: 'success' });
                  onSuccess();
                }}
              >
                Continue with GitHub
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* VARIETY 2: CENTERED GLASS */}
      {variety === 'centered' && (
        <div
          style={{
            borderRadius: 22,
            border: `1px solid ${palette.border}`,
            padding: '44px 20px',
            background: isDark
              ? 'radial-gradient(circle at top, var(--uxu-primary-container) 0%, transparent 65%)'
              : 'radial-gradient(circle at top, var(--uxu-primary-container) 0%, transparent 70%)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 22,
              padding: '30px 28px',
              backgroundColor: palette.cardBg,
              border: `1px solid ${palette.borderStrong}`,
              backdropFilter: 'blur(18px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: isDark
                ? '0 24px 60px rgba(0, 0, 0, 0.45)'
                : '0 20px 50px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, var(--uxu-secondary) 0%, var(--uxu-primary) 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {brandInitial}
              </div>
              <h3 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>{brandName}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: palette.muted }}>
                {brandSubtitle}
              </p>
            </div>

            <Input label="Email Address" value={email} onChange={setEmail} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />

            <Button type="submit" variant="filled" size="md" style={{ width: '100%' }}>
              Sign In
            </Button>

            <button
              type="button"
              onClick={() => {
                notify({ title: 'Magic Link Sent', description: `One-click login link sent to ${email}.`, tone: 'info' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 14px',
                borderRadius: 10,
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.cardElevated,
                color: palette.text,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Mail size={15} color={palette.primary} />
              <span>Email me a Magic Link</span>
            </button>
          </form>
        </div>
      )}

      {/* VARIETY 3: ENTERPRISE SSO & PASSKEY */}
      {variety === 'sso' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 18,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              borderRadius: 20,
              padding: 28,
              backgroundColor: palette.cardBg,
              border: `1px solid ${palette.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color={palette.primary} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Corporate SAML 2.0 SSO</h3>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: palette.muted }}>
              Connect via Okta, Microsoft Entra ID, or Google Workspace using your organization slug.
            </p>
            <Input
              label="Workspace Domain"
              value={workspaceSlug}
              onChange={setWorkspaceSlug}
              placeholder="your-company"
            />
            <div style={{ fontSize: 12.5, color: palette.subtle }}>
              SSO Endpoint: <code>https://{workspaceSlug || 'company'}.{brandName.toLowerCase()}.io/sso</code>
            </div>
            <Button type="submit" variant="filled" size="md" leadingIcon={<Lock size={15} />}>
              Continue with SSO
            </Button>
          </form>

          <div
            style={{
              borderRadius: 20,
              padding: 28,
              backgroundColor: palette.cardBg,
              border: `1px solid ${palette.border}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Fingerprint size={20} color={palette.primary} />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Passkey &amp; Mobile QR</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: palette.muted }}>
                Passwordless hardware key or mobile authenticator sign-in.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: 16,
                backgroundColor: palette.cardElevated,
                border: `1px dashed ${palette.borderStrong}`,
              }}
            >
              <QrCode size={52} color={palette.primary} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Scan with {brandName} Mobile</div>
                <div style={{ fontSize: 12.5, color: palette.muted, marginTop: 3 }}>
                  Instant biometric approval • Expires in 01:45
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outlined"
              size="md"
              leadingIcon={<KeyRound size={15} />}
              onClick={() => {
                notify({ title: 'Passkey Verified', description: `Biometric sign-in successful for ${brandName}.`, tone: 'success' });
                onSuccess();
              }}
            >
              Sign in with Passkey
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

