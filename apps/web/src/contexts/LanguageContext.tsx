'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译文本
const translations = {
  zh: {
    // 页面标题和描述
    'site.title': '神秘塔罗占卜- IRYS',
    'site.subtitle': '聆听宇宙的声音，探索命运的奥秘',
    'site.description': '连接您的钱包，开启今日的神秘塔罗之旅。每日一卡，洞察命运的奥秘。',
    
    // 按钮文本
    'button.connectWallet': '连接钱包',
    'button.drawCard': '✨ 抽取塔罗牌 ✨',
    'button.signAndDraw': '✍️ 签名并抽取塔罗牌',
    'button.cancel': '取消',
    'button.mintNFT': '🎨 铸造 NFT',
    'button.reset': '🔄 重新抽取',
    'button.minting': '铸造中...',
    'button.signing': '签名中...',
    
    // 状态文本
    'status.drawing': '神秘力量正在汇聚...',
    'status.drawingDesc': '请稍候，IRYS正在为您选择最适合的指引',
    'status.alreadyDrawn': '您今日已经抽取过塔罗牌了',
    'status.tomorrow': '明日再来探索新的奥秘吧',
    'status.signature': '钱包签名验证',
    'status.signatureDesc': '请使用您的钱包对以下消息进行签名，以验证身份并开始塔罗牌占卜',
    'status.signatureError': '签名失败',
    'status.minting': '铸造中...',
    'status.confirming': '确认中...',
    'status.confirmed': '已确认!',
    'status.pending': '待处理',
    'status.success': '✅ 您的塔罗牌 铸造成功！',
    'status.successDesc': '您的塔罗牌 NFT 已永久记录在IRYS区块链上',
    
    // 卡牌信息
    'card.meaning': '卡牌含义 / Card Meaning:',
    'card.fortune': '今日运势 / Today\'s Fortune:',
    'card.keywords': '关键词 / Keywords:',
    'card.reversed': '(逆位 / Reversed)',
    'card.upright': '(正位 / Upright)',
    'card.back.title': '神秘力量 / Mystical Power',
    'card.back.desc': '点击抽取你的塔罗牌 / Click to draw your tarot card',
    
    // 错误信息
    'error.minting': '铸造失败',
    
    // 交易信息
    'tx.hash': '交易哈希',
    'tx.status': '状态',
    
    // 每日限制
    'daily.title': '今日塔罗指引 / Today\'s Tarot Guidance',
    'daily.desc': '让神秘的 IRYS 力量为您揭示今日的运势与指引。\nLet the mysterious IRYS power reveal today\'s fortune and guidance for you.',
    
  },
  en: {
    // 页面标题和描述
    'site.title': 'Mystical Tarot Divination',
    'site.subtitle': 'Listen to the voice of the universe, explore the mysteries of fate',
    'site.description': 'Connect your wallet to begin today\'s mystical tarot journey. One card per day, insight into the mysteries of fate.',
    
    // 按钮文本
    'button.connectWallet': 'Connect Wallet',
    'button.drawCard': '✨ Draw Tarot Card ✨',
    'button.signAndDraw': '✍️ Sign & Draw Card',
    'button.cancel': 'Cancel',
    'button.mintNFT': '🎨 Mint NFT',
    'button.reset': '🔄 View Again',
    'button.minting': 'Minting...',
    'button.signing': 'Signing...',
    
    // 状态文本
    'status.drawing': 'Mystical forces are gathering...',
    'status.drawingDesc': 'Please wait, the universe is selecting the most suitable guidance for you',
    'status.alreadyDrawn': 'You have already drawn a tarot card today',
    'status.tomorrow': 'Come back tomorrow to explore new mysteries',
    'status.signature': 'Wallet Signature Verification',
    'status.signatureDesc': 'Please sign the following message with your wallet to verify your identity and begin tarot divination',
    'status.signatureError': 'Signature Failed',
    'status.minting': 'Minting...',
    'status.confirming': 'Confirming...',
    'status.confirmed': 'Confirmed!',
    'status.pending': 'Pending',
    'status.success': '✅ NFT Minted Successfully!',
    'status.successDesc': 'Your Tarot Card NFT has been permanently recorded on the blockchain',
    
    // 卡牌信息
    'card.meaning': 'Card Meaning:',
    'card.fortune': 'Today\'s Fortune:',
    'card.reversed': '(Reversed)',
    'card.upright': '(Upright)',
    
    // 错误信息
    'error.minting': 'Minting Failed',
    
    // 交易信息
    'tx.hash': 'Transaction Hash',
    'tx.status': 'Status',
    
    // 每日限制
    'daily.title': 'Today\'s Tarot Guidance',
    'daily.desc': 'Each person can only draw one tarot card per day. Let the mystical forces reveal today\'s fortune and guidance for you.',
    
    // 卡牌背面
    'card.back.title': 'Mystical Tarot',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('zh');

  // 从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('tarot-language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 保存语言设置到localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('tarot-language', lang);
  };

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
