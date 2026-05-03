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
  name: "Amina", // <-- change the name here
  language: "en",
  birthdayDate: new Date().toISOString(),
  images: [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
    "/images/5.png",
    "/images/6.png"
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
    coreQuestion: " do you actually feel celebrated?",
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
    final1: "HAPPY BIRTHDAY ❤️🎉",
    final2: "my girl, {name}.",
    aftertaste: "i love you, for ever",
    finalParagraph: [
      "Finally... your day.",
      "A whole day that's yours.",
      "No stress, no overthinking... just you being celebrated the way you deserve.",
      "I hope today feels different in the best way.",
      "Full of small moments that make you smile for no reason,",
      "random laughs, unexpected messages,",
      "and that quiet kind of happiness that stays even after the day ends.",
      "Because honestly... you deserve that.",
      "Not just today... but especially today.",
      "I didn't do this because I had to.",
      "No one asked me to. I just wanted to.",
      "Because you matter to me like that.",
      "I'm genuinely happy you exist.",
      "Your energy, your way of thinking,",
      "the little details most people don't notice... I do.",
      "And I love them.",
      "I'm proud of you too.",
      "For everything you're becoming, even on the days you feel lost or unsure.",
      "I'm not trying to make this heavy.",
      "It's your birthday, not a deep talk.",
      "But I can't be fake either.",
      "What we have isn't something normal to me.",
      "Even with the distance, the leaving, the coming back... I'm still here.",
      "Still choosing you. Still caring the same way.",
      "No pressure today. No drama. No expectations.",
      "Just something simple and real:",
      "I love you.",
      "And today, more than anything, I just want you to feel it.",
      "I hope this year brings you peace, clarity, and real happiness.",
      "Enjoy every moment today. Smile more. Take pictures.",
      "Feel special without questioning it.",
      "Because you are."
    ],
    tapToContinue: "tap to begin",
    loading: "...",
  },
  ar: {
    chaos1: "!عيد ميلاد سعيد",
    chaos2: "🎉 احتفل! 🎊",
    stayHint: ".ابقَ. سيتغير",
    coreQuestion: " هل تشعر فعلاً بالاحتفاء بك؟",
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
    final1: "❤️🎉 عيد ميلاد سعيد",
    final2: "يا حبيبتي، {name}.",
    aftertaste: "احبك، إلى الأبد",
    finalParagraph: [
      "أخيرًا... يومك أنت.",
      "يوم كامل لك.",
      "بدون ضغط، بدون تفكير زائد... فقط أنتِ تُحتفى بك كما تستحقين.",
      "أتمنى أن يكون اليوم مختلفًا بأجمل طريقة.",
      "مليئًا بلحظات صغيرة تجعلك تبتسمين بلا سبب،",
      "ضحكات عشوائية، ورسائل غير متوقعة،",
      "وذلك النوع الهادئ من السعادة الذي يبقى حتى بعد نهاية اليوم.",
      "لأنك بصراحة... تستحقين ذلك.",
      "ليس فقط اليوم... لكن خصوصًا اليوم.",
      "لم أفعل هذا لأنني مضطر.",
      "لا أحد طلب مني. أنا فقط أردت ذلك.",
      "لأنك تهمينني بهذا الشكل.",
      "أنا سعيد حقًا بوجودك.",
      "طاقتك، طريقتك في التفكير،",
      "والتفاصيل الصغيرة التي لا يلاحظها أغلب الناس... أنا ألاحظها.",
      "وأحبها.",
      "وأنا فخور بك أيضًا.",
      "بكل ما تصبحين عليه، حتى في الأيام التي تشعرين فيها بالضياع أو التردد.",
      "لا أحاول جعل هذا ثقيلًا.",
      "إنه عيد ميلادك، وليس حديثًا عميقًا.",
      "لكن لا أستطيع أن أكون مزيفًا.",
      "ما بيننا ليس شيئًا عاديًا بالنسبة لي.",
      "حتى مع المسافة والغياب والعودة... ما زلت هنا.",
      "ما زلت أختارك. وما زلت أهتم بنفس الطريقة.",
      "لا ضغط اليوم. لا دراما. لا توقعات.",
      "فقط شيء بسيط وحقيقي:",
      "أنا أحبك.",
      "واليوم، أكثر من أي شيء، أريدك فقط أن تشعري بذلك.",
      "أتمنى أن يجلب لك هذا العام السلام والوضوح وسعادة حقيقية.",
      "استمتعي بكل لحظة اليوم. ابتسمي أكثر. التقطي الصور.",
      "اشعري بأنك مميزة دون أن تشككي في ذلك.",
      "لأنك فعلًا كذلك."
    ],
    tapToContinue: "اضغط للبدء",
    loading: "...",
  },
  ru: {
    chaos1: "С ДНЁМ РОЖДЕНИЯ!",
    chaos2: "🎉 ПРАЗДНУЙ! 🎊",
    stayHint: "Останься. Всё изменится.",
    coreQuestion: " чувствуешь ли ты себя по-настоящему отмеченным?",
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
    final1: "С ДНЕМ РОЖДЕНИЯ ❤️🎉",
    final2: "моя девочка, {name}.",
    aftertaste: "я люблю тебя, навсегда",
    finalParagraph: [
      "Наконец-то... твой день.",
      "Целый день, который принадлежит тебе.",
      "Без стресса и лишних мыслей... просто тебя празднуют так, как ты этого заслуживаешь.",
      "Я надеюсь, что этот день почувствуется по-особенному, в самом лучшем смысле.",
      "Пусть он будет полон маленьких моментов, от которых ты улыбаешься без причины,",
      "случайного смеха и неожиданных сообщений,",
      "и того тихого счастья, которое остается даже после конца дня.",
      "Потому что, честно... ты этого заслуживаешь.",
      "Не только сегодня... но особенно сегодня.",
      "Я сделал это не потому, что должен был.",
      "Никто меня не просил. Я сам этого хотел.",
      "Потому что ты для меня очень важна.",
      "Я правда рад, что ты существуешь.",
      "Твоя энергия, твое мышление,",
      "те маленькие детали, которые другие обычно не замечают... я замечаю.",
      "И люблю их.",
      "Я тобой горжусь.",
      "Тем, кем ты становишься, даже в дни, когда ты чувствуешь неуверенность.",
      "Я не хочу делать это тяжелым.",
      "Это твой день рождения, а не глубокий разговор.",
      "Но и фальшивым быть не могу.",
      "То, что между нами, для меня не что-то обычное.",
      "Даже с расстоянием, уходами и возвращениями... я все еще здесь.",
      "Все еще выбираю тебя. Все еще так же забочусь.",
      "Сегодня без давления. Без драмы. Без ожиданий.",
      "Просто что-то простое и настоящее:",
      "Я люблю тебя.",
      "И сегодня больше всего я хочу, чтобы ты это почувствовала.",
      "Пусть этот год принесет тебе спокойствие, ясность и настоящее счастье.",
      "Наслаждайся каждым моментом. Улыбайся чаще. Делай фотографии.",
      "Чувствуй себя особенной и не сомневайся в этом.",
      "Потому что это правда."
    ],
    tapToContinue: "нажми, чтобы начать",
    loading: "...",
  },
};

// Translation helper
export function t(key: 'finalParagraph', lang?: 'en' | 'ar' | 'ru', replacements?: Record<string, string>): string[];
export function t(key: Exclude<keyof typeof langTexts.en, 'finalParagraph'>, lang?: 'en' | 'ar' | 'ru', replacements?: Record<string, string>): string;
export function t(
  key: keyof typeof langTexts.en,
  lang: 'en' | 'ar' | 'ru' = 'en',
  replacements?: Record<string, string>
): string | string[] {
  let text = langTexts[lang][key] || langTexts.en[key] || key;

  if (replacements) {
    if (Array.isArray(text)) {
      text = text.map((line) =>
        Object.entries(replacements).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), line)
      );
    } else {
      Object.entries(replacements).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, v);
      });
    }
  }

  return text;
}

// Get current time formatted
export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
