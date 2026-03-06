import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface ShareButtonsProps {
  title: string;
  text: string;
  dishName?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButtons({ title, text, dishName, layout = 'horizontal', size = 'md' }: ShareButtonsProps) {
  const { t } = useLanguage();
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const shareUrl = window.location.href;
  const message = dishName ? `${dishName}: ${text}` : text;

  const handleShare = (platform: 'telegram' | 'whatsapp' | 'instagram') => {
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`, '_blank');
        toast.success(t('openedTelegram'));
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedMessage}%20${encodedUrl}`, '_blank');
        toast.success(t('openedWhatsapp'));
        break;
      case 'instagram':
        const textToCopy = `${message}\n${shareUrl}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          toast.success(t('copiedToClipboard'));
          window.open('https://www.instagram.com/', '_blank');
        }).catch(() => {
          toast.error(t('copyError'));
        });
        break;
    }
  };

  const containerClass = layout === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-2';

  return (
    <div className={containerClass}>
      {/* Telegram - Original Logo */}
      <button
        onClick={() => handleShare('telegram')}
        className={`${sizeClasses[size]} bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg`}
        title={t('shareTelegramTitle')}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.332-2.97-.924c-.644-.213-.658-.644.135-.954l11.593-4.461c.538-.196 1.006.128.832.941z" />
        </svg>
      </button>

      {/* WhatsApp - Official Brand Logo */}
      <button
        onClick={() => handleShare('whatsapp')}
        className={`${sizeClasses[size]} bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg`}
        title={t('shareWhatsappTitle')}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>

      {/* Instagram - Original Logo */}
      <button
        onClick={() => handleShare('instagram')}
        className={`${sizeClasses[size]} bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg`}
        title={t('shareInstagramTitle')}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
        </svg>
      </button>
    </div>
  );
}
