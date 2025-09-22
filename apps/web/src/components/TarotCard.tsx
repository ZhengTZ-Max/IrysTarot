'use client';

import { TarotCard as TarotCardType } from '@/lib/tarot-bilingual';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
  onClick?: () => void;
}

export function TarotCard({ card, isReversed, isRevealed, onClick }: TarotCardProps) {
  const [imageError, setImageError] = useState(false);
  const { t } = useLanguage();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer transform transition-all duration-500 hover:scale-105"
      onClick={handleCardClick}
    >
      <div className={`absolute inset-0 rounded-xl shadow-2xl transition-transform duration-700 ${
        isRevealed ? 'rotate-y-0' : 'rotate-y-180'
      }`}>
        {/* 卡牌背面 */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 ${
          isRevealed ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <div className="text-cyan-300 text-sm font-mystical">
                {t('card.back.title')}
              </div>
            </div>
          </div>
        </div>

        {/* 卡牌正面 */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 border-2 border-gold-400 shadow-lg shadow-gold-500/50 ${
          isRevealed ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <div className="p-6 h-full flex flex-col">
            {/* 卡牌标题 */}
            <div className="text-center mb-4">
              <h3 className="text-gold-300 text-2xl font-bold font-mystical">
                {card.name}
              </h3>
              <p className="text-gold-400 text-base opacity-75">
                {card.nameEn}
              </p>
            </div>

            {/* 卡牌图片 */}
            <div className="flex-1 flex items-center justify-center mb-4">
              {!imageError ? (
                <Image
                  width={360}
                  height={432}
                  src={card.image} 
                  alt={card.name}
                  className={`max-w-full max-h-full object-contain rounded-lg ${isReversed ? 'rotate-180' : ''}`}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-40 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center ${isReversed ? 'rotate-180' : ''}`}>
                  <div className="text-center text-white">
                    <div className="text-5xl mb-3">🔮</div>
                    <div className="text-base font-mystical">{card.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 关键词 */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {card && card.upright && card.reversed && 
                 (isReversed ? card.reversed.keywords : card.upright.keywords) && 
                 (isReversed ? card.reversed.keywords : card.upright.keywords).slice(0, 3).map((keyword, index) => {
                  const keywordsEn = isReversed ? card.reversed.keywordsEn : card.upright.keywordsEn;
                  const keywordEn = keywordsEn && keywordsEn[index] ? keywordsEn[index] : keyword;
                  return (
                    <span 
                      key={index}
                      className="px-3 py-2 text-sm bg-gold-500/20 text-gold-300 rounded-full border border-gold-500/30"
                      title={keywordEn}
                    >
                      {keyword}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
