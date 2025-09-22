'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSignMessage } from 'wagmi';
import Image from 'next/image';
import { TarotCard } from './TarotCard';
import { ConnectWallet } from './ConnectWallet';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FallingElements } from './FallingElements';
import { generateTarotReading, generateTarotNFTMetadata, MAJOR_ARCANA, TAROT_CARDS, type TarotReading as TarotReadingType } from '@/lib/tarot-bilingual';
import { CONTRACT_CONFIG, DEFAULT_MINT_PRICE, generateTarotTokenURI } from '@/lib/contract';
import { useLanguage } from '@/contexts/LanguageContext';

export function TarotReading() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const { signMessage, data: signature, isPending: isSigning, error: signError } = useSignMessage();
  const { t } = useLanguage();

  const [currentReading, setCurrentReading] = useState<TarotReadingType | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [needsSignature, setNeedsSignature] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // 移除不再使用的状态变量
  const [dailyCards, setDailyCards] = useState<TarotReadingType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [submittedCards, setSubmittedCards] = useState<Set<number>>(new Set());
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [canCloseProgress, setCanCloseProgress] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyReadings, setHistoryReadings] = useState<(TarotReadingType & { id?: string; timestamp?: string; transactionHash?: string })[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showCardGallery, setShowCardGallery] = useState(false);

  // 检查今日是否已抽取 - 使用本地存储检查

  // 客户端渲染检查
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // 监听交易错误状态
  React.useEffect(() => {
    if (error && showProgressModal) {
      console.error('Transaction error detected:', error);
      
      // 设置错误状态，允许关闭弹窗
      let errorMessage = '操作失败';
      
      if (error.message) {
        if (error.message.includes('User rejected') || error.message.includes('User denied')) {
          errorMessage = '用户取消了操作';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法支付交易费用';
        } else if (error.message.includes('network')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        } else if (error.message.includes('contract')) {
          errorMessage = '合约调用失败，请稍后重试';
        } else if (error.message.includes('missing revert data')) {
          errorMessage = '交易失败，请检查网络连接和合约状态';
        } else {
          errorMessage = `操作失败: ${error.message}`;
        }
      }
      
      setProgressError(errorMessage);
      setProgressStep(0); // 重置步骤
      setProgressMessage('操作失败');
      setCanCloseProgress(true);
    }
  }, [error, showProgressModal]);

  // 监听交易成功状态
  React.useEffect(() => {
    if (isConfirmed && showProgressModal && !progressError) {
      console.log('Transaction confirmed successfully');
      setProgressStep(4);
      setProgressMessage('交易确认成功！');
      setCanCloseProgress(true);
    }
  }, [isConfirmed, showProgressModal, progressError]);

  // 加载已抽取的卡牌 - 不再限制日期
  React.useEffect(() => {
    if (address && isClient) {
      const dailyKey = `tarot_daily_${address}`;
      
      try {
        const savedCards = localStorage.getItem(dailyKey);
        if (savedCards) {
          const cards = JSON.parse(savedCards);
          setDailyCards(cards);
          if (cards.length > 0) {
            setCurrentReading(cards[cards.length - 1]);
            setCurrentCardIndex(cards.length - 1);
            setIsRevealed(true);
          }
        }
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    }
  }, [address, isClient]);

  const handleDrawCard = async () => {
    if (!address) return;
    
    // 移除所有限制，允许无限抽取

    // 需要签名验证
    setNeedsSignature(true);
  };

  const handleSignAndDraw = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setLoadingMessage('正在准备签名...');
      setShowFailureModal(false); // 重置失败弹窗状态
      
      // 创建签名消息
      const now = new Date();
      const message = `Tarot Divination Request\nWallet: ${address}\nDate: ${now.toISOString()}\nNonce: ${Math.random().toString(36).substring(2, 15)}`;
      
      setLoadingMessage('请确认钱包签名...');
      // 请求签名
      await signMessage({ message });
    } catch (error: unknown) {
      console.error('Signing failed:', error);
      
      // 关闭加载弹窗和签名状态
      setNeedsSignature(false);
      setIsLoading(false);
      setLoadingMessage('');
      
      // 显示失败弹窗
      let errorMessage = '签名失败';
      
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        const message = error.message;
        if (message.includes('User rejected') || message.includes('User denied') || message.includes('User cancelled')) {
          errorMessage = '用户取消了签名操作';
        } else if (message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法支付签名费用';
        } else if (message.includes('network')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        } else {
          errorMessage = `签名失败: ${message}`;
        }
      }
      
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  };

  const performTarotDraw = React.useCallback(async () => {
    if (!address) return;

    setIsDrawing(true);
    setIsRevealed(false);
    setCurrentReading(null);
    setNeedsSignature(false);
    setLoadingMessage('正在生成塔罗牌...');
    
    // 简单的延迟效果
    setTimeout(() => {
      try {
        const reading = generateTarotReading(MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)], Math.random() < 0.3, address);

        // 添加到今日抽取的卡牌列表 - 支持无限抽取
        const newDailyCards = [...dailyCards, reading];
        
        setDailyCards(newDailyCards);
        setCurrentReading(reading);
        setCurrentCardIndex(newDailyCards.length - 1);
        setIsDrawing(false);
        setIsLoading(false);
        setLoadingMessage('');
        
        // 保存到本地存储 - 不再需要日期限制
        const dailyKey = `tarot_daily_${address}`;
        localStorage.setItem(dailyKey, JSON.stringify(newDailyCards));
        
        // 延迟显示卡牌
        setTimeout(() => {
          setIsRevealed(true);
        }, 500);
      } catch (error) {
        console.error('Error generating tarot reading:', error);
        setIsDrawing(false);
        setIsLoading(false);
        setLoadingMessage('');
      }
    }, 1000);
  }, [address, dailyCards]);

  // 当签名成功后，进行抽卡
  React.useEffect(() => {
    if (signature && address && !currentReading) {
      performTarotDraw();
    }
  }, [signature, address, currentReading, performTarotDraw]);

  // 当签名错误时，关闭加载弹窗并显示失败信息
  React.useEffect(() => {
    if (signError && isLoading) {
      setIsLoading(false);
      setLoadingMessage('');
      setNeedsSignature(false);
      
      let errorMessage = '签名失败';
      if (signError.message) {
        if (signError.message.includes('User rejected') || signError.message.includes('User denied') || signError.message.includes('User cancelled')) {
          errorMessage = '用户取消了签名操作';
        } else if (signError.message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法支付签名费用';
        } else if (signError.message.includes('network')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        } else {
          errorMessage = `签名失败: ${signError.message}`;
        }
      }
      
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  }, [signError, isLoading]);

  // 当writeContract错误时，关闭加载弹窗并显示失败信息
  React.useEffect(() => {
    if (error && isLoading) {
      setIsLoading(false);
      setLoadingMessage('');
      
      let errorMessage = '交易失败';
      if (error.message) {
        if (error.message.includes('User rejected') || error.message.includes('User denied') || error.message.includes('User cancelled')) {
          errorMessage = '用户取消了交易操作';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法支付交易费用';
        } else if (error.message.includes('network')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        } else if (error.message.includes('contract')) {
          errorMessage = '合约调用失败，请稍后重试';
        } else {
          errorMessage = `交易失败: ${error.message}`;
        }
      }
      
      setFailureMessage(errorMessage);
      setShowFailureModal(true);
    }
  }, [error, isLoading]);

  // 保存运势到历史记录
  const saveToHistory = React.useCallback((reading: TarotReadingType & { id?: string; timestamp?: string; transactionHash?: string }) => {
    if (!address || !isClient) return;
    
    try {
      const historyKey = `tarot_history_${address}`;
      const existingHistory = localStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // 添加时间戳和交易哈希
      const readingWithTimestamp = {
        ...reading,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        transactionHash: reading.transactionHash || null
      };
      
      // 添加到历史记录开头
      const updatedHistory = [readingWithTimestamp, ...history];
      
      // 只保留最近10条记录
      const limitedHistory = updatedHistory.slice(0, 10);
      
      localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }, [address, isClient]);

  // 当交易确认后，标记为已提交
  React.useEffect(() => {
    if (isConfirmed && currentReading) {
      // 更新进度到完成状态
      setProgressStep(4);
      setProgressMessage('交易确认成功！运势已提交到区块链');
      
      // 延迟关闭进度弹窗并更新状态
      setTimeout(() => {
        setShowProgressModal(false);
        setProgressStep(0);
        setProgressMessage('');
        
        // 记录已提交的卡牌
        setSubmittedCards(prev => new Set([...prev, currentCardIndex]));
        setShowSuccessMessage(true);

        // 保存交易哈希到本地存储
        if (hash) {
          setTransactionHash(hash);
          const transactionHashKey = `tarot_transaction_hash_${address}`;
          localStorage.setItem(transactionHashKey, hash);
        }
        
        // 保存到历史记录（包含交易哈希）
        if (currentReading) {
          saveToHistory({
            ...currentReading,
            transactionHash: hash || undefined
          });
        }
      }, 2000); // 显示成功状态2秒
    }
  }, [isConfirmed, address, currentReading, hash, currentCardIndex, saveToHistory]);


  const handleSubmitFortune = async () => {
    if (!address || !currentReading) return;

    // 检查合约地址是否有效
    if (!CONTRACT_CONFIG.address || CONTRACT_CONFIG.address === '0x0000000000000000000000000000000000000000') {
      setShowFailureModal(true);
      setFailureMessage('合约地址未配置，无法提交运势。请检查环境变量设置。');
      return;
    }

    try {
      // 显示进度弹窗
      setShowProgressModal(true);
      setProgressStep(1);
      setProgressMessage('正在准备提交运势...');
      setShowFailureModal(false);
      setProgressError(null); // 重置错误状态
      setCanCloseProgress(false); // 重置关闭状态
      
      // 使用当前选中的卡牌
      const metadata = generateTarotNFTMetadata(currentReading);
      const tokenURI = generateTarotTokenURI(metadata);

      setProgressStep(2);
      setProgressMessage('正在提交交易到区块链...');
      
      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintNFT',
        args: [tokenURI],
        value: DEFAULT_MINT_PRICE,
      });
      
      // 交易已提交，等待确认
      setProgressStep(3);
      setProgressMessage('交易已提交，等待区块链确认...');
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      
      // 在进度弹窗中显示错误状态
      let errorMessage = '操作失败';
      
      if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        const message = err.message;
        if (message.includes('User rejected') || message.includes('User denied')) {
          errorMessage = '用户取消了操作';
        } else if (message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法支付交易费用';
        } else if (message.includes('network')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        } else if (message.includes('contract')) {
          errorMessage = '合约调用失败，请稍后重试';
        } else if (message.includes('missing revert data')) {
          errorMessage = '交易失败，请检查网络连接和合约状态';
        } else {
          errorMessage = `操作失败: ${message}`;
        }
      }
      
      // 设置错误状态，允许关闭弹窗
      setProgressError(errorMessage);
      setProgressStep(0); // 重置步骤
      setProgressMessage('操作失败');
      setCanCloseProgress(true);
    }
  };

  const resetReading = () => {
    setCurrentReading(null);
    setIsRevealed(false);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setProgressStep(0);
    setProgressMessage('');
    setProgressError(null);
    setCanCloseProgress(false);
  };

  const closeFailureModal = () => {
    setShowFailureModal(false);
    setFailureMessage('');
  };

  // 验证历史记录数据结构
  const validateHistoryReading = (reading: unknown): reading is TarotReadingType & { id?: string; timestamp?: string } => {
    return Boolean(reading && 
           typeof reading === 'object' &&
           reading !== null &&
           'card' in reading &&
           reading.card && 
           typeof reading.card === 'object' &&
           reading.card !== null &&
           ('name' in reading.card || 'nameEn' in reading.card) &&
           ('interpretation' in reading || 'meaning' in reading));
  };

  // 加载历史运势数据
  const loadHistoryReadings = async () => {
    if (!address || !isClient) return;
    
    setIsLoadingHistory(true);
    try {
      // 从本地存储获取历史数据
      const historyKey = `tarot_history_${address}`;
      const storedHistory = localStorage.getItem(historyKey);
      
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // 验证和过滤数据
        const validHistory = parsedHistory.filter(validateHistoryReading);
        // 按日期排序，最新的在前
        const sortedHistory = validHistory.sort((a: TarotReadingType & { id?: string; timestamp?: string }, b: TarotReadingType & { id?: string; timestamp?: string }) => 
          new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
        );
        setHistoryReadings(sortedHistory);
      } else {
        setHistoryReadings([]);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistoryReadings([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };



  // 打开历史查看弹窗
  const openHistoryModal = () => {
    setShowHistoryModal(true);
    loadHistoryReadings();
  };

  // 关闭历史查看弹窗
  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setHistoryReadings([]);
  };

  // 打开卡牌展示弹窗
  const openCardGallery = () => {
    setShowCardGallery(true);
  };

  // 关闭卡牌展示弹窗
  const closeCardGallery = () => {
    setShowCardGallery(false);
  };

  // 生成区块链浏览器链接
  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.irys.xyz/tx/${txHash}`;
  };

  // 下载卡牌图片
  const downloadCardImage = async (reading: TarotReadingType & { id?: string; timestamp?: string; transactionHash?: string }) => {
    try {
      // 如果有卡牌图片，直接下载原图
      if (reading.card?.image) {
        const response = await fetch(reading.card.image);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = reading.timestamp ? new Date(reading.timestamp).toLocaleDateString('zh-CN') : '未知时间';
        a.download = `塔罗牌_${reading.card?.name || '未知'}_${date}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      // 如果没有图片，使用Canvas绘制
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 设置canvas尺寸
      canvas.width = 300;
      canvas.height = 450;

      // 绘制背景渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, '#7c3aed'); // purple-600
      gradient.addColorStop(1, '#4f46e5'); // indigo-600
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 450);

      // 绘制边框
      ctx.strokeStyle = '#a855f7'; // purple-500
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 296, 446);

      // 绘制卡牌表情符号
      ctx.font = '120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(reading.card?.emoji || '🔮', 150, 200);

      // 绘制卡牌名称
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#e9d5ff'; // purple-200
      ctx.fillText(reading.card?.name || '未知卡牌', 150, 300);

      // 绘制位置信息
      ctx.font = '18px Arial';
      ctx.fillStyle = '#c4b5fd'; // purple-300
      ctx.fillText(reading.isReversed ? '逆位' : '正位', 150, 330);

      // 绘制日期
      ctx.font = '14px Arial';
      ctx.fillStyle = '#a78bfa'; // purple-400
      const date = reading.timestamp ? new Date(reading.timestamp).toLocaleDateString('zh-CN') : '未知时间';
      ctx.fillText(date, 150, 360);

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `塔罗牌_${reading.card?.name || '未知'}_${date}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  // 切换到指定卡牌
  const switchToCard = (index: number) => {
    if (index >= 0 && index < dailyCards.length) {
      setCurrentCardIndex(index);
      setCurrentReading(dailyCards[index]);
      setIsRevealed(true);
    }
  };

  // 切换到上一张卡牌
  const switchToPreviousCard = () => {
    if (currentCardIndex > 0) {
      switchToCard(currentCardIndex - 1);
    }
  };

  // 切换到下一张卡牌
  const switchToNextCard = () => {
    if (currentCardIndex < dailyCards.length - 1) {
      switchToCard(currentCardIndex + 1);
    }
  };


  // 避免服务器端渲染问题
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
          <div className="text-6xl mb-6">🔮</div>
          <h2 className="text-3xl font-bold text-cyan-300 mb-4 font-mystical">
            神秘塔罗占卜
          </h2>
          <p className="text-cyan-200 mb-8 max-w-md">
            正在加载神秘力量...
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
          <div className="text-6xl mb-6">🔮</div>
          <h2 className="text-3xl font-bold text-cyan-300 mb-4 font-mystical">
            {t('site.title')}
          </h2>
          <p className="text-cyan-200 mb-8 max-w-md">
            {t('site.description')}
          </p>
          <div className="flex justify-center gap-4">
            <ConnectWallet />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* 左上角按钮组 - 只在连接钱包后显示 */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={openCardGallery}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105"
        >
          🃏 所有卡牌
        </button>
        <button
          onClick={openHistoryModal}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
        >
          📚 查看历史运势
        </button>
      </div>

      {/* Loading弹窗 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl p-8 border border-cyan-500/30 max-w-md mx-4">
            <div className="text-center">
              <div className="animate-spin text-6xl text-cyan-400 mb-4">🔮</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 font-mystical">
                神秘力量正在运作
              </h3>
              <p className="text-cyan-200 text-lg mb-6">
                {loadingMessage}
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse text-cyan-400 text-sm">
                  请耐心等待...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 操作失败弹窗 */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-red-900 rounded-2xl p-8 border border-red-500/30 max-w-md mx-4">
            <div className="text-center">
              <div className="text-6xl text-red-400 mb-4">❌</div>
              <h3 className="text-2xl font-bold text-red-300 mb-4 font-mystical">
                操作失败
              </h3>
              <p className="text-red-200 text-lg mb-6">
                {failureMessage}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeFailureModal}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 进度弹窗 */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 rounded-3xl p-8 border border-cyan-500/30 max-w-lg mx-4 relative overflow-hidden progress-modal-glow">
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* 粒子效果 */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400/60 rounded-full progress-particle"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 text-center">
              {/* 动态图标 */}
              <div className="mb-6 relative">
                {progressError ? (
                  <div className="progress-error-shake text-6xl text-red-400 relative">
                    ❌
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-400 rounded-full progress-step-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-orange-400 rounded-full progress-step-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                ) : progressStep === 1 ? (
                  <div className="progress-step-rotate text-6xl text-cyan-400 relative">
                    🔮
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full progress-step-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full progress-step-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                ) : progressStep === 2 ? (
                  <div className="progress-step-bounce text-6xl text-purple-400 relative">
                    ⚡
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full progress-step-pulse"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full progress-step-pulse" style={{animationDelay: '0.3s'}}></div>
                  </div>
                ) : progressStep === 3 ? (
                  <div className="progress-step-pulse text-6xl text-yellow-400 relative">
                    ⏳
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full progress-step-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-orange-400 rounded-full progress-step-pulse" style={{animationDelay: '0.7s'}}></div>
                  </div>
                ) : progressStep === 4 ? (
                  <div className="progress-success-celebration text-6xl text-green-400 relative">
                    ✅
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full progress-step-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full progress-step-pulse" style={{animationDelay: '0.4s'}}></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-1 h-1 bg-yellow-400 rounded-full progress-step-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                ) : null}
              </div>

              {/* 标题 */}
              <h3 className={`text-2xl font-bold mb-4 font-mystical transition-all duration-500 ${
                progressError 
                  ? 'text-red-400' 
                  : progressStep === 4 
                    ? 'progress-success-celebration text-green-400' 
                    : 'text-cyan-300'
              }`}>
                {progressError 
                  ? '操作失败' 
                  : progressStep === 4 
                    ? '运势提交成功！' 
                    : '神秘力量正在运作'
                }
              </h3>

              {/* 进度消息 */}
              <p className={`text-lg mb-6 transition-all duration-500 ${
                progressError ? 'text-red-300' : 'text-cyan-200'
              }`}>
                {progressError || progressMessage}
              </p>

              {/* 进度条 */}
              <div className="w-full bg-slate-700 rounded-full h-4 mb-6 overflow-hidden relative">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ease-out relative ${
                    progressError 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'progress-bar-shimmer'
                  }`}
                  style={{ width: progressError ? '100%' : `${(progressStep / 4) * 100}%` }}
                >
                  {!progressError && (
                    <>
                      <div className="absolute inset-0 bg-white/20 progress-wave"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent progress-wave" style={{animationDelay: '1s'}}></div>
                    </>
                  )}
                </div>
                {/* 进度条光效 */}
                {!progressError && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent progress-wave"></div>
                )}
              </div>

              {/* 进度步骤指示器 */}
              <div className="flex justify-center space-x-3 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-4 h-4 rounded-full transition-all duration-500 relative ${
                      step <= progressStep
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50 progress-step-pulse'
                        : 'bg-slate-600'
                    }`}
                  >
                    {step <= progressStep && (
                      <div className="absolute inset-0 bg-white/30 rounded-full progress-step-pulse"></div>
                    )}
                    {step === progressStep && (
                      <div className="absolute -inset-1 bg-cyan-400/30 rounded-full progress-step-pulse"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* 状态描述 */}
              <div className="text-cyan-300 text-sm space-y-2">
                {progressStep >= 1 && (
                  <div className={`transition-all duration-700 flex items-center justify-center gap-2 ${
                    progressStep === 1 ? 'text-cyan-400 font-semibold progress-step-pulse' : 'text-cyan-300'
                  }`}>
                    <span className="text-lg">✓</span>
                    <span>准备提交数据</span>
                    {progressStep === 1 && <span className="text-xs">✨</span>}
                  </div>
                )}
                {progressStep >= 2 && (
                  <div className={`transition-all duration-700 flex items-center justify-center gap-2 ${
                    progressStep === 2 ? 'text-purple-400 font-semibold progress-step-pulse' : 'text-cyan-300'
                  }`}>
                    <span className="text-lg">⚡</span>
                    <span>提交到区块链</span>
                    {progressStep === 2 && <span className="text-xs">🚀</span>}
                  </div>
                )}
                {progressStep >= 3 && (
                  <div className={`transition-all duration-700 flex items-center justify-center gap-2 ${
                    progressStep === 3 ? 'text-yellow-400 font-semibold progress-step-pulse' : 'text-cyan-300'
                  }`}>
                    <span className="text-lg">⏳</span>
                    <span>等待确认</span>
                    {progressStep === 3 && <span className="text-xs">🔍</span>}
                  </div>
                )}
                {progressStep >= 4 && (
                  <div className={`transition-all duration-700 flex items-center justify-center gap-2 ${
                    progressStep === 4 ? 'text-green-400 font-semibold progress-success-celebration' : 'text-cyan-300'
                  }`}>
                    <span className="text-lg">✅</span>
                    <span>交易确认成功</span>
                    {progressStep === 4 && <span className="text-xs">🎉</span>}
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              {progressError ? (
                <div className="mt-6 space-y-4">
                  <div className="text-red-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span>操作失败，请重试或联系支持</span>
                      <span className="text-xs">⚠️</span>
                    </div>
                  </div>
                  <button
                    onClick={closeProgressModal}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
                  >
                    关闭
                  </button>
                </div>
              ) : progressStep < 4 ? (
                <div className="mt-6 text-cyan-400 text-sm progress-step-pulse">
                  <div className="flex items-center justify-center gap-2">
                    <span>请耐心等待，不要关闭页面</span>
                    <span className="text-xs">🔮</span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-green-400 text-sm progress-success-celebration">
                  <div className="flex items-center justify-center gap-2">
                    <span>运势已成功提交到区块链！</span>
                    <span className="text-lg">🎊</span>
                  </div>
                </div>
              )}

              {/* 关闭按钮 - 仅在成功或错误时显示 */}
              {(progressStep === 4 || canCloseProgress) && !progressError && (
                <div className="mt-6">
                  <button
                    onClick={closeProgressModal}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-300"
                  >
                    关闭
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 历史运势查看弹窗 */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 rounded-3xl p-6 border border-purple-500/30 max-w-4xl mx-4 relative overflow-hidden max-h-[80vh] w-full">
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10">
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-purple-300 font-mystical">
                  📚 历史运势记录
                </h3>
                <button
                  onClick={closeHistoryModal}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* 内容区域 */}
              <div className="max-h-96 overflow-y-auto">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-purple-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      加载历史记录中...
                    </div>
                  </div>
                ) : historyReadings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔮</div>
                    <div className="text-purple-300 text-lg mb-2">暂无历史记录</div>
                    <div className="text-gray-400 text-sm">开始抽取塔罗牌，创建您的运势记录吧！</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyReadings.map((reading, index) => (
                      <div
                        key={reading.id || index}
                        className="bg-gradient-to-r from-slate-700/50 to-purple-800/50 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* 卡牌图片 */}
                          <div className="flex-shrink-0">
                            <div className="w-42 h-48 rounded-xl shadow-lg border-2 border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 overflow-hidden">
                              {reading.card?.image ? (
                                <Image
                                  src={reading.card.image}
                                  alt={reading.card?.name || '塔罗牌'}
                                  width={168}
                                  height={192}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // 如果图片加载失败，显示表情符号作为后备
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl">${reading.card?.emoji || '🔮'}</div>`;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl">
                                  {reading.card?.emoji || '🔮'}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* 卡牌信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-purple-200 truncate">
                                {reading.card?.name || reading.card?.nameEn || '未知卡牌'} / {reading.card?.nameEn || reading.card?.name || 'Unknown'}
                              </h4>
                              <span className="text-xs text-gray-400">
                                {reading.timestamp ? new Date(reading.timestamp).toLocaleString('zh-CN') : '未知时间'}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-300 mb-2">
                              <div className="font-medium text-purple-300 mb-1">
                                位置: {reading.isReversed ? '逆位' : '正位'}
                              </div>
                              <div className="line-clamp-2">
                                {reading.interpretation || reading.meaning?.zh || '暂无解读'}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {(reading.card?.upright?.keywords || reading.keywords?.zh || []).map((keyword: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                            
                            {/* 按钮组 */}
                            <div className="flex gap-2">
                              {/* 下载按钮 */}
                              <button
                                onClick={() => downloadCardImage(reading)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                              >
                                📥 下载卡牌
                              </button>
                              
                              {/* 查看交易哈希按钮 */}
                              {reading.transactionHash && (
                                <button
                                  onClick={() => window.open(getExplorerUrl(reading.transactionHash!), '_blank', 'noopener noreferrer')}
                                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
                                  title="点击查看区块链交易详情"
                                >
                                  🔍 查看哈希
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部信息 */}
              <div className="mt-6 pt-4 border-t border-purple-500/30">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>共 {historyReadings.length} 条记录</span>
                  <span>最多保存 10 条记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 卡牌展示弹窗 */}
      {showCardGallery && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl border border-purple-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  🃏
                </div>
                <h2 className="text-2xl font-bold text-white">塔罗牌图鉴</h2>
              </div>
              <button
                onClick={closeCardGallery}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {TAROT_CARDS.map((card, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-purple-800/50 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    {/* 卡牌图片 */}
                    <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.name}
                          width={200}
                          height={267}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl">${card.emoji}</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl">
                          {card.emoji}
                        </div>
                      )}
                    </div>

                    {/* 卡牌信息 */}
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-purple-200 mb-1">
                        {card.name}
                      </h3>
                      <p className="text-xs text-purple-300 mb-2">
                        {card.nameEn}
                      </p>
                      
                      {/* 获得几率 */}
                      <div className="bg-purple-600/20 rounded-lg p-2 mb-2">
                        <div className="text-xs text-purple-200 mb-1">获得几率</div>
                        <div className="text-sm font-bold text-purple-100">
                          {((1 / TAROT_CARDS.length) * 100).toFixed(1)}%
                        </div>
                      </div>

                      {/* 关键词 */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {card.upright?.keywords?.slice(0, 2).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="border-t border-purple-500/30 bg-slate-800/50">
              <div className="text-center text-sm text-gray-400">
                共 {TAROT_CARDS.length} 张塔罗牌，每张卡牌获得几率相等
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 掉落元素效果 */}
      <FallingElements />
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 右上角控制区域 */}
        <div className="flex justify-end items-center gap-4 mb-8" style={{flexWrap: 'wrap'}}>
          <LanguageSwitcher />
          <ConnectWallet />
        </div>

        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 font-mystical">
            {t('site.title')}
          </h1>
          <p className="text-cyan-200 text-lg">
            {t('site.subtitle')}
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {!currentReading && !isDrawing && (
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-block p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
                  <div className="text-8xl mb-4">🌟</div>
                  <h2 className="text-2xl text-cyan-300 mb-4 font-mystical">
                    {t('daily.title')}
                  </h2>
                  <p className="text-cyan-200 mb-6 max-w-md">
                    {t('daily.desc')}
                  </p>
                  
                  {needsSignature ? (
                    <div className="text-center">
                      <div className="mb-6">
                        <div className="text-6xl mb-4">✍️</div>
                        <h3 className="text-2xl text-cyan-300 mb-4 font-mystical">
                          {t('status.signature')}
                        </h3>
                        <p className="text-cyan-200 mb-6 max-w-md mx-auto">
                          {t('status.signatureDesc')}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handleSignAndDraw}
                          disabled={isSigning}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-full hover:from-cyan-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/50 disabled:opacity-50"
                        >
                          {isSigning ? t('button.signing') : t('button.signAndDraw')}
                        </button>
                        
                        <button
                          onClick={() => setNeedsSignature(false)}
                          className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-full hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-300"
                        >
                          {t('button.cancel')}
                        </button>
                      </div>
                      
                      {signError && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg">
                          {t('status.signatureError')}: {signError.message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <p className="text-cyan-300 text-sm mb-2">
                          已抽取: {dailyCards.length} 张塔罗牌
                        </p>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((dailyCards.length / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        onClick={handleDrawCard}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50"
                      >
                        {t('button.drawCard')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isDrawing && (
            <div className="text-center">
              <div className="inline-block p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
                <div className="mb-6">
                  <div className="w-80 h-120 mx-auto flex items-center justify-center">
                    <div className="animate-spin text-6xl text-cyan-400">🔮</div>
                  </div>
                </div>
                
                <h2 className="text-2xl text-cyan-300 mb-4 font-mystical">
                  {t('status.drawing')}
                </h2>
                <p className="text-cyan-200">
                  {t('status.drawingDesc')}
                </p>
              </div>
            </div>
          )}

          {currentReading && (
            <div className="w-full max-w-7xl mx-auto">
              {isRevealed ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* 左侧：塔罗牌显示 */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="w-80 h-120 relative" style={{height:'38rem',width:'24rem'}}>
                      <TarotCard 
                        card={currentReading.card}
                        isReversed={currentReading.isReversed}
                        isRevealed={isRevealed}
                      />
                      
                      {/* 卡牌切换按钮 */}
                      {dailyCards.length > 1 && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button
                            onClick={switchToPreviousCard}
                            disabled={currentCardIndex === 0}
                            className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            ←
                          </button>
                          <button
                            onClick={switchToNextCard}
                            disabled={currentCardIndex === dailyCards.length - 1}
                            className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            →
                          </button>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* 右侧：卡牌解读 */}
                  <div className="space-y-6">
                    {/* 卡牌标题 */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                        <h3 className="text-3xl font-bold text-gold-300 font-mystical">
                          {currentReading.card.name} {currentReading.isReversed && t('card.reversed')}
                        </h3>
                        {/* 移除已提交状态显示
                          <span className="text-green-400 text-lg font-semibold">
                            ✅ 已提交
                          </span>
                        ) : dailyCards.length > 1 && (
                          <span className="text-gold-400 text-lg">
                            ({currentCardIndex + 1}/{dailyCards.length})
                          </span>
                        )} */}
                      </div>
                      <p className="text-gold-400 text-xl">{currentReading.card.nameEn}</p>
                    </div>

                    {/* 解读内容 */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold-500/30 p-6 space-y-6">
                      <div>
                        <h4 className="text-cyan-300 font-semibold mb-3 text-xl">{t('card.meaning')}</h4>
                        <p className="text-cyan-100 text-lg leading-relaxed mb-2">{currentReading.interpretation}</p>
                        <p className="text-cyan-200 text-base leading-relaxed opacity-80">{currentReading.interpretationEn}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-purple-300 font-semibold mb-3 text-xl">{t('card.fortune')}</h4>
                        <p className="text-purple-100 text-lg leading-relaxed mb-2">{currentReading.fortune}</p>
                        <p className="text-purple-200 text-base leading-relaxed opacity-80">{currentReading.fortuneEn}</p>
                      </div>
                    </div>

                    {/* 状态信息 */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-cyan-300">
                            已抽取: {dailyCards.length} 张
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-cyan-300">可提交</span>
                        </div>
                      </div>
                    </div>

                    {/* 卡牌列表 */}
                    {dailyCards.length > 1 ? (
                      /* 未提交状态：显示所有抽取的卡牌 */
                      <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6">
                        <h4 className="text-cyan-300 font-semibold mb-4 text-xl">抽取的卡牌</h4>
                        <div className="space-y-3">
                          {dailyCards.map((card, index) => (
                            <div 
                              key={index}
                              onClick={() => switchToCard(index)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                                index === currentCardIndex
                                  ? 'border-gold-500/50 bg-gold-500/10' 
                                  : 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-cyan-300 font-medium">
                                    {index + 1}. {card.card.name} {card.isReversed && '(逆位)'}
                                  </span>
                                  <p className="text-cyan-200 text-sm mt-1">
                                    {card.fortune.substring(0, 50)}...
                                  </p>
                                </div>
                                {index === currentCardIndex && (
                                  <span className="text-gold-400 text-sm">当前</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* 操作按钮 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {dailyCards.length > 0 && !submittedCards.has(currentCardIndex) ? (
                        <button
                          onClick={handleSubmitFortune}
                          disabled={isPending || isConfirming || isLoading}
                          className={`flex-1 px-8 py-4 font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-500/50`}
                        >
                          {isPending || isConfirming ? '交易确认中...' : isLoading ? '准备中...' : '提交运势 IRYS'}
                        </button>
                      ) : dailyCards.length > 0 && submittedCards.has(currentCardIndex) ? (
                        <div className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full text-center text-lg">
                          ✅ 已提交
                        </div>
                      ) : null}
                      
                      {dailyCards.length > 0 && (
                        <button
                          onClick={resetReading}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-full hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-300 text-lg"
                        >
                          {t('button.reset')}
                        </button>
                      )}
                    </div>


                    {/* 交易状态 */}
                    {/* {error && (
                      <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg">
                        {t('error.minting')}: {error.message}
                      </div>
                    )} */}
{/* 
                    {hash && (
                      <div className="p-4 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg">
                        <p><strong>{t('tx.hash')}:</strong> {hash}</p>
                        <p><strong>{t('tx.status')}:</strong> {isConfirming ? t('status.confirming') : isConfirmed ? t('status.confirmed') : t('status.pending')}</p>
                      </div>
                    )} */}

                    {showSuccessMessage && (
                      <div className="p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg">
                        <p className="text-lg font-semibold">✅ 您的塔罗牌铸造成功!</p>
                        <p className="mb-2">您的塔罗牌 NFT 已永久记录在IRYS区块链上</p>
                        {transactionHash && (
                          <p className="text-sm">
                            交易哈希: 
                            <a 
                              href={`https://testnet-explorer.irys.xyz/tx/${transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-300 hover:text-cyan-100 underline ml-1"
                            >
                              IRYS区块浏览器 | IRYS Hash View
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 抽卡动画状态 */
                <div className="flex justify-center">
                  <div className="w-80 h-120">
                    <TarotCard 
                      card={currentReading.card}
                      isReversed={currentReading.isReversed}
                      isRevealed={isRevealed}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
