'use client';

import React, { useEffect, useState } from 'react';

interface FallingElement {
  id: number;
  type: 'star' | 'irys' | 'moon' | 'chine' | 'anni' | 'zood' | 'xaitoshi';
  left: number;
  top: number;
  delay: number;
  duration: number;
  opacity: number;
  distance: number;
  color?: string; // 添加颜色属性
}

export function FallingElements() {
  const [elements, setElements] = useState<FallingElement[]>([]);

  // 与紫色背景形成良好对比的颜色数组
  const textColors = [
    '#00FFFF', // 青色 - 高对比度
    '#00FF00', // 绿色 - 高对比度
    '#FFFF00', // 黄色 - 高对比度
    '#FF6B6B', // 珊瑚红 - 中等对比度
    '#4ECDC4', // 青绿色 - 中等对比度
    '#45B7D1', // 天蓝色 - 中等对比度
    '#96CEB4', // 薄荷绿 - 中等对比度
    '#FFEAA7', // 浅黄色 - 中等对比度
    '#DDA0DD', // 梅花色 - 低对比度但和谐
    '#98D8C8', // 海绿色 - 低对比度但和谐
    '#F7DC6F', // 浅金色 - 中等对比度
    '#BB8FCE', // 浅紫色 - 低对比度但和谐
  ];

  const getRandomColor = () => {
    return textColors[Math.floor(Math.random() * textColors.length)];
  };

  // 字符链接映射
  const characterLinks = {
    'irys': 'https://x.com/irys_xyz',
    'chine': 'https://x.com/0xChine',
    'anni': 'https://x.com/annitoBtc',
    'zood': 'https://x.com/shuiya850067504',
    'xaitoshi': 'https://x.com/xaitoshi_',
  };

  const handleCharacterClick = (type: string) => {
    const link = characterLinks[type as keyof typeof characterLinks];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const generateElements = () => {
      const newElements: FallingElement[] = [];
      const baseTime = Date.now();
      let idCounter = 0;
      
      // 生成星星
      for (let i = 0; i < 24; i++) {
        newElements.push({
          id: baseTime + (idCounter++),
          type: 'star',
          left: Math.random() * 100, // 0-100% 从右上角开始
          top: -50 - Math.random() * 100, // 随机高度
          delay: Math.random() * 2, // 0-2秒延迟
          duration: 3 + Math.random() * 10, // 3-5秒持续时间
          opacity: 0.6 + Math.random() * 0.4, // 0.6-1.0透明度
          distance: 200 + Math.random() * 300, // 200-500px水平距离
        });
      }
      
       // 生成IRYS字符
       for (let i = 0; i < 12; i++) {
         newElements.push({
           id: baseTime + (idCounter++),
           type: 'irys',
           left: Math.random() * 100, // 0-100% 从右上角开始
           top: -50 - Math.random() * 100, // 随机高度
           delay: Math.random() * 5, // 0-5秒延迟（增加延迟）
           duration: 8 + Math.random() * 15, // 8-23秒持续时间（减慢速度）
           opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
           distance: 300 + Math.random() * 400, // 300-700px水平距离
         });
       }

        // 生成Chine字符
        for (let i = 0; i < 10; i++) {
          newElements.push({
            id: baseTime + (idCounter++),
            type: 'chine',
            left: Math.random() * 100, // 0-100% 从右上角开始
            top: -50 - Math.random() * 100, // 随机高度
            delay: Math.random() * 5, // 0-5秒延迟（增加延迟）
            duration: 8 + Math.random() * 15, // 8-23秒持续时间（减慢速度）
            opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
            distance: 300 + Math.random() * 400, // 300-700px水平距离
            color: getRandomColor(), // 随机颜色
          });
        }

        // 生成anni字符
        for (let i = 0; i < 10; i++) {
          newElements.push({
            id: baseTime + (idCounter++),
            type: 'anni',
            left: Math.random() * 100, // 0-100% 从右上角开始
            top: -50 - Math.random() * 100, // 随机高度
            delay: Math.random() * 5, // 0-5秒延迟（增加延迟）
            duration: 8 + Math.random() * 15, // 8-23秒持续时间（减慢速度）
            opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
            distance: 300 + Math.random() * 400, // 300-700px水平距离
            color: getRandomColor(), // 随机颜色
          });
        }

        // 生成Zood字符
        for (let i = 0; i < 10; i++) {
          newElements.push({
            id: baseTime + (idCounter++),
            type: 'zood',
            left: Math.random() * 100, // 0-100% 从右上角开始
            top: -50 - Math.random() * 100, // 随机高度
            delay: Math.random() * 5, // 0-5秒延迟（增加延迟）
            duration: 8 + Math.random() * 15, // 8-23秒持续时间（减慢速度）
            opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
            distance: 300 + Math.random() * 400, // 300-700px水平距离
            color: getRandomColor(), // 随机颜色
          });
        }

        // 生成Xaitoshi字符
        for (let i = 0; i < 10; i++) {
          newElements.push({
            id: baseTime + (idCounter++),
            type: 'xaitoshi',
            left: Math.random() * 100, // 0-100% 从右上角开始
            top: -50 - Math.random() * 100, // 随机高度
            delay: Math.random() * 5, // 0-5秒延迟（增加延迟）
            duration: 8 + Math.random() * 15, // 8-23秒持续时间（减慢速度）
            opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
            distance: 300 + Math.random() * 400, // 300-700px水平距离
            color: getRandomColor(), // 随机颜色
          });
        }
                
       
       // 生成月亮
       for (let i = 0; i < 6; i++) {
         newElements.push({
           id: baseTime + (idCounter++),
           type: 'moon',
           left: Math.random() * 100, // 0-100% 从右上角开始
           top: -50 - Math.random() * 100, // 随机高度
           delay: Math.random() * 4, // 0-4秒延迟
           duration: 6 + Math.random() * 12, // 6-18秒持续时间
           opacity: 0.5 + Math.random() * 0.3, // 0.5-0.8透明度
           distance: 400 + Math.random() * 500, // 400-900px水平距离
         });
       }
      
      setElements(newElements);
    };

    // 初始生成
    generateElements();
    
    // 每5秒重新生成新的元素
    // const interval = setInterval(generateElements, 15000);
    
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="falling-stars">
      {elements.map((element) => {
        if (element.type === 'star') {
          return (
            <div
              key={element.id}
              className="falling-star"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
              } as React.CSSProperties}
            >
              ✨
            </div>
          );
        } else if (element.type === 'irys') {
          return (
            <div
              key={element.id}
              className="falling-irys cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
                fontSize: '1.2rem', // 增大字体
                fontWeight: 'bold', // 加粗字体
              } as React.CSSProperties}
              onClick={() => handleCharacterClick('irys')}
              title="点击访问 IRYS Twitter"
            >
              IRYS
            </div>
          );
        } else if (element.type === 'chine') {
          return (
            <div
              key={element.id}
              className="falling-irys cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
                color: element.color || '#00FFFF', // 使用随机颜色，默认青色
                fontSize: '1.2rem', // 增大字体
                fontWeight: 'bold', // 加粗字体
              } as React.CSSProperties}
              onClick={() => handleCharacterClick('chine')}
              title="点击访问 Chine Twitter"
            >
              Chine
            </div>
          );
        } else if (element.type === 'anni') {
          return (
            <div
              key={element.id}
              className="falling-irys cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
                color: element.color || '#00FF00', // 使用随机颜色，默认绿色
                fontSize: '1.2rem', // 增大字体
                fontWeight: 'bold', // 加粗字体
              } as React.CSSProperties}
              onClick={() => handleCharacterClick('anni')}
              title="点击访问 anni Twitter"
            >
              anni
            </div>
          );
        } else if (element.type === 'zood') {
          return (
            <div
              key={element.id}
              className="falling-irys cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
                color: element.color || '#FFFF00', // 使用随机颜色，默认黄色
                fontSize: '1.2rem', // 增大字体
                fontWeight: 'bold', // 加粗字体
              } as React.CSSProperties}
              onClick={() => handleCharacterClick('zood')}
              title="点击访问 Zood Twitter"
            >
              Zood
            </div>
          );
        } else if (element.type === 'xaitoshi') {
          return (
            <div
              key={element.id}
              className="falling-irys cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
                color: element.color || '#FF6B6B', // 使用随机颜色，默认珊瑚红
                fontSize: '1.2rem', // 增大字体
                fontWeight: 'bold', // 加粗字体
              } as React.CSSProperties}
              onClick={() => handleCharacterClick('xaitoshi')}
              title="点击访问 Xaitoshi Twitter"
            >
              Xaitoshi
            </div>
          );
        } else {
          return (
            <div
              key={element.id}
              className="falling-moon"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
              } as React.CSSProperties}
            >
              🌙
            </div>
          );
        }
      })}
    </div>
  );
}
