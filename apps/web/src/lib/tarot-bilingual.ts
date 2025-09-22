/**
 * 塔罗牌系统 - 22张大阿尔卡纳 (中英文双语版本)
 */

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  emoji: string;
  upright: {
    keywords: string[];
    keywordsEn: string[];
    meaning: string;
    meaningEn: string;
  };
  reversed: {
    keywords: string[];
    keywordsEn: string[];
    meaning: string;
    meaningEn: string;
  };
  image: string;
}

export interface TarotReading {
  card: TarotCard;
  isReversed: boolean;
  interpretation: string;
  interpretationEn: string;
  fortune: string;
  fortuneEn: string;
  meaning?: {
    zh: string;
    en: string;
  };
  keywords?: {
    zh: string[];
    en: string[];
  };
  date: string;
  walletAddress: string;
}

// 22张大阿尔卡纳塔罗牌
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: "愚者",
    nameEn: "The Fool",
    emoji: "🃏",
    upright: {
      keywords: ["新开始", "冒险", "纯真", "自由"],
      keywordsEn: ["New Beginnings", "Adventure", "Innocence", "Freedom"],
      meaning: "代表新的开始和无限可能，保持开放的心态迎接新挑战。",
      meaningEn: "Represents new beginnings and infinite possibilities, maintaining an open mind to embrace new challenges."
    },
    reversed: {
      keywords: ["鲁莽", "愚蠢", "缺乏计划"],
      keywordsEn: ["Recklessness", "Foolishness", "Lack of Planning"],
      meaning: "警告不要过于冲动，需要更谨慎地思考和规划。",
      meaningEn: "Warns against being too impulsive, requiring more careful thinking and planning."
    },
    image: "/irys/愚人.png"
  },
  {
    id: 1,
    name: "魔术师",
    nameEn: "The Magician",
    emoji: "🎩",
    upright: {
      keywords: ["技能", "意志力", "专注", "创造"],
      keywordsEn: ["Skill", "Willpower", "Focus", "Creation"],
      meaning: "拥有实现目标的能力和资源，专注于自己的意图。",
      meaningEn: "Possesses the ability and resources to achieve goals, focusing on one's intentions."
    },
    reversed: {
      keywords: ["操纵", "欺骗", "缺乏技能"],
      keywordsEn: ["Manipulation", "Deception", "Lack of Skill"],
      meaning: "可能存在欺骗或滥用权力，需要诚实面对自己。",
      meaningEn: "May involve deception or abuse of power, requiring honesty with oneself."
    },
    image: "/irys/魔术师.png"
  },
  {
    id: 2,
    name: "女祭司",
    nameEn: "The High Priestess",
    emoji: "🌙",
    upright: {
      keywords: ["直觉", "神秘", "潜意识", "智慧"],
      keywordsEn: ["Intuition", "Mystery", "Subconscious", "Wisdom"],
      meaning: "倾听内心的声音，相信直觉的指引，探索内在的智慧。",
      meaningEn: "Listen to your inner voice, trust intuitive guidance, and explore inner wisdom."
    },
    reversed: {
      keywords: ["缺乏直觉", "秘密", "内在冲突"],
      keywordsEn: ["Lack of Intuition", "Secrets", "Inner Conflict"],
      meaning: "可能忽视了内在的声音，需要重新连接自己的直觉。",
      meaningEn: "May have ignored inner voice, need to reconnect with intuition."
    },
    image: "/irys/女祭司.png"
  },
  {
    id: 3,
    name: "女皇",
    nameEn: "The Empress",
    emoji: "👑",
    upright: {
      keywords: ["丰盛", "母性", "创造力", "自然"],
      keywordsEn: ["Abundance", "Motherhood", "Creativity", "Nature"],
      meaning: "代表丰盛和创造力，享受生活的美好，孕育新的可能性。",
      meaningEn: "Represents abundance and creativity, enjoying life's beauty, nurturing new possibilities."
    },
    reversed: {
      keywords: ["依赖", "缺乏创造力", "过度保护"],
      keywordsEn: ["Dependency", "Lack of Creativity", "Overprotection"],
      meaning: "可能过于依赖他人或缺乏创造力，需要重新找到平衡。",
      meaningEn: "May be overly dependent or lack creativity, need to find balance again."
    },
    image: "/irys/女皇.png"
  },
  {
    id: 4,
    name: "皇帝",
    nameEn: "The Emperor",
    emoji: "🏛️",
    upright: {
      keywords: ["权威", "秩序", "领导力", "稳定"],
      keywordsEn: ["Authority", "Order", "Leadership", "Stability"],
      meaning: "展现领导力和权威，建立秩序和结构，承担责任。",
      meaningEn: "Demonstrate leadership and authority, establish order and structure, take responsibility."
    },
    reversed: {
      keywords: ["专制", "缺乏权威", "混乱"],
      keywordsEn: ["Tyranny", "Lack of Authority", "Chaos"],
      meaning: "可能过于专制或缺乏有效的领导，需要调整管理方式。",
      meaningEn: "May be too tyrannical or lack effective leadership, need to adjust management style."
    },
    image: "/irys/皇帝.png"
  },
  {
    id: 5,
    name: "教皇",
    nameEn: "The Hierophant",
    emoji: "⛪",
    upright: {
      keywords: ["传统", "精神指导", "学习", "仪式"],
      keywordsEn: ["Tradition", "Spiritual Guidance", "Learning", "Ritual"],
      meaning: "寻求精神指导，学习传统智慧，参与有意义的仪式。",
      meaningEn: "Seek spiritual guidance, learn traditional wisdom, participate in meaningful rituals."
    },
    reversed: {
      keywords: ["反叛", "非传统", "个人信仰"],
      keywordsEn: ["Rebellion", "Non-traditional", "Personal Belief"],
      meaning: "可能挑战传统观念，寻求个人独特的信仰道路。",
      meaningEn: "May challenge traditional beliefs, seek personal unique spiritual path."
    },
    image: "/irys/教皇.png"
  },
  {
    id: 6,
    name: "恋人",
    nameEn: "The Lovers",
    emoji: "💕",
    upright: {
      keywords: ["爱情", "选择", "和谐", "结合"],
      keywordsEn: ["Love", "Choice", "Harmony", "Union"],
      meaning: "面临重要的选择，特别是关于爱情和关系，追求真正的和谐。",
      meaningEn: "Face important choices, especially about love and relationships, pursue true harmony."
    },
    reversed: {
      keywords: ["不和谐", "错误选择", "分离"],
      keywordsEn: ["Disharmony", "Wrong Choice", "Separation"],
      meaning: "可能面临关系中的不和谐或需要重新评估选择。",
      meaningEn: "May face disharmony in relationships or need to reassess choices."
    },
    image: "/irys/恋人.png"
  },
  {
    id: 7,
    name: "战车",
    nameEn: "The Chariot",
    emoji: "🏺",
    upright: {
      keywords: ["决心", "胜利", "意志力", "控制"],
      keywordsEn: ["Determination", "Victory", "Willpower", "Control"],
      meaning: "通过坚定的决心和意志力克服障碍，取得胜利。",
      meaningEn: "Overcome obstacles through firm determination and willpower, achieve victory."
    },
    reversed: {
      keywords: ["缺乏控制", "失败", "缺乏方向"],
      keywordsEn: ["Lack of Control", "Failure", "Lack of Direction"],
      meaning: "可能缺乏控制或方向，需要重新找到内在的平衡。",
      meaningEn: "May lack control or direction, need to find inner balance again."
    },
    image: "/irys/战车.png"
  },
  {
    id: 8,
    name: "力量",
    nameEn: "Strength",
    emoji: "💪",
    upright: {
      keywords: ["内在力量", "勇气", "耐心", "温柔"],
      keywordsEn: ["Inner Strength", "Courage", "Patience", "Gentleness"],
      meaning: "通过内在的力量和温柔的方式克服挑战，展现真正的勇气。",
      meaningEn: "Overcome challenges through inner strength and gentle approach, show true courage."
    },
    reversed: {
      keywords: ["内在软弱", "恐惧", "缺乏自信"],
      keywordsEn: ["Inner Weakness", "Fear", "Lack of Confidence"],
      meaning: "可能感到内在的软弱或恐惧，需要重新建立自信。",
      meaningEn: "May feel inner weakness or fear, need to rebuild confidence."
    },
    image: "/irys/力量.png"
  },
  {
    id: 9,
    name: "隐士",
    nameEn: "The Hermit",
    emoji: "🔦",
    upright: {
      keywords: ["内省", "智慧", "指导", "孤独"],
      keywordsEn: ["Introspection", "Wisdom", "Guidance", "Solitude"],
      meaning: "通过内省和独处寻找内在的智慧，成为他人的指导者。",
      meaningEn: "Find inner wisdom through introspection and solitude, become a guide for others."
    },
    reversed: {
      keywords: ["孤立", "缺乏指导", "迷失"],
      keywordsEn: ["Isolation", "Lack of Guidance", "Lost"],
      meaning: "可能感到孤立或迷失，需要寻求外界的帮助和指导。",
      meaningEn: "May feel isolated or lost, need to seek external help and guidance."
    },
    image: "/irys/隐士.png"
  },
  {
    id: 10,
    name: "命运之轮",
    nameEn: "Wheel of Fortune",
    emoji: "🎡",
    upright: {
      keywords: ["变化", "命运", "周期", "机遇"],
      keywordsEn: ["Change", "Destiny", "Cycle", "Opportunity"],
      meaning: "命运之轮转动，带来变化和新的机遇，接受生活的起伏。",
      meaningEn: "The wheel of fortune turns, bringing change and new opportunities, accept life's ups and downs."
    },
    reversed: {
      keywords: ["坏运气", "抗拒变化", "停滞"],
      keywordsEn: ["Bad Luck", "Resistance to Change", "Stagnation"],
      meaning: "可能遇到坏运气或抗拒必要的变化，需要适应和调整。",
      meaningEn: "May encounter bad luck or resist necessary changes, need to adapt and adjust."
    },
    image: "/irys/命运之轮.png"
  },
  {
    id: 11,
    name: "正义",
    nameEn: "Justice",
    emoji: "⚖️",
    upright: {
      keywords: ["公正", "平衡", "真理", "责任"],
      keywordsEn: ["Fairness", "Balance", "Truth", "Responsibility"],
      meaning: "追求公正和平衡，承担应有的责任，坚持真理。",
      meaningEn: "Pursue fairness and balance, take due responsibility, uphold truth."
    },
    reversed: {
      keywords: ["不公正", "不平衡", "偏见"],
      keywordsEn: ["Injustice", "Imbalance", "Bias"],
      meaning: "可能面临不公正的情况或需要重新审视自己的偏见。",
      meaningEn: "May face injustice or need to re-examine one's biases."
    },
    image: "/irys/正义.png"
  },
  {
    id: 12,
    name: "倒吊人",
    nameEn: "The Hanged Man",
    emoji: "🔄",
    upright: {
      keywords: ["牺牲", "等待", "新视角", "接受"],
      keywordsEn: ["Sacrifice", "Waiting", "New Perspective", "Acceptance"],
      meaning: "通过牺牲和等待获得新的视角，学会接受和放下。",
      meaningEn: "Gain new perspective through sacrifice and waiting, learn to accept and let go."
    },
    reversed: {
      keywords: ["抗拒", "拖延", "固执"],
      keywordsEn: ["Resistance", "Procrastination", "Stubbornness"],
      meaning: "可能抗拒必要的牺牲或拖延重要的决定，需要改变态度。",
      meaningEn: "May resist necessary sacrifices or delay important decisions, need to change attitude."
    },
    image: "/irys/倒吊人.png"
  },
  {
    id: 13,
    name: "死神",
    nameEn: "Death",
    emoji: "💀",
    upright: {
      keywords: ["结束", "转变", "重生", "释放"],
      keywordsEn: ["End", "Transformation", "Rebirth", "Release"],
      meaning: "代表结束和转变，放下过去，迎接新的开始和重生。",
      meaningEn: "Represents endings and transformation, let go of the past, welcome new beginnings and rebirth."
    },
    reversed: {
      keywords: ["抗拒变化", "停滞", "恐惧"],
      keywordsEn: ["Resistance to Change", "Stagnation", "Fear"],
      meaning: "可能抗拒必要的变化或感到恐惧，需要勇敢面对转变。",
      meaningEn: "May resist necessary changes or feel fear, need to bravely face transformation."
    },
    image: "/irys/死神.png"
  },
  {
    id: 14,
    name: "节制",
    nameEn: "Temperance",
    emoji: "🍷",
    upright: {
      keywords: ["平衡", "调和", "耐心", "和谐"],
      keywordsEn: ["Balance", "Harmony", "Patience", "Moderation"],
      meaning: "寻求内在的平衡和和谐，通过耐心和节制达到目标。",
      meaningEn: "Seek inner balance and harmony, achieve goals through patience and moderation."
    },
    reversed: {
      keywords: ["不平衡", "极端", "缺乏耐心"],
      keywordsEn: ["Imbalance", "Extremes", "Lack of Patience"],
      meaning: "可能失去平衡或走向极端，需要重新找到中间道路。",
      meaningEn: "May lose balance or go to extremes, need to find the middle path again."
    },
    image: "/irys/节制.png"
  },
  {
    id: 15,
    name: "恶魔",
    nameEn: "The Devil",
    emoji: "😈",
    upright: {
      keywords: ["束缚", "诱惑", "物质主义", "依赖"],
      keywordsEn: ["Bondage", "Temptation", "Materialism", "Dependency"],
      meaning: "可能被物质欲望或不良习惯束缚，需要识别和打破这些枷锁。",
      meaningEn: "May be bound by material desires or bad habits, need to identify and break these chains."
    },
    reversed: {
      keywords: ["解放", "自由", "觉醒"],
      keywordsEn: ["Liberation", "Freedom", "Awakening"],
      meaning: "开始意识到束缚并寻求解放，走向自由和觉醒。",
      meaningEn: "Begin to recognize bondage and seek liberation, move toward freedom and awakening."
    },
    image: "/irys/恶魔.png"
  },
  {
    id: 16,
    name: "高塔",
    nameEn: "The Tower",
    emoji: "🗼",
    upright: {
      keywords: ["突然变化", "启示", "解放", "重建"],
      keywordsEn: ["Sudden Change", "Revelation", "Liberation", "Rebuilding"],
      meaning: "突然的变化带来启示和解放，虽然痛苦但为重建铺平道路。",
      meaningEn: "Sudden changes bring revelation and liberation, painful but pave the way for rebuilding."
    },
    reversed: {
      keywords: ["抗拒变化", "恐惧", "僵化"],
      keywordsEn: ["Resistance to Change", "Fear", "Rigidity"],
      meaning: "可能抗拒必要的变化或感到恐惧，需要勇敢面对现实。",
      meaningEn: "May resist necessary changes or feel fear, need to bravely face reality."
    },
    image: "/irys/高塔.png"
  },
  {
    id: 17,
    name: "星星",
    nameEn: "The Star",
    emoji: "⭐",
    upright: {
      keywords: ["希望", "灵感", "精神指引", "治愈"],
      keywordsEn: ["Hope", "Inspiration", "Spiritual Guidance", "Healing"],
      meaning: "在黑暗中看到希望，获得精神指引和治愈，相信美好的未来。",
      meaningEn: "See hope in darkness, receive spiritual guidance and healing, believe in a bright future."
    },
    reversed: {
      keywords: ["绝望", "失去希望", "缺乏灵感"],
      keywordsEn: ["Despair", "Loss of Hope", "Lack of Inspiration"],
      meaning: "可能感到绝望或失去希望，需要重新寻找内在的光明。",
      meaningEn: "May feel despair or lose hope, need to find inner light again."
    },
    image: "/irys/星星.png"
  },
  {
    id: 18,
    name: "月亮",
    nameEn: "The Moon",
    emoji: "🌙",
    upright: {
      keywords: ["幻觉", "潜意识", "恐惧", "直觉"],
      keywordsEn: ["Illusion", "Subconscious", "Fear", "Intuition"],
      meaning: "面对潜意识的恐惧和幻觉，通过直觉和内在智慧找到真相。",
      meaningEn: "Face subconscious fears and illusions, find truth through intuition and inner wisdom."
    },
    reversed: {
      keywords: ["欺骗", "困惑", "恐惧"],
      keywordsEn: ["Deception", "Confusion", "Fear"],
      meaning: "可能被欺骗或感到困惑，需要更加谨慎和清醒。",
      meaningEn: "May be deceived or feel confused, need to be more cautious and alert."
    },
    image: "/irys/月亮.png"
  },
  {
    id: 19,
    name: "太阳",
    nameEn: "The Sun",
    emoji: "☀️",
    upright: {
      keywords: ["成功", "快乐", "活力", "成就"],
      keywordsEn: ["Success", "Joy", "Vitality", "Achievement"],
      meaning: "享受成功和快乐，充满活力和正能量，实现重要的成就。",
      meaningEn: "Enjoy success and joy, full of vitality and positive energy, achieve important accomplishments."
    },
    reversed: {
      keywords: ["过度自信", "骄傲", "缺乏活力"],
      keywordsEn: ["Overconfidence", "Pride", "Lack of Vitality"],
      meaning: "可能过于自信或骄傲，需要保持谦逊和平衡。",
      meaningEn: "May be overconfident or proud, need to maintain humility and balance."
    },
    image: "/irys/太阳.png"
  },
  {
    id: 20,
    name: "审判",
    nameEn: "Judgement",
    emoji: "📯",
    upright: {
      keywords: ["重生", "觉醒", "宽恕", "救赎"],
      keywordsEn: ["Rebirth", "Awakening", "Forgiveness", "Redemption"],
      meaning: "经历重生和觉醒，学会宽恕和救赎，迎接新的开始。",
      meaningEn: "Experience rebirth and awakening, learn forgiveness and redemption, welcome new beginnings."
    },
    reversed: {
      keywords: ["缺乏自我反省", "抗拒改变", "内疚"],
      keywordsEn: ["Lack of Self-Reflection", "Resistance to Change", "Guilt"],
      meaning: "可能缺乏自我反省或抗拒必要的改变，需要面对内心的声音。",
      meaningEn: "May lack self-reflection or resist necessary changes, need to face inner voice."
    },
    image: "/irys/审判.png"
  },
  {
    id: 21,
    name: "世界",
    nameEn: "The World",
    emoji: "🌍",
    upright: {
      keywords: ["完成", "成就", "旅行", "圆满"],
      keywordsEn: ["Completion", "Achievement", "Travel", "Fulfillment"],
      meaning: "达到重要的成就和完成，享受圆满和满足，准备新的旅程。",
      meaningEn: "Achieve important accomplishments and completion, enjoy fulfillment and satisfaction, prepare for new journeys."
    },
    reversed: {
      keywords: ["未完成", "缺乏成就感", "停滞"],
      keywordsEn: ["Incomplete", "Lack of Achievement", "Stagnation"],
      meaning: "可能感到未完成或缺乏成就感，需要重新审视目标和方向。",
      meaningEn: "May feel incomplete or lack achievement, need to reassess goals and direction."
    },
    image: "/irys/世界.png"
  }
];

// 生成塔罗牌解读
export function generateTarotReading(card: TarotCard, isReversed: boolean, walletAddress: string): TarotReading {
  const now = new Date();
  const date = now.toLocaleDateString('zh-CN');
  
  const interpretation = isReversed ? card.reversed.meaning : card.upright.meaning;
  const interpretationEn = isReversed ? card.reversed.meaningEn : card.upright.meaningEn;
  
  // 生成今日运势
  const fortune = generateFortune(card, isReversed);
  const fortuneEn = generateFortuneEn(card, isReversed);
  
  return {
    card,
    isReversed,
    interpretation,
    interpretationEn,
    fortune,
    fortuneEn,
    date,
    walletAddress
  };
}

// 生成今日运势 (中文)
function generateFortune(card: TarotCard, isReversed: boolean): string {
  const fortunes = {
    upright: {
      0: "今日适合开启新的项目或计划，保持开放的心态迎接机遇。",
      1: "你的技能和意志力将帮助你实现目标，专注于你的意图。",
      2: "相信你的直觉，倾听内心的声音，它将指引你正确的方向。",
      3: "享受生活的丰盛，发挥你的创造力，孕育新的可能性。",
      4: "展现你的领导力，建立秩序和结构，承担应有的责任。",
      5: "寻求精神指导，学习传统智慧，参与有意义的仪式。",
      6: "面临重要的选择，特别是关于爱情和关系，追求真正的和谐。",
      7: "通过坚定的决心和意志力克服障碍，取得胜利。",
      8: "通过内在的力量和温柔的方式克服挑战，展现真正的勇气。",
      9: "通过内省和独处寻找内在的智慧，成为他人的指导者。",
      10: "命运之轮转动，带来变化和新的机遇，接受生活的起伏。",
      11: "追求公正和平衡，承担应有的责任，坚持真理。",
      12: "通过牺牲和等待获得新的视角，学会接受和放下。",
      13: "结束和转变的时刻，放下过去，迎接新的开始和重生。",
      14: "寻求内在的平衡和和谐，通过耐心和节制达到目标。",
      15: "识别和打破束缚你的枷锁，摆脱物质欲望的诱惑。",
      16: "突然的变化带来启示和解放，虽然痛苦但为重建铺平道路。",
      17: "在黑暗中看到希望，获得精神指引和治愈，相信美好的未来。",
      18: "面对潜意识的恐惧和幻觉，通过直觉和内在智慧找到真相。",
      19: "享受成功和快乐，充满活力和正能量，实现重要的成就。",
      20: "经历重生和觉醒，学会宽恕和救赎，迎接新的开始。",
      21: "达到重要的成就和完成，享受圆满和满足，准备新的旅程。"
    },
    reversed: {
      0: "今日需要更加谨慎，避免冲动行事，做好充分的准备。",
      1: "可能存在欺骗或滥用权力，需要诚实面对自己。",
      2: "可能忽视了内在的声音，需要重新连接自己的直觉。",
      3: "可能过于依赖他人或缺乏创造力，需要重新找到平衡。",
      4: "可能过于专制或缺乏有效的领导，需要调整管理方式。",
      5: "可能挑战传统观念，寻求个人独特的信仰道路。",
      6: "可能面临关系中的不和谐或需要重新评估选择。",
      7: "可能缺乏控制或方向，需要重新找到内在的平衡。",
      8: "可能感到内在的软弱或恐惧，需要重新建立自信。",
      9: "可能感到孤立或迷失，需要寻求外界的帮助和指导。",
      10: "可能遇到坏运气或抗拒必要的变化，需要适应和调整。",
      11: "可能面临不公正的情况或需要重新审视自己的偏见。",
      12: "可能抗拒必要的牺牲或拖延重要的决定，需要改变态度。",
      13: "可能抗拒必要的变化或感到恐惧，需要勇敢面对转变。",
      14: "可能失去平衡或走向极端，需要重新找到中间道路。",
      15: "开始意识到束缚并寻求解放，走向自由和觉醒。",
      16: "可能抗拒必要的变化或感到恐惧，需要勇敢面对现实。",
      17: "可能感到绝望或失去希望，需要重新寻找内在的光明。",
      18: "可能被欺骗或感到困惑，需要更加谨慎和清醒。",
      19: "可能过于自信或骄傲，需要保持谦逊和平衡。",
      20: "可能缺乏自我反省或抗拒必要的改变，需要面对内心的声音。",
      21: "可能感到未完成或缺乏成就感，需要重新审视目标和方向。"
    }
  };
  
  return fortunes[isReversed ? 'reversed' : 'upright'][card.id as keyof typeof fortunes.upright] || "今日运势需要你仔细思考。";
}

// 生成今日运势 (英文)
function generateFortuneEn(card: TarotCard, isReversed: boolean): string {
  const fortunes = {
    upright: {
      0: "Today is perfect for starting new projects or plans, maintain an open mind to embrace opportunities.",
      1: "Your skills and willpower will help you achieve your goals, focus on your intentions.",
      2: "Trust your intuition, listen to your inner voice, it will guide you in the right direction.",
      3: "Enjoy life's abundance, unleash your creativity, nurture new possibilities.",
      4: "Demonstrate your leadership, establish order and structure, take due responsibility.",
      5: "Seek spiritual guidance, learn traditional wisdom, participate in meaningful rituals.",
      6: "Face important choices, especially about love and relationships, pursue true harmony.",
      7: "Overcome obstacles through firm determination and willpower, achieve victory.",
      8: "Overcome challenges through inner strength and gentle approach, show true courage.",
      9: "Find inner wisdom through introspection and solitude, become a guide for others.",
      10: "The wheel of fortune turns, bringing change and new opportunities, accept life's ups and downs.",
      11: "Pursue fairness and balance, take due responsibility, uphold truth.",
      12: "Gain new perspective through sacrifice and waiting, learn to accept and let go.",
      13: "Time for endings and transformation, let go of the past, welcome new beginnings and rebirth.",
      14: "Seek inner balance and harmony, achieve goals through patience and moderation.",
      15: "Identify and break the chains that bind you, resist material temptations.",
      16: "Sudden changes bring revelation and liberation, painful but pave the way for rebuilding.",
      17: "See hope in darkness, receive spiritual guidance and healing, believe in a bright future.",
      18: "Face subconscious fears and illusions, find truth through intuition and inner wisdom.",
      19: "Enjoy success and joy, full of vitality and positive energy, achieve important accomplishments.",
      20: "Experience rebirth and awakening, learn forgiveness and redemption, welcome new beginnings.",
      21: "Achieve important accomplishments and completion, enjoy fulfillment and satisfaction, prepare for new journeys."
    },
    reversed: {
      0: "Today requires more caution, avoid impulsive actions, make adequate preparations.",
      1: "May involve deception or abuse of power, need to be honest with yourself.",
      2: "May have ignored inner voice, need to reconnect with intuition.",
      3: "May be overly dependent or lack creativity, need to find balance again.",
      4: "May be too tyrannical or lack effective leadership, need to adjust management style.",
      5: "May challenge traditional beliefs, seek personal unique spiritual path.",
      6: "May face disharmony in relationships or need to reassess choices.",
      7: "May lack control or direction, need to find inner balance again.",
      8: "May feel inner weakness or fear, need to rebuild confidence.",
      9: "May feel isolated or lost, need to seek external help and guidance.",
      10: "May encounter bad luck or resist necessary changes, need to adapt and adjust.",
      11: "May face injustice or need to re-examine one's biases.",
      12: "May resist necessary sacrifices or delay important decisions, need to change attitude.",
      13: "May resist necessary changes or feel fear, need to bravely face transformation.",
      14: "May lose balance or go to extremes, need to find the middle path again.",
      15: "Begin to recognize bondage and seek liberation, move toward freedom and awakening.",
      16: "May resist necessary changes or feel fear, need to bravely face reality.",
      17: "May feel despair or lose hope, need to find inner light again.",
      18: "May be deceived or feel confused, need to be more cautious and alert.",
      19: "May be overconfident or proud, need to maintain humility and balance.",
      20: "May lack self-reflection or resist necessary changes, need to face inner voice.",
      21: "May feel incomplete or lack achievement, need to reassess goals and direction."
    }
  };
  
  return fortunes[isReversed ? 'reversed' : 'upright'][card.id as keyof typeof fortunes.upright] || "Today's fortune requires careful consideration.";
}

// 检查今日是否已抽取
export function hasDrawnToday(walletAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const today = new Date().toDateString();
  const key = `tarot_drawn_${walletAddress}_${today}`;
  return localStorage.getItem(key) === 'true';
}

// 标记今日已抽取
export function markDrawnToday(walletAddress: string): void {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toDateString();
  const key = `tarot_drawn_${walletAddress}_${today}`;
  localStorage.setItem(key, 'true');
}

// 生成塔罗牌NFT元数据
export function generateTarotNFTMetadata(reading: TarotReading) {
  return {
    name: `${reading.card.name} - ${reading.card.nameEn}`,
    description: `塔罗牌占卜结果 / Tarot Reading Result\n\n卡牌含义 / Card Meaning:\n${reading.interpretation}\n\n${reading.interpretationEn}\n\n今日运势 / Today's Fortune:\n${reading.fortune}\n\n${reading.fortuneEn}`,
    image: `https://your-domain.com${reading.card.image}`,
    attributes: [
      {
        trait_type: "Card Name (Chinese)",
        value: reading.card.name
      },
      {
        trait_type: "Card Name (English)",
        value: reading.card.nameEn
      },
      {
        trait_type: "Position",
        value: reading.isReversed ? "Reversed" : "Upright"
      },
      {
        trait_type: "Keywords",
        value: reading.isReversed ? reading.card.reversed.keywords.join(", ") : reading.card.upright.keywords.join(", ")
      },
      {
        trait_type: "Keywords (English)",
        value: reading.isReversed ? reading.card.reversed.keywordsEn.join(", ") : reading.card.upright.keywordsEn.join(", ")
      },
      {
        trait_type: "Date",
        value: reading.date
      },
      {
        trait_type: "Wallet Address",
        value: reading.walletAddress
      }
    ]
  };
}

// 生成塔罗牌Token URI
export function generateTarotTokenURI(metadata: object): string {
  return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
}

// 导出塔罗牌数组的别名
export const TAROT_CARDS = MAJOR_ARCANA;