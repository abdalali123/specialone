// Experience Configuration
export interface ExperienceConfig {
  name: string;
  language: 'en' | 'ar' | 'ru';
  birthdayDate: string;
  images: string[];
  timings: {
    phase0: number;
    cut: number;
    btnDelay: number;
    phaseTransition: number;
  };
  audio: {
    celebration: string;
    ambient: string;
    heartbeat: string;
  };
  enableGyro: boolean;
}

export const defaultConfig: ExperienceConfig = {
  name: "You",
  language: "en",
  birthdayDate: new Date().toISOString(),
  images: ["/images/memory-1.jpg", "/images/memory-2.jpg"],
  timings: {
    phase0: 6000,
    cut: 1500,
    btnDelay: 3000,
    phaseTransition: 2000,
  },
  audio: {
    celebration: "/audio/celebration.mp3",
    ambient: "/audio/ambient.mp3",
    heartbeat: "/audio/heartbeat.mp3",
  },
  enableGyro: true,
};

// Language texts - Trilingual support
export const langTexts = {
  en: {
    // Phase 0 - Chaos
    chaos1: "HAPPY BIRTHDAY!",
    chaos2: "🎉 CELEBRATE! 🎊",
    stayHint: "Stay. It changes.",
    
    // Phase 1 - Core Question
    coreQuestion: "But do you actually feel celebrated?",
    choice1: "Yes, I do",
    choice2: "Not really",
    reassurance: "There's no right answer here.",
    exitText: "I didn't ask you to do all this",
    
    // Phase 2 - Emotional Path (Yes branch)
    mirror1Yes: "Good. Hold onto that.",
    mirror2Yes: "Not everyone gets to feel that way.",
    
    // Phase 2 - Emotional Path (No branch)
    mirror1No: "That's honest.",
    mirror2No: "Celebration is strange. It asks us to perform joy.",
    
    // Phase 3 - Time Awareness
    timeAwareness: "It's {time}. You're here, {name}.",
    time1: "This moment won't repeat.",
    time2: "Every choice you made led here.",
    time3: "Including staying.",
    
    // Phase 4 - Childhood
    childhood1: "When you were young, birthdays felt infinite.",
    childhood2: "Now you count them differently.",
    
    // Phase 5 - Reinterpret
    reinterpret: "But maybe that's the gift—knowing they're numbered.",
    
    // Phase 6 - Author Presence
    author1: "Someone thought about you today.",
    author2: "Took time to build this.",
    author3: "Not because they had to.",
    
    // Phase 7 - Final
    final1: "Happy Birthday,",
    final2: "{name}.",
    aftertaste: "The rest is yours.",
    
    // UI
    tapToContinue: "tap to begin",
    loading: "...",
  },
  ar: {
    // Phase 0 - Chaos
    chaos1: "!عيد ميلاد سعيد",
    chaos2: "🎉 احتفل! 🎊",
    stayHint: ".ابقَ. سيتغير",
    
    // Phase 1 - Core Question
    coreQuestion: "لكن هل تشعر فعلاً بالاحتفاء بك؟",
    choice1: "نعم، أشعر",
    choice2: "ليس حقاً",
    reassurance: ".لا توجد إجابة صحيحة هنا",
    exitText: "لم أطلب منك فعل كل هذا",
    
    // Phase 2 - Emotional Path (Yes branch)
    mirror1Yes: ".جيد. تمسّك بذلك",
    mirror2Yes: ".ليس الجميع يشعرون هكذا",
    
    // Phase 2 - Emotional Path (No branch)
    mirror1No: ".هذا صادق",
    mirror2No: ".الاحتفال غريب. يطلب منا أن نمثّل الفرح",
    
    // Phase 3 - Time Awareness
    timeAwareness: ".أنت هنا، {name} .الساعة {time}",
    time1: ".هذه اللحظة لن تتكرر",
    time2: ".كل خيار اتخذته قادك إلى هنا",
    time3: ".بما في ذلك البقاء",
    
    // Phase 4 - Childhood
    childhood1: ".عندما كنت صغيراً، كانت أعياد الميلاد تبدو لانهائية",
    childhood2: ".الآن تعدّها بشكل مختلف",
    
    // Phase 5 - Reinterpret
    reinterpret: ".لكن ربما هذه هي الهدية—معرفة أنها معدودة",
    
    // Phase 6 - Author Presence
    author1: ".شخص ما فكّر بك اليوم",
    author2: ".أخذ وقتاً لبناء هذا",
    author3: ".ليس لأنه اضطر لذلك",
    
    // Phase 7 - Final
    final1: "،عيد ميلاد سعيد",
    final2: ".{name}",
    aftertaste: ".الباقي لك",
    
    // UI
    tapToContinue: "اضغط للبدء",
    loading: "...",
  },
  ru: {
    // Phase 0 - Chaos
    chaos1: "С ДНЁМ РОЖДЕНИЯ!",
    chaos2: "🎉 ПРАЗДНУЙ! 🎊",
    stayHint: "Останься. Всё изменится.",
    
    // Phase 1 - Core Question
    coreQuestion: "Но чувствуешь ли ты себя по-настоящему отмеченным?",
    choice1: "Да, чувствую",
    choice2: "Не совсем",
    reassurance: "Здесь нет правильного ответа.",
    exitText: "Я не просил тебя делать всё это",
    
    // Phase 2 - Emotional Path (Yes branch)
    mirror1Yes: "Хорошо. Держись за это.",
    mirror2Yes: "Не всем дано так чувствовать.",
    
    // Phase 2 - Emotional Path (No branch)
    mirror1No: "Это честно.",
    mirror2No: "Празднование странно. Оно просит нас изображать радость.",
    
    // Phase 3 - Time Awareness
    timeAwareness: "Сейчас {time}. Ты здесь, {name}.",
    time1: "Этот момент не повторится.",
    time2: "Каждый твой выбор привёл сюда.",
    time3: "Включая решение остаться.",
    
    // Phase 4 - Childhood
    childhood1: "В детстве дни рождения казались бесконечными.",
    childhood2: "Теперь ты считаешь их иначе.",
    
    // Phase 5 - Reinterpret
    reinterpret: "Но, может, в этом и подарок — знать, что они сочтены.",
    
    // Phase 6 - Author Presence
    author1: "Кто-то думал о тебе сегодня.",
    author2: "Нашёл время, чтобы создать это.",
    author3: "Не потому, что должен был.",
    
    // Phase 7 - Final
    final1: "С Днём Рождения,",
    final2: "{name}.",
    aftertaste: "Остальное — твоё.",
    
    // UI
    tapToContinue: "нажми, чтобы начать",
    loading: "...",
  },
};

// Translation helper
export const t = (
  key: keyof typeof langTexts.en,
  lang: 'en' | 'ar' | 'ru' = 'en',
  replacements?: Record<string, string>
): string => {
  let text = langTexts[lang][key] || langTexts.en[key] || key;
  
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  
  return text;
};

// Get current time formatted
export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
