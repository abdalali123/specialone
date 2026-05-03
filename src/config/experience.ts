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
    chaos1: "HAPPY BIRTHDAY ❤️🎉",
    chaos2: "Finally... your day.",
    stayHint: "A whole day that's yours.",
    coreQuestion: " no stress, no overthinking... just you being celebrated.",
    choice1: "yes",
    choice2: "yes",
    reassurance: "You deserve this day.",
    exitText: "No pressure today.",
    mirror1Yes: "I'm still here.",
    mirror2Yes: "Still choosing you. Still caring the same way.",
    mirror1No: "I still choose you.",
    mirror2No: "And I still care the same way.",
    timeAwareness: "It's {time}. You're here, {name}.",
    time1: "I just wanted to do this for you.",
    time2: "Because you matter to me like that.",
    time3: "I love you.",
    childhood1: "I hope today feels different in the best way.",
    childhood2: "Full of smiles, random laughs, and beautiful moments.",
    reinterpret: "Feel special without questioning it.",
    author1: "I'm genuinely happy you exist.",
    author2: "I'm proud of you.",
    author3: "Happy Birthday, my girl.",
    final1: "HAPPY BIRTHDAY ❤️🎉",
    final2: "my girl, {name}.",
    aftertaste: "i love you, for ever",
    finalParagraph: [
      "HAPPY BIRTHDAY ❤️🎉",
      "Finally… your day.",
      "A whole day that's yours.",
      "No stress, no overthinking… just you being celebrated the way you deserve.",
      "I hope today feels different in the best way",
      "full of small moments that make you smile for no reason,",
      "random laughs, unexpected messages,",
      "and that quiet kind of happiness that stays even after the day ends.",
      "Because honestly… you deserve that.",
      "Not just today… but especially today.",
      "And I didn't do this because I had to.",
      "No one asked me to.",
      "I just wanted to.",
      "Because you matter to me like that.",
      "I'm genuinely happy you exist.",
      "Like really your energy, your way of thinking, the little details about you that most people don't even notice… I do.",
      "And I love them.",
      "I'm proud of you too.",
      "For everything you're becoming, even on the days you feel lost or unsure.",
      "And yeah… I'm not trying to make this heavy",
      "it's your birthday, not a deep talk",
      "But I can't be fake either…",
      "What we have isn't something normal to me.",
      "Even with the distance, the leaving, the coming back…",
      "I'm still here.",
      "Still choosing you.",
      "Still caring the same way.",
      "No pressure today.",
      "No drama. No expectations.",
      "Just something simple and real:",
      "I love you.",
      "And today, more than anything,",
      "I just want you to feel it.",
      "I hope this year brings you peace, clarity, and the kind of happiness that doesn't disappear.",
      "Enjoy every moment today.",
      "Smile more.",
      "Take pictures.",
      "Feel special without questioning it.",
      "Because you are.",
      "Happy Birthday, my girl ❤️🎂"
    ],
    tapToContinue: "tap to begin",
    loading: "...",
  },
  ar: {
    chaos1: "❤️🎉 عيد ميلاد سعيد",
    chaos2: "أخيرًا... يومك أنت.",
    stayHint: "يوم كامل لك.",
    coreQuestion: " بدون ضغط وبدون تفكير زائد... فقط احتفاء بك كما تستحقين.",
    choice1: "نعم",
    choice2: "نعم",
    reassurance: "أنتِ تستحقين هذا اليوم.",
    exitText: "لا ضغط اليوم.",
    mirror1Yes: "ما زلت هنا.",
    mirror2Yes: "ما زلت أختارك، وما زلت أهتم بنفس الطريقة.",
    mirror1No: "سأظل أختارك.",
    mirror2No: "وسأظل أهتم بنفس الطريقة.",
    timeAwareness: "الساعة {time}. أنتِ هنا يا {name}.",
    time1: "أنا فقط أردت أن أفعل هذا لكِ.",
    time2: "لأنك تهمينني بهذا الشكل.",
    time3: "أنا أحبك.",
    childhood1: "أتمنى أن يكون اليوم مختلفًا بأجمل طريقة.",
    childhood2: "مليئًا بالابتسامات والضحكات واللحظات الجميلة.",
    reinterpret: "اشعري بأنك مميزة دون أن تشككي.",
    author1: "أنا سعيد جدًا بوجودك.",
    author2: "أنا فخور بك.",
    author3: "عيد ميلاد سعيد يا حبيبتي.",
    final1: "❤️🎉 عيد ميلاد سعيد",
    final2: "يا حبيبتي، {name}.",
    aftertaste: "احبك، إلى الأبد",
    finalParagraph: [
      "❤️🎉 عيد ميلاد سعيد",
      "أخيرًا… يومك أنت.",
      "يوم كامل لك.",
      "بدون ضغط، بدون تفكير زائد… فقط أنتِ تُحتفى بك كما تستحقين.",
      "أتمنى أن يكون اليوم مختلفًا بأجمل طريقة",
      "مليئًا بلحظات صغيرة تجعلك تبتسمين بلا سبب،",
      "ضحكات عشوائية، ورسائل غير متوقعة،",
      "وذلك النوع الهادئ من السعادة الذي يبقى حتى بعد نهاية اليوم.",
      "لأنك بصراحة… تستحقين ذلك.",
      "ليس فقط اليوم… لكن خصوصًا اليوم.",
      "لم أفعل هذا لأنني مضطر.",
      "لا أحد طلب مني.",
      "أنا فقط أردت ذلك.",
      "لأنك تهمينني بهذا الشكل.",
      "أنا سعيد حقًا بوجودك.",
      "بصدق، طاقتك وطريقتك في التفكير والتفاصيل الصغيرة فيك التي أغلب الناس لا يلاحظونها… أنا ألاحظها.",
      "وأحبها.",
      "وأنا فخور بك أيضًا.",
      "بكل ما تصبحين عليه، حتى في الأيام التي تشعرين فيها بالضياع أو التردد.",
      "ولست أحاول أن أجعل هذا ثقيلًا",
      "هذا عيد ميلادك، وليس حديثًا عميقًا",
      "لكن لا أستطيع أن أكون مزيفًا…",
      "ما بيننا ليس شيئًا عاديًا بالنسبة لي.",
      "حتى مع المسافة والغياب والعودة…",
      "ما زلت هنا.",
      "ما زلت أختارك.",
      "وما زلت أهتم بنفس الطريقة.",
      "لا ضغط اليوم.",
      "لا دراما. لا توقعات.",
      "فقط شيء بسيط وحقيقي:",
      "أنا أحبك.",
      "واليوم، أكثر من أي شيء،",
      "أريدك فقط أن تشعري بذلك.",
      "أتمنى أن يجلب لك هذا العام السلام والوضوح ونوع السعادة الذي لا يختفي.",
      "استمتعي بكل لحظة اليوم.",
      "ابتسمي أكثر.",
      "التقطي الصور.",
      "اشعري بأنك مميزة دون أن تشككي في ذلك.",
      "لأنك فعلًا كذلك.",
      "عيد ميلاد سعيد يا حبيبتي ❤️🎂"
    ],
    tapToContinue: "اضغط للبدء",
    loading: "...",
  },
  ru: {
    chaos1: "С ДНЕМ РОЖДЕНИЯ ❤️🎉",
    chaos2: "Наконец... твой день.",
    stayHint: "Целый день только твой.",
    coreQuestion: " без стресса и лишних мыслей... тебя празднуют так, как ты заслуживаешь.",
    choice1: "да",
    choice2: "да",
    reassurance: "Ты заслуживаешь этот день.",
    exitText: "Сегодня без давления.",
    mirror1Yes: "Я все еще здесь.",
    mirror2Yes: "Все еще выбираю тебя. Все еще так же забочусь.",
    mirror1No: "Я все равно выбираю тебя.",
    mirror2No: "И все равно так же забочусь.",
    timeAwareness: "Сейчас {time}. Ты здесь, {name}.",
    time1: "Я просто хотел сделать это для тебя.",
    time2: "Потому что ты для меня важна.",
    time3: "Я люблю тебя.",
    childhood1: "Пусть этот день будет особенным в лучшем смысле.",
    childhood2: "Пусть он будет полон улыбок, смеха и красивых моментов.",
    reinterpret: "Чувствуй себя особенной без сомнений.",
    author1: "Я правда рад, что ты существуешь.",
    author2: "Я горжусь тобой.",
    author3: "С днем рождения, моя девочка.",
    final1: "С ДНЕМ РОЖДЕНИЯ ❤️🎉",
    final2: "моя девочка, {name}.",
    aftertaste: "я люблю тебя, навсегда",
    finalParagraph: [
      "С ДНЕМ РОЖДЕНИЯ ❤️🎉",
      "Наконец-то… твой день.",
      "Целый день, который принадлежит тебе.",
      "Без стресса и лишних мыслей… просто тебя празднуют так, как ты этого заслуживаешь.",
      "Я надеюсь, что этот день почувствуется по-особенному, в самом лучшем смысле",
      "Пусть он будет полон маленьких моментов, от которых ты улыбаешься без причины,",
      "случайного смеха и неожиданных сообщений,",
      "и того тихого счастья, которое остается даже после конца дня.",
      "Потому что, честно… ты этого заслуживаешь.",
      "Не только сегодня… но особенно сегодня.",
      "Я сделал это не потому, что должен был.",
      "Никто меня не просил.",
      "Я сам этого хотел.",
      "Потому что ты для меня очень важна.",
      "Я правда рад, что ты существуешь.",
      "Серьезно: твоя энергия, твой способ думать, те маленькие детали в тебе, которые большинство людей даже не замечает… я замечаю.",
      "И люблю их.",
      "Я тобой горжусь.",
      "Тем, кем ты становишься, даже в дни, когда ты чувствуешь неуверенность.",
      "И да… я не хочу делать это тяжелым",
      "это твой день рождения, а не глубокий разговор",
      "Но и фальшивым быть не могу…",
      "То, что между нами, для меня не что-то обычное.",
      "Даже с расстоянием, уходами и возвращениями…",
      "Я все еще здесь.",
      "Все еще выбираю тебя.",
      "Все еще так же забочусь.",
      "Сегодня без давления.",
      "Без драмы. Без ожиданий.",
      "Просто что-то простое и настоящее:",
      "Я люблю тебя.",
      "И сегодня, больше всего на свете,",
      "я просто хочу, чтобы ты это почувствовала.",
      "Пусть этот год принесет тебе спокойствие, ясность и то счастье, которое не исчезает.",
      "Наслаждайся каждым моментом сегодня.",
      "Улыбайся чаще.",
      "Делай фотографии.",
      "Чувствуй себя особенной и не сомневайся в этом.",
      "Потому что это правда.",
      "С днем рождения, моя девочка ❤️🎂"
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
