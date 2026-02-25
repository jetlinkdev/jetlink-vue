import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';

interface ProfileCompletionDialogProps {
  onComplete: (data: { email: string; displayName: string; phoneNumber: string }) => void;
}

export function ProfileCompletionDialog({ onComplete }: ProfileCompletionDialogProps) {
  const { t } = useTranslation();
  const user = authService.getCurrentUser();
  const [email, setEmail] = useState(user?.email || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!displayName.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    try {
      onComplete({
        email: email.trim(),
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Profile completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[3000] animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-[slideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {t('profile.title')}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {t('profile.subtitle')}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 text-center">{t('profile.error')}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Display Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.nameLabel')} *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.emailLabel')} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('profile.emailPlaceholder')}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.phoneLabel')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t('profile.phonePlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('profile.saving') : t('profile.saveButton')}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-6">
          {t('login.termsText')}{' '}
          <a href="#" className="text-blue-600 hover:underline">{t('login.termsLink')}</a>
          {' '}{t('login.and')}{' '}
          <a href="#" className="text-blue-600 hover:underline">{t('login.privacyLink')}</a>
        </p>
      </div>
    </div>
  );
}
