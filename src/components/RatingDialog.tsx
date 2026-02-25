import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewData } from '../types';

interface RatingDialogProps {
  isOpen: boolean;
  reviewData: ReviewData | null;
  onSubmit: (rating: number, review: string) => void;
  onClose: () => void;
}

export function RatingDialog({ isOpen, reviewData, onSubmit, onClose }: RatingDialogProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setReviewText('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert(t('rating.pleaseSelect'));
      return;
    }

    setIsSubmitting(true);
    onSubmit(rating, reviewText);
  };

  if (!isOpen || !reviewData) return null;

  const getRatingLabel = (value: number) => {
    const labels = [
      '',
      `😠 ${t('rating.veryBad')}`,
      `😕 ${t('rating.bad')}`,
      `😐 ${t('rating.okay')}`,
      `😊 ${t('rating.good')}`,
      `😍 ${t('rating.excellent')}`,
    ];
    return labels[value];
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[5000] animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-1">{t('rating.title')}</h2>
          <p className="text-green-100 text-sm">{t('rating.subtitle')}</p>
        </div>

        {/* Driver Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {reviewData.driver_photo ? (
              <img
                src={reviewData.driver_photo}
                alt={reviewData.driver_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl border-2 border-green-500">
                {reviewData.driver_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{reviewData.driver_name}</h3>
              <p className="text-sm text-gray-500">
                {reviewData.vehicle} • {reviewData.plate_number}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transform transition-all hover:scale-110 focus:outline-none"
                >
                  <svg
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={star <= (hoverRating || rating) ? 0 : 2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-lg font-medium text-gray-700 animate-[fadeIn_0.2s_ease-out]">
                {getRatingLabel(rating)}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('rating.commentLabel')}
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t('rating.commentPlaceholder')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none text-sm"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {reviewText.length}/500
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('rating.later')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('rating.submitting')}
                </span>
              ) : (
                t('rating.submitButton')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
