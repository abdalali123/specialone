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
  name: "Daria",
  language: "en",
  birthdayDate: new Date().toISOString(),
  images: [
    "/images/memory-1.jpg",
    "/images/memory-2.jpg",
    "/images/memory-3.jpg",
    "/images/memory-4.jpg"
  ],
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
    chaos1: "HAPPY BIRTHDAY!",
    chaos2: "🎉 CELEBRATE! 🎊",
    stayHint: "Stay. It changes.",
    coreQuestion: "But do you actually feel celebrated?",
    choice1: "Yes, I do",
    choice2: "Not really",
    reassurance: "There's no right answer here.",
    exitText: "I didn't ask you to do all this",
    mirror1Yes: "Good. Hold onto that.",
    mirror2Yes: "Not everyone gets to feel that way.",
    mirror1No: "That's honest.",
    mirror2No: "Celebration is strange. It asks us to perform joy.",
    timeAwareness: "It's {time}. You're here, {name}.",
    time1: "This moment won't repeat.",
    time2: "Every choice you made led here.",
    time3: "Including staying.",
    childhood1: "When you were young, birthdays felt infinite.",
    childhood2: "Now you count them differently.",
    reinterpret: "But maybe that's the gift—knowing they're numbered.",
    author1: "Someone thought about you today.",
    author2: "Took time to build this.",
    author3: "Not because they had to.",
    final1: "Happy Birthday,",
    final2: "{name}.",
    aftertaste: "The rest is yours.",
    finalParagraph: [
      "And I want you to know this:",
      "I’m genuinely happy you exist.",
      "Proud of who you are becoming,",
      "even on days you doubt it.",
      "You matter more than you think.",
      "And I don’t just celebrate your birthday",
      "I celebrate you.",
      "I hope you stay.",
      "Not just here… but in my life."
    ],
    tapToContinue: "tap to begin",
    loading: "...",
  },
  ar: {
    chaos1: "!عيد ميلاد سعيد",
    chaos2: "🎉 احتفل! 🎊",
    stayHint: ".ابقَ. سيتغير",
    coreQuestion: "لكن هل تشعر فعلاً بالاحتفاء بك؟",
    choice1: "نعم، أشعر",
    choice2: "ليس حقاً",
    reassurance: ".لا توجد إجابة صحيحة هنا",
    exitText: "لم أطلب منك فعل كل هذا",
    mirror1Yes: ".جيد. تمسّك بذلك",
    mirror2Yes: ".ليس الجميع يشعرون هكذا",
    mirror1No: ".هذا صادق",
    mirror2No: ".الاحتفال غريب. يطلب منا أن نمثّل الفرح",
    timeAwareness: ".أنت هنا، {name} .الساعة {time}",
    time1: ".هذه اللحظة لن تتكرر",
    time2: ".كل خيار اتخذته قادك إلى هنا",
    time3: ".بما في ذلك البقاء",
    childhood1: ".عندما كنت صغيراً، كانت أعياد الميلاد تبدو لانهائية",
    childhood2: ".الآن تعدّها بشكل مختلف",
    reinterpret: ".لكن ربما هذه هي الهدية—معرفة أنها معدودة",
    author1: ".شخص ما فكّر بك اليوم",
    author2: ".أخذ وقتاً لبناء هذا",
    author3: ".ليس لأنه اضطر لذلك",
    final1: "،عيد ميلاد سعيد",
    final2: ".{name}",
    aftertaste: ".الباقي لك",
    finalParagraph: [
      "وأريدك أن تعرف هذا:",
      "أنا سعيد حقًا بوجودك.",
      "فخور بما تصبح عليه،",
      "حتى في الأيام التي تشك فيها.",
      "أنت مهم أكثر مما تعتقد.",
      "ولا أحتفل بعيد ميلادك فقط",
      "أنا أحتفل بك.",
      "أتمنى أن تبقى.",
      "ليس هنا فقط… بل في حياتي."
    ],
    tapToContinue: "اضغط للبدء",
    loading: "...",
  },
  ru: {
    chaos1: "С ДНЁМ РОЖДЕНИЯ!",
    chaos2: "🎉 ПРАЗДНУЙ! 🎊",
    stayHint: "Останься. Всё изменится.",
    coreQuestion: "Но чувствуешь ли ты себя по-настоящему отмеченным?",
    choice1: "Да, чувствую",
    choice2: "Не совсем",
    reassurance: "Здесь нет правильного ответа.",
    exitText: "Я не просил тебя делать всё это",
    mirror1Yes: "Хорошо. Держись за это.",
    mirror2Yes: "Не всем дано так чувствовать.",
    mirror1No: "Это честно.",
    mirror2No: "Празднование странно. Оно просит нас изображать радость.",
    timeAwareness: "Сейчас {time}. Ты здесь, {name}.",
    time1: "Этот момент не повторится.",
    time2: "Каждый твой выбор привёл сюда.",
    time3: "Включая решение остаться.",
    childhood1: "В детстве дни рождения казались бесконечными.",
    childhood2: "Теперь ты считаешь их иначе.",
    reinterpret: "Но, может, в этом и подарок — знать, что они сочтены.",
    author1: "Кто-то думал о тебе сегодня.",
    author2: "Нашёл время, чтобы создать это.",
    author3: "Не потому, что должен был.",
    final1: "С Днём Рождения,",
    final2: "{name}.",
    aftertaste: "Остальное — твоё.",
    finalParagraph: [
      "И я хочу, чтобы ты это знал:",
      "Я искренне рад, что ты существуешь.",
      "Горжусь тем, кем ты становишься,",
      "даже в дни сомнений.",
      "Ты важнее, чем думаешь.",
      "И я не просто отмечаю твой день рождения",
      "Я отмечаю тебя.",
      "Надеюсь, ты останешься.",
      "Не просто здесь… а в моей жизни."
    ],
    tapToContinue: "нажми, чтобы начать",
    loading: "...",
  },
};

// Translation helper
export const t = (
  key: keyof typeof langTexts.en,
  lang: 'en' | 'ar' | 'ru' = 'en',
  replacements?: Record<string, string>
): any => { // returns string or string[]
  let text = langTexts[lang][key] || langTexts.en[key] || key;
  
  if (replacements && typeof text === "string") {
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
