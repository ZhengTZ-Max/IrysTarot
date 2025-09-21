/**
 * 塔罗牌系统 - 22张大阿尔卡纳
 */

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  upright: {
    keywords: string[];
    meaning: string;
  };
  reversed: {
    keywords: string[];
    meaning: string;
  };
  image: string;
}

export interface TarotReading {
  card: TarotCard;
  isReversed: boolean;
  interpretation: string;
  fortune: string;
  date: string;
  walletAddress: string;
}

// 22张大阿尔卡纳塔罗牌
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: "愚者",
    nameEn: "The Fool",
    upright: {
      keywords: ["新开始", "冒险", "纯真", "自由"],
      meaning: "代表新的开始和无限可能，保持开放的心态迎接新挑战。"
    },
    reversed: {
      keywords: ["鲁莽", "愚蠢", "缺乏计划"],
      meaning: "警告不要过于冲动，需要更谨慎地思考和规划。"
    },
    image: "/irys/愚人.png"
  },
  {
    id: 1,
    name: "魔术师",
    nameEn: "The Magician",
    upright: {
      keywords: ["技能", "意志力", "专注", "创造"],
      meaning: "拥有实现目标的能力和资源，专注于自己的意图。"
    },
    reversed: {
      keywords: ["操纵", "欺骗", "缺乏技能"],
      meaning: "可能存在欺骗或滥用权力，需要诚实面对自己。"
    },
    image: "/irys/魔术师.png"
  },
  {
    id: 2,
    name: "女祭司",
    nameEn: "The High Priestess",
    upright: {
      keywords: ["直觉", "神秘", "潜意识", "智慧"],
      meaning: "倾听内心的声音，相信直觉和潜意识的指引。"
    },
    reversed: {
      keywords: ["缺乏直觉", "秘密", "隐藏"],
      meaning: "可能忽视了内心的声音，或有隐藏的秘密待揭露。"
    },
    image: "/irys/女祭司.png"
  },
  {
    id: 3,
    name: "皇后",
    nameEn: "The Empress",
    upright: {
      keywords: ["丰饶", "母性", "创造力", "自然"],
      meaning: "象征丰收和创造力，关注家庭和情感的滋养。"
    },
    reversed: {
      keywords: ["依赖", "空虚", "缺乏成长"],
      meaning: "可能过度依赖他人，或感到创造力受阻。"
    },
    image: "/irys/女皇.png"
  },
  {
    id: 4,
    name: "皇帝",
    nameEn: "The Emperor",
    upright: {
      keywords: ["权威", "结构", "控制", "稳定"],
      meaning: "代表权威和秩序，需要建立稳固的基础和规则。"
    },
    reversed: {
      keywords: ["专制", "缺乏控制", "不稳定"],
      meaning: "可能过于控制或失去控制，需要平衡权力的使用。"
    },
    image: "/irys/皇帝.png"
  },
  {
    id: 5,
    name: "教皇",
    nameEn: "The Hierophant",
    upright: {
      keywords: ["传统", "精神指导", "学习", "信仰"],
      meaning: "寻求精神指导和传统智慧，重视学习和信仰。"
    },
    reversed: {
      keywords: ["反叛", "非传统", "个人信仰"],
      meaning: "挑战传统观念，寻找个人的精神道路。"
    },
    image: "/irys/教皇.png"
  },
  {
    id: 6,
    name: "恋人",
    nameEn: "The Lovers",
    upright: {
      keywords: ["爱情", "选择", "关系", "和谐"],
      meaning: "面临重要的选择，特别是关于爱情和人际关系。"
    },
    reversed: {
      keywords: ["分离", "错误选择", "不和谐"],
      meaning: "关系出现问题，或面临困难的选择。"
    },
    image: "/irys/恋人.png"
  },
  {
    id: 7,
    name: "战车",
    nameEn: "The Chariot",
    upright: {
      keywords: ["胜利", "意志力", "控制", "前进"],
      meaning: "通过意志力和决心克服障碍，取得胜利。"
    },
    reversed: {
      keywords: ["失控", "缺乏方向", "失败"],
      meaning: "可能失去控制或方向，需要重新调整策略。"
    },
    image: "/irys/战车.png"
  },
  {
    id: 8,
    name: "力量",
    nameEn: "Strength",
    upright: {
      keywords: ["内在力量", "勇气", "耐心", "同情"],
      meaning: "通过内在力量和温柔克服困难，展现真正的勇气。"
    },
    reversed: {
      keywords: ["软弱", "自我怀疑", "缺乏控制"],
      meaning: "可能感到软弱或自我怀疑，需要找回内在力量。"
    },
    image: "/irys/力量.png"
  },
  {
    id: 9,
    name: "隐者",
    nameEn: "The Hermit",
    upright: {
      keywords: ["内省", "寻找", "指导", "智慧"],
      meaning: "需要独处和内省，寻找内在的智慧和指导。"
    },
    reversed: {
      keywords: ["孤立", "拒绝帮助", "迷失"],
      meaning: "可能过于孤立或拒绝他人的帮助和指导。"
    },
    image: "/irys/隐士.png"
  },
  {
    id: 10,
    name: "命运之轮",
    nameEn: "Wheel of Fortune",
    upright: {
      keywords: ["变化", "命运", "机会", "循环"],
      meaning: "生活中的转折点，命运的变化带来新机会。"
    },
    reversed: {
      keywords: ["厄运", "缺乏控制", "停滞"],
      meaning: "可能遭遇挫折或感觉失去对生活的控制。"
    },
    image: "/irys/命运之轮.png"
  },
  {
    id: 11,
    name: "正义",
    nameEn: "Justice",
    upright: {
      keywords: ["公正", "平衡", "真理", "责任"],
      meaning: "寻求公正和平衡，为自己的行为承担责任。"
    },
    reversed: {
      keywords: ["不公", "偏见", "逃避责任"],
      meaning: "可能面临不公正或需要检视自己的偏见。"
    },
    image: "/irys/正义.png"
  },
  {
    id: 12,
    name: "倒吊人",
    nameEn: "The Hanged Man",
    upright: {
      keywords: ["牺牲", "等待", "新视角", "放手"],
      meaning: "通过暂停和等待获得新的视角和智慧。"
    },
    reversed: {
      keywords: ["延迟", "抗拒", "无意义牺牲"],
      meaning: "可能过度延迟或抗拒必要的改变。"
    },
    image: "/irys/倒吊人.png"
  },
  {
    id: 13,
    name: "死神",
    nameEn: "Death",
    upright: {
      keywords: ["转变", "结束", "重生", "释放"],
      meaning: "一个阶段的结束和新开始，释放过去拥抱未来。"
    },
    reversed: {
      keywords: ["抗拒变化", "停滞", "恐惧"],
      meaning: "抗拒必要的改变，因恐惧而停滞不前。"
    },
    image: "/irys/死神.png"
  },
  {
    id: 14,
    name: "节制",
    nameEn: "Temperance",
    upright: {
      keywords: ["平衡", "节制", "和谐", "治愈"],
      meaning: "寻求生活的平衡与和谐，通过节制获得治愈。"
    },
    reversed: {
      keywords: ["失衡", "过度", "不和谐"],
      meaning: "生活失去平衡，可能存在过度或极端行为。"
    },
    image: "/irys/节制.png"
  },
  {
    id: 15,
    name: "恶魔",
    nameEn: "The Devil",
    upright: {
      keywords: ["束缚", "诱惑", "物质", "依赖"],
      meaning: "被物质欲望或不良习惯所束缚，需要觉察和解脱。"
    },
    reversed: {
      keywords: ["解脱", "觉醒", "摆脱束缚"],
      meaning: "开始摆脱束缚，觉醒并寻求真正的自由。"
    },
    image: "/irys/恶魔.png"
  },
  {
    id: 16,
    name: "塔",
    nameEn: "The Tower",
    upright: {
      keywords: ["突变", "破坏", "启示", "解放"],
      meaning: "突然的变化打破现状，虽然震撼但带来解放。"
    },
    reversed: {
      keywords: ["避免灾难", "内在变化", "恐惧变化"],
      meaning: "可能避免了外在灾难，但内在仍需要变化。"
    },
    image: "/irys/高塔.png"
  },
  {
    id: 17,
    name: "星星",
    nameEn: "The Star",
    upright: {
      keywords: ["希望", "灵感", "治愈", "指引"],
      meaning: "黑暗后的希望之光，获得灵感和精神指引。"
    },
    reversed: {
      keywords: ["绝望", "缺乏信心", "失去希望"],
      meaning: "可能感到绝望或失去信心，需要重新点燃希望。"
    },
    image: "/irys/星星.png"
  },
  {
    id: 18,
    name: "月亮",
    nameEn: "The Moon",
    upright: {
      keywords: ["幻觉", "恐惧", "潜意识", "直觉"],
      meaning: "面对内心的恐惧和幻觉，相信直觉的指引。"
    },
    reversed: {
      keywords: ["真相揭露", "克服恐惧", "清晰"],
      meaning: "恐惧消散，真相逐渐清晰，获得内心平静。"
    },
    image: "/irys/月亮.png"
  },
  {
    id: 19,
    name: "太阳",
    nameEn: "The Sun",
    upright: {
      keywords: ["成功", "快乐", "活力", "成就"],
      meaning: "充满活力和快乐，取得成功和成就。"
    },
    reversed: {
      keywords: ["延迟成功", "缺乏活力", "过度自信"],
      meaning: "成功可能延迟，或需要调整过度的自信。"
    },
    image: "/irys/太阳.png"
  },
  {
    id: 20,
    name: "审判",
    nameEn: "Judgement",
    upright: {
      keywords: ["重生", "觉醒", "宽恕", "新开始"],
      meaning: "精神觉醒和重生，宽恕过去迎接新开始。"
    },
    reversed: {
      keywords: ["自我怀疑", "严厉批判", "拒绝改变"],
      meaning: "可能过于严厉地批判自己，拒绝必要的改变。"
    },
    image: "/irys/审判.png"
  },
  {
    id: 21,
    name: "世界",
    nameEn: "The World",
    upright: {
      keywords: ["完成", "成就", "满足", "整合"],
      meaning: "完成重要目标，获得满足感和成就感。"
    },
    reversed: {
      keywords: ["未完成", "缺乏成就", "寻求完整"],
      meaning: "目标尚未完成，仍在寻求完整和满足。"
    },
    image: "/irys/世界.png"
  }
];

/**
 * 根据日期、时间和钱包地址生成塔罗牌
 */
export function generateTarotCard(walletAddress: string): { card: TarotCard; isReversed: boolean } {
  const now = new Date();
  const dateString = now.toDateString();
  const timeString = now.getHours().toString() + now.getMinutes().toString() + now.getSeconds().toString();
  
  // 创建种子字符串
  const seedString = dateString + timeString + walletAddress;
  
  // 简单的哈希函数
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  // 确保为正数
  hash = Math.abs(hash);
  
  // 选择塔罗牌
  const cardIndex = hash % MAJOR_ARCANA.length;
  const card = MAJOR_ARCANA[cardIndex];
  
  // 决定是否为逆位（50%概率）
  const isReversed = (hash % 2) === 1;
  
  return { card, isReversed };
}

/**
 * 生成运势解读
 */
export function generateFortune(card: TarotCard, isReversed: boolean, walletAddress: string): string {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const timeOfDay = hour < 6 ? "凌晨" : hour < 12 ? "上午" : hour < 18 ? "下午" : "晚上";
  
  const cardData = isReversed ? card.reversed : card.upright;
  const keywords = cardData.keywords.slice(0, 2).join("、");
  
  // 创建更丰富的运势模板库
  const timePhrases = [
    `今日${timeOfDay}`,
    `在这个${timeOfDay}时分`,
    `当${timeOfDay}的阳光洒下`,
    `在${timeOfDay}的宁静中`,
    `随着${timeOfDay}的到来`
  ];
  
  const cardPhrases = [
    `${card.name}${isReversed ? "逆位" : "正位"}为您指引方向`,
    `${card.name}${isReversed ? "逆位" : "正位"}昭示着重要时刻`,
    `${card.name}${isReversed ? "逆位" : "正位"}带来深刻启示`,
    `${card.name}${isReversed ? "逆位" : "正位"}提醒您关注内心`,
    `${card.name}${isReversed ? "逆位" : "正位"}为您点亮前路`
  ];
  
  const energyPhrases = [
    `${keywords}的能量围绕着您`,
    `${keywords}的力量在您身边流动`,
    `${keywords}的智慧指引着您`,
    `${keywords}的启示正在显现`,
    `${keywords}的振动与您共鸣`
  ];
  
  const advicePhrases = [
    "建议保持开放的心态面对挑战",
    "相信直觉的指引，勇敢前行",
    "这是反思和行动并重的一天",
    "宜静心思考，为未来做好准备",
    "保持平衡，迎接新的机遇",
    "倾听内心的声音，做出明智选择",
    "专注于当下，珍惜每个瞬间",
    "释放过去的束缚，拥抱新的开始"
  ];
  
  const blessingPhrases = [
    "愿您今日充满智慧与力量",
    "愿好运与您同行",
    "愿您找到内心的平静",
    "愿您收获意想不到的惊喜",
    "愿您勇敢面对一切挑战",
    "愿您的心灵得到滋养",
    "愿您的前路充满光明",
    "愿您实现心中的愿望"
  ];
  
  // 使用钱包地址、时间戳和随机因子生成更复杂的随机性
  const addressHash = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeHash = (hour * 3600 + minute * 60 + second) % 1000;
  const randomSeed = (addressHash + timeHash + Date.now()) % 10000;
  
  // 选择不同的短语组合
  const timeIndex = randomSeed % timePhrases.length;
  const cardIndex = (randomSeed + 7) % cardPhrases.length;
  const energyIndex = (randomSeed + 13) % energyPhrases.length;
  const adviceIndex = (randomSeed + 19) % advicePhrases.length;
  const blessingIndex = (randomSeed + 23) % blessingPhrases.length;
  
  // 随机决定是否包含祝福语
  const includeBlessing = (randomSeed + 29) % 3 === 0;
  
  let fortune = `${timePhrases[timeIndex]}，${cardPhrases[cardIndex]}。${energyPhrases[energyIndex]}，${advicePhrases[adviceIndex]}。`;
  
  if (includeBlessing) {
    fortune += ` ${blessingPhrases[blessingIndex]}。`;
  }
  
  return fortune;
}

/**
 * 检查今日是否已抽取塔罗牌
 */
export function hasDrawnToday(walletAddress: string): boolean {
  if (typeof window === 'undefined') return false; // 服务器端渲染时返回false
  const today = new Date().toDateString();
  const key = `tarot_drawn_${walletAddress}_${today}`;
  return localStorage.getItem(key) === 'true';
}

/**
 * 标记今日已抽取塔罗牌
 */
export function markDrawnToday(walletAddress: string): void {
  if (typeof window === 'undefined') return; // 服务器端渲染时直接返回
  const today = new Date().toDateString();
  const key = `tarot_drawn_${walletAddress}_${today}`;
  localStorage.setItem(key, 'true');
}

/**
 * 生成NFT元数据
 */
export function generateTarotNFTMetadata(reading: TarotReading): object {
  return {
    name: `${reading.card.name}${reading.isReversed ? " (逆位)" : ""} - 每日塔罗`,
    description: `${reading.interpretation}\n\n运势解读：${reading.fortune}`,
    image: reading.card.image,
    attributes: [
      { trait_type: "卡牌", value: reading.card.name },
      { trait_type: "英文名", value: reading.card.nameEn },
      { trait_type: "方向", value: reading.isReversed ? "逆位" : "正位" },
      { trait_type: "日期", value: reading.date },
      { trait_type: "类型", value: "塔罗牌占卜" },
      { trait_type: "链", value: "IRYS Testnet" }
    ]
  };
}
