'use client';

import React, { useEffect, useState } from 'react';

interface FallingElement {
  id: number;
  type: 'star' | 'irys' | 'moon';
  left: number;
  top: number;
  delay: number;
  duration: number;
  opacity: number;
  distance: number;
}

export function FallingElements() {
  const [elements, setElements] = useState<FallingElement[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements: FallingElement[] = [];
      
      // 生成星星
      for (let i = 0; i < 24; i++) {
        newElements.push({
          id: Date.now() + i,
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
       for (let i = 0; i < 18; i++) {
         newElements.push({
           id: Date.now() + 100 + i,
           type: 'irys',
           left: Math.random() * 100, // 0-100% 从右上角开始
           top: -50 - Math.random() * 100, // 随机高度
           delay: Math.random() * 3, // 0-3秒延迟
           duration: 4 + Math.random() * 10, // 4-6秒持续时间
           opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
           distance: 300 + Math.random() * 400, // 300-700px水平距离
         });
       }
       
       // 生成月亮
       for (let i = 0; i < 6; i++) {
         newElements.push({
           id: Date.now() + 200 + i,
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
              className="falling-irys"
              style={{
                '--element-left': `${element.left}%`,
                '--element-top': `${element.top}px`,
                '--element-delay': `${element.delay}s`,
                '--element-duration': `${element.duration}s`,
                '--element-opacity': element.opacity,
                '--element-distance': `-${element.distance}px`,
              } as React.CSSProperties}
            >
              IRYS
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
