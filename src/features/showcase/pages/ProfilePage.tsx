import React from 'react';
import { Profile, type ProfileProps } from '../../../components/composites/Profile';
import { useToast } from '../../../providers/ToastProvider';

export type ProfilePageProps = ProfileProps;

export const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { notify } = useToast();

  return (
    <Profile
      locale="tr"
      storageKey="uxigl.profile.page.v1"
      onShare={(profile) => {
        props.onShare?.(profile);
        notify({
          title: 'Profil Bağlantısı Kopyalandı',
          description: `https://${profile.website}/@${profile.name.toLowerCase().replace(/\s+/g, '')}`,
          tone: 'info',
        });
      }}
      onSave={(profile) => {
        props.onSave?.(profile);
        notify({
          title: 'Profil Güncellendi',
          description: 'Değişiklikleriniz bulut profilinize kaydedildi.',
          tone: 'success',
        });
      }}
      onRevokeSession={(sessionId) => {
        props.onRevokeSession?.(sessionId);
        notify({
          title: 'Oturum Sonlandırıldı',
          description: 'Seçili cihaz oturumu güvenli şekilde kapatıldı.',
          tone: 'warning',
        });
      }}
      {...props}
    />
  );
};
