// js/data.js

const DefaultHellDoorsData = [
    // ----------------------------------------------------
    // WALL 1: Back Wall (Z = -59.8) - 12 Doors (spaced along X: -55 to 55)
    // ----------------------------------------------------
    {
        id: "gate_1",
        name: "درس: خطوات الشيطان (الحلقة ٣٣)",
        danger: "مرتفع (Class 3)",
        description: "شرح مفصل للمراحل والخطوات التي يتبعها وسواس شوشو لاستدراج الإنسان شيئاً فشيئاً وتدريسه أساليب التزيين والإغواء.",
        style: "bone",
        position: { x: -55, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 120, type: "sawtooth", duration: 1.8, modFreq: 8, modGain: 50 },
        videoUrl: "videos/خطوات الشيطان مدرسة الشياطين ودرس ابليس الحلقة رقم ٣٣.mp4"
    },
    {
        id: "gate_2",
        name: "درس: أصحاب السوء (الحلقة ٤٦)",
        danger: "كارثي (Class 5)",
        description: "مقرر كيفية اختيار بطانة شياطين الإنس لتعزيز الغواية وتثبيت خطوات المعصية في النفوس البشرية.",
        style: "magma",
        position: { x: -45, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 80, type: "triangle", duration: 2.5, modFreq: 4, modGain: 80 },
        videoUrl: "videos/اصحاب السوء مدرسة الشياطين ودرس ابليس الحلقة رقم ٤٦.mp4"
    },
    {
        id: "gate_3",
        name: "درس: الأبراج والتنبؤات والتاروت (الحلقة ٤٣)",
        danger: "مرتفع (Class 3)",
        description: "كشف أسرار الترويج للتنبؤات والفلك ومحاولات صرف العقول البشرية عن التوكل واليقين بالله والتعلق بالأوهام.",
        style: "runes",
        position: { x: -35, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 150, type: "triangle", duration: 2.0, modFreq: 6, modGain: 40 },
        videoUrl: "videos/الابراج والتنبؤات والطاقة والفلك والتاروت مدرسة الشياطين ودرس ابليس الحلقة ٤٣.mp4"
    },
    {
        id: "gate_4",
        name: "درس: الاحتلال الناعم بالسوشيال ميديا (الحلقة ٥٥)",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "دراسة وتطبيق استراتيجيات الغزو الفكري والهيمنة الرقمية على عقول الأجيال وتشتيت انتباههم عبر منصات التواصل.",
        style: "runes",
        position: { x: -25, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 70, type: "sawtooth", duration: 3.0, modFreq: 3, modGain: 90 },
        videoUrl: "videos/الاحتلال الناعم بالسوشيال ميديا (مدرسة الشياطين ٥٥)0.mp4"
    },
    {
        id: "gate_5",
        name: "درس: التلاعب بالفطرة البشرية (الحلقة ٤٥)",
        danger: "مرتفع (Class 3)",
        description: "تحليل منهجي لأساليب الشيطان في تشويه الفطرة السليمة وقلب المفاهيم وتزيين الرذائل والجهر بها.",
        style: "spikes",
        position: { x: -15, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 180, type: "square", duration: 1.5, modFreq: 20, modGain: 30 },
        videoUrl: "videos/التلاعب في الفطرة البشرية مدرسة الشياطين ودرس ابليس الحلقة ٤٥.mp4"
    },
    {
        id: "gate_6",
        name: "درس: الجفاف العاطفي وخيوط العنكبوت (الحلقة ٤٤)",
        danger: "كارثي (Class 5)",
        description: "محاضرة في زرع الفرقة وتوسيع فجوة الجفاء العاطفي داخل الأسر، وبناء بيوت واهنة مثل بيوت العنكبوت.",
        style: "souls",
        position: { x: -5, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 300, type: "sine", duration: 3.0, modFreq: 1, modGain: 150 },
        videoUrl: "videos/الجفاف العاطفي وخيوط العنكبوت مدرسة الشياطين ودرس ابليس الحلقة ٤٤.mp4"
    },
    {
        id: "gate_7",
        name: "درس: النسويات وحقوق المرأة (الحلقة ٢١)",
        danger: "مرتفع جداً (Class 4)",
        description: "فحص الصراعات المستحدثة وإثارة العداوات الاجتماعية وتفكيك الأسرة تحت شعارات برّاقة تدمر القيم والأخلاق.",
        style: "souls",
        position: { x: 5, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 220, type: "sine", duration: 2.2, modFreq: 12, modGain: 60 },
        videoUrl: "videos/الحلقة (٢١) من مدرسة الشياطين ودرس ابليس والحلقة دي با إسم النسويات وحقوق المرأة قبل وبعد الإسلام ول0.mp4"
    },
    {
        id: "gate_8",
        name: "درس: خطة إبليس الخمسية (الحلقة ٣٦)",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "الخطة الكبرى والأهم لإبليس في محاصرة النفوس وإحباط العمل الصالح والتخطيط الاستراتيجي للإيقاع بجميع البشر.",
        style: "beast",
        position: { x: 15, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 90, type: "sawtooth", duration: 2.2, modFreq: 15, modGain: 60 },
        videoUrl: "videos/مينفعش متتفرجوش علي الحلقة دي لأخرها حلقة مهمة جدا من مدرسة الشياطين ودرس ابليس الحلقة رقم ٣٦ (خطة ا.mp4"
    },
    {
        id: "gate_9",
        name: "درس: السم في العسل (الحلقة ٤٨)",
        danger: "متوسط (Class 2)",
        description: "كيفية دس الأفكار الخبيثة والضالة في قوالب لطيفة وجذابة لكي يستسيغها المتلقي دون حذر أو وعي.",
        style: "magma",
        position: { x: 25, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 100, type: "triangle", duration: 1.8, modFreq: 5, modGain: 50 },
        videoUrl: "videos/السم في العسل مدرسة الشياطين الحلقة رقم ٤٨.mp4"
    },
    {
        id: "gate_10",
        name: "درس: المسلم الكيوت والميوعة الدينية (الحلقة ٥٣)",
        danger: "كارثي (Class 5)",
        description: "شرح درس تمييع الثوابت الدينية، وصناعة الشخصية الانهزامية التي تساوم على عقيدتها وقيمها لإرضاء الجميع.",
        style: "bone",
        position: { x: 35, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 140, type: "sine", duration: 2.0, modFreq: 9, modGain: 40 },
        videoUrl: "videos/المسلم والمسلمة الكيوت مدرسة الشياطين ودرس ابليس الحلقة ٥٣ كاملة.mp4"
    },
    {
        id: "gate_11",
        name: "درس: زحليقة الحشيش والمخدرات (الحلقة ٣٨)",
        danger: "كارثي (Class 5)",
        description: "فصل دراسة استدراج الشباب في شباك الإدمان وإذهاب العقل تدريجياً لتعطيل الإنتاجية والعبادة والتفكير السليم.",
        style: "magma",
        position: { x: 45, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 95, type: "triangle", duration: 2.0, modFreq: 7, modGain: 70 },
        videoUrl: "videos/(زحليقة الحشش) حلقة مهمة جدا من سلسلة مدرسة الشياطين ودرس ابليس الحلقة (٣٨).mp4"
    },
    {
        id: "gate_12",
        name: "درس: الجهر بالمعصية والفجور (الحلقة ٤٤)",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "فحص أساليب إشاعة الفاحشة وكسر حاجز الحياء والمجاهرة بالذنوب والدفاع عنها بقوة لزعزعة استقرار المجتمع المسلم.",
        style: "spikes",
        position: { x: 55, y: 3.5, z: -59.8 },
        rotation: { x: 0, y: 0, z: 0 },
        sound: { frequency: 160, type: "sawtooth", duration: 2.3, modFreq: 11, modGain: 45 },
        videoUrl: "videos/الچهر بالمعصية والفجور في الدفاع عنها مدرسة الشياطين ودرس ابليس الحلقة ٤٤.mp4"
    },

    // ----------------------------------------------------
    // WALL 2: Left Wall (X = -59.8) - 11 Doors (spaced along Z: -50 to 50)
    // ----------------------------------------------------
    {
        id: "gate_13",
        name: "درس: أبو حمالات الأكثر طلباً",
        danger: "مرتفع (Class 3)",
        description: "تحليل الشخصية المظهرية واستخدامها كأداة لبث الشبهات وصرف العوام عن المنهج القويم عبر التبسيط المخل بالدين.",
        style: "bone",
        position: { x: -59.8, y: 3.5, z: -50 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 130, type: "triangle", duration: 1.5, modFreq: 6, modGain: 55 },
        videoUrl: "videos/أبو حمالات الحلقة الأكثر طلباً0.mp4"
    },
    {
        id: "gate_14",
        name: "درس: زيادة العنف وإبعاد الناس عن الدين",
        danger: "كارثي (Class 5)",
        description: "دراسة حول مخططات إشاعة الفوضى والقسوة وتنمية الأحقاد بين البشر بهدف إفقادهم الطمأنينة والإيمان.",
        style: "runes",
        position: { x: -59.8, y: 3.5, z: -40 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 75, type: "sawtooth", duration: 2.8, modFreq: 4, modGain: 80 },
        videoUrl: "videos/الحلقة الكاملة علي اليوتيوب الأن من سلسلة مدرسة الشياطين ودرس ابليس وبتتكلم عن زيادة العنف وطرق ابعا0.mp4"
    },
    {
        id: "gate_15",
        name: "درس: الحلقة التي يتهرب منها الكثير (الحلقة ٣٤)",
        danger: "مرتفع جداً (Class 4)",
        description: "حلقة استثنائية تكشف عيوب النفس الخفية والغرور الفكري الذي يعيق التوبة الصادقة والرجوع للحق.",
        style: "souls",
        position: { x: -59.8, y: 3.5, z: -30 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 210, type: "sine", duration: 2.0, modFreq: 10, modGain: 65 },
        videoUrl: "videos/الحلقة اللي ناس كثير محدش بيحبهم هيخدوها علي مقاسهم وهيلبسوها مدرسة الشياطين ودرس ابليس الحلقة ٣٤.mp4"
    },
    {
        id: "gate_16",
        name: "درس: أهم المواضيع التي نقع فيها بلا وعي",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "كشف العادات والذنوب الصغيرة التي نستصغرها وهي تجرف جبالاً من الحسنات دون أن نشعر.",
        style: "spikes",
        position: { x: -59.8, y: 3.5, z: -20 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 170, type: "square", duration: 1.7, modFreq: 18, modGain: 40 },
        videoUrl: "videos/الحلقة دي بتتكلم عن موضوع من أهم وأخطر المواضيع اللي كلنا بنقع فيها ومش واخدين بالنا انا حرفيا خطيرة.mp4"
    },
    {
        id: "gate_17",
        name: "درس: إنقاذ الأرواح التائهة والمحاضرة الهامة",
        danger: "مرتفع (Class 3)",
        description: "كيفية إعادة ترتيب الأولويات الروحية والتحذير من سبل الهلاك التي تجر النفس للضياع والشتات الأبدي.",
        style: "magma",
        position: { x: -59.8, y: 3.5, z: -10 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 85, type: "triangle", duration: 2.2, modFreq: 5, modGain: 75 },
        videoUrl: "videos/الحلقة دي مينفعش ميتعملش ليها مشاركة ممكن ننقذ روح تايهة لو سمعتها مدرسة الشياطين ودرس ابليس (الحلقة.mp4"
    },
    {
        id: "gate_18",
        name: "درس: مدرسة الشياطين (الحلقة ٢٠)",
        danger: "متوسط (Class 2)",
        description: "مقدمات في بناء الحواجز الذهنية ضد النصيحة وكيفية دفع النفس للاستكبار ورفض التوجيه.",
        style: "bone",
        position: { x: -59.8, y: 3.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 115, type: "sawtooth", duration: 1.6, modFreq: 7, modGain: 50 },
        videoUrl: "videos/الحلقة رقم ٢٠ من مدرسة الشياطين ودرس ابليس والموضوع اللي فيه مهم جدا0.mp4"
    },
    {
        id: "gate_19",
        name: "درس: الحفاظ على البيت والأهل (الحلقة ٢٧)",
        danger: "مرتفع جداً (Class 4)",
        description: "استعراض ثغرات هدم المنازل وتدريس الشياطين الجدد كيفية خلق النزاعات الزوجية التافهة وتضخيمها.",
        style: "beast",
        position: { x: -59.8, y: 3.5, z: 10 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 95, type: "sawtooth", duration: 2.1, modFreq: 14, modGain: 60 },
        videoUrl: "videos/الحلقة رقم ٢٧ من مدرسة الشياطين ودرس ابليس واللي عايز يحافظ علي بيته واهله ياخد حزره ويصلي ويحافظ عل0.mp4"
    },
    {
        id: "gate_20",
        name: "درس: الخرزة الزرقاء والخرافات (الحلقة ٣٥)",
        danger: "مرتفع (Class 3)",
        description: "تفكيك عقائد التمائم والخرز وحرق سبل تعليق النفوس بغير خالقها لإيقاعهم في براثن الشرك الخفي.",
        style: "runes",
        position: { x: -59.8, y: 3.5, z: 20 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 145, type: "triangle", duration: 1.9, modFreq: 7, modGain: 40 },
        videoUrl: "videos/الخرزة الزرقة والابراج والطاقة والسحر والعادات السيئة من سلسلة مدرسة الشياطين ودرس ابليس الحلقة ٣٥.mp4"
    },
    {
        id: "gate_21",
        name: "درس: الخطر الذي يضيع جبال الحسنات (الحلقة ٤١)",
        danger: "كارثي (Class 5)",
        description: "شرح درس الرياء والسمعة، ومحاولات إفساد النية الصالحة لإحباط الأجر بالكلية وجعل الأعمال هباءً منثوراً.",
        style: "souls",
        position: { x: -59.8, y: 3.5, z: 30 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 280, type: "sine", duration: 2.7, modFreq: 2, modGain: 120 },
        videoUrl: "videos/الخطر اللي بيضيع جبال الحسنات مدرسة الشياطين ودرس ابليس الحلقة رقم ٤١.mp4"
    },
    {
        id: "gate_22",
        name: "درس: الكبر ورفض الحق (الحلقة ٥١)",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "المنهج الشيطاني في جعل التراجع عن الخطأ هزيمة شخصية، وتكريس العناد والتمسك بالباطل.",
        style: "spikes",
        position: { x: -59.8, y: 3.5, z: 40 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 185, type: "square", duration: 1.4, modFreq: 22, modGain: 35 },
        videoUrl: "videos/الرجوع الي الحق هزيمة و فضيحة مدرسة الشياطين ودرس ابليس الحلقة رقم ٥١.mp4"
    },
    {
        id: "gate_23",
        name: "درس: أهمية المقاطع ودورها الكشف الشيطاني (الحلقة ٤٢)",
        danger: "مرتفع (Class 3)",
        description: "محاضرة كشف المخططات الكبرى وتحذير الأنفس من الوقوع في براثن الغفلة ومقاومة سبل الإغواء التفاعلية.",
        style: "magma",
        position: { x: -59.8, y: 3.5, z: 50 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        sound: { frequency: 78, type: "triangle", duration: 2.3, modFreq: 5, modGain: 85 },
        videoUrl: "videos/الموضوع هنا كبير ومينفعش متتفرجوش عليه للأخر مدرسة الشياطين ودرس ابليس الحلقة رقم ٤٢.mp4"
    },

    // ----------------------------------------------------
    // WALL 3: Right Wall (X = 59.8) - 12 Doors (spaced along Z: -55 to 55)
    // ----------------------------------------------------
    {
        id: "gate_24",
        name: "درس: إسقاط القرآن والدين (الحلقة ٥٠)",
        danger: "أقصى درجات الخطر (Class 6)",
        description: "تحليل محاولات التشكيك في النص القرآني والسنة النبوية، وزعزعة اليقين العقدي لدى الأجيال الجديدة.",
        style: "beast",
        position: { x: 59.8, y: 3.5, z: -55 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 88, type: "sawtooth", duration: 2.4, modFreq: 16, modGain: 65 },
        videoUrl: "videos/الهدف هو اسقاط القرأن أسقطهم الله في قعر جهنم ان شاء الله من سلسلة مدرسة الشياطين ودرس ابليس (الحلقة.mp4"
    },
    {
        id: "gate_25",
        name: "درس: علاج الضيق والكرب وتأثيره",
        danger: "مرتفع (Class 3)",
        description: "كيف يعمل إبليس على قطع حبل الرجاء والاستشفاء بالقرآن ونشر اليأس والسوداوية والاكتئاب النفسي.",
        style: "souls",
        position: { x: 59.8, y: 3.5, z: -45 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 230, type: "sine", duration: 2.1, modFreq: 11, modGain: 55 },
        videoUrl: "videos/بعد الفيديو ده مش هتحس بضيق ولا كرب ولا اكتئاب لأن الحل في الفيديو ده بس كمله للأخر وصدقني هتعيش سعي.mp4"
    },
    {
        id: "gate_26",
        name: "درس: حماية الأبناء والتحذير الهام",
        danger: "كارثي (Class 5)",
        description: "مناهج استهداف النشء الصغير وتحصين البيوت ضد الهجمات الفكرية الشرسة والتحلل الخلقي المعاصر.",
        style: "spikes",
        position: { x: 59.8, y: 3.5, z: -35 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 175, type: "square", duration: 1.6, modFreq: 19, modGain: 35 },
        videoUrl: "videos/حلقة قوية جدا ومينفعش متتفرجوش عليها لأخر ثانية انتوا واولادكوا ومينفعش متعملوش ليها مشاركة مدرسة ال.mp4"
    },
    {
        id: "gate_27",
        name: "درس: صناعة الزوجة الناشز وخراب البيوت (الحلقة ٤٧)",
        danger: "كارثي (Class 5)",
        description: "تعليم كيفية زرع الأنانية والتمرد ونزع البركة والمودة والرحمة من النفوس لإفساد العلاقة الزوجية المقدسة.",
        style: "magma",
        position: { x: 59.8, y: 3.5, z: -25 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 83, type: "triangle", duration: 2.6, modFreq: 5, modGain: 75 },
        videoUrl: "videos/صناعة الزوجة الناشز وخراب البيوت مدرسة الشياطين ودرس ابليس 47.mp4"
    },
    {
        id: "gate_28",
        name: "درس: فاشلة ناعوق والرد العلمي (الحلقة ٢٢)",
        danger: "مرتفع جداً (Class 4)",
        description: "دورة الرد على أبواق التشكيك وتوجيه الشبهات العقائدية التي ينشرها البعض لإثارة التشتت والبلبلة الفكرية.",
        style: "bone",
        position: { x: 59.8, y: 3.5, z: -15 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 125, type: "sawtooth", duration: 1.7, modFreq: 9, modGain: 45 },
        videoUrl: "videos/فاشلة ناعوق في الحلقة رقم (22) من مدرسة الشياطين ودرس ابليس وزي ما إنتوا عارفين أنا مبهزرش وبرضوا مق0.mp4"
    },
    {
        id: "gate_29",
        name: "درس: تذكرة هامة وتفاصيل التوبة (الحلقة ٥٠)",
        danger: "مرتفع (Class 3)",
        description: "دراسة العقبات التي يضعها الشيطان في طريق التوبة والرجوع لله والوساوس الداعية للمماطلة والتسويف الأبدي.",
        style: "runes",
        position: { x: 59.8, y: 3.5, z: -5 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 155, type: "triangle", duration: 2.1, modFreq: 6, modGain: 40 },
        videoUrl: "videos/لازم تتفرجوا للأخر لأنها مهمة جدا من مدرسة الشياطين ودرس ابليس الحلقة ٥٠.mp4"
    },
    {
        id: "gate_30",
        name: "درس: مدرسة الشياطين ودرس إبليس (الحلقة ٢٤)",
        danger: "متوسط (Class 2)",
        description: "تفاصيل استراتيجيات الاستدراج الصغير وإخفاء النوايا الحقيقية وراء الأفعال اليومية البسيطة.",
        style: "souls",
        position: { x: 59.8, y: 3.5, z: 5 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 215, type: "sine", duration: 2.3, modFreq: 11, modGain: 60 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس الحلقة (٢٤) ومبهزرش والله يا جماعة0.mp4"
    },
    {
        id: "gate_31",
        name: "درس: نسيان تعاليم الدين وألاعيب شوشو (الحلقة ٢٨)",
        danger: "مرتفع جداً (Class 4)",
        description: "مقرر كيفية محو المبادئ الدينية وإحلال الثقافة الترفيهية الاستهلاكية لإغراق النفوس في الغفلة الطويلة.",
        style: "bone",
        position: { x: 59.8, y: 3.5, z: 15 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 135, type: "sawtooth", duration: 1.9, modFreq: 8, modGain: 50 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس الحلقة (٢٨) انسوا كل اللي اتعلمتوه في شوشو وان0.mp4"
    },
    {
        id: "gate_32",
        name: "درس: مدرسة الشياطين والألعاب الفكرية (الحلقة الأولي)",
        danger: "متوسط (Class 2)",
        description: "تأسيس القواعد الفكرية الأولى للغواية والوسوسة والتأثير السلبي المباشر على قرارات الإنسان الفردية.",
        style: "magma",
        position: { x: 59.8, y: 3.5, z: 25 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 98, type: "triangle", duration: 1.9, modFreq: 4, modGain: 80 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس الحلقة الأولي (بدون موسيقي)0.mp4"
    },
    {
        id: "gate_33",
        name: "درس: المظاهر الخادعة والألاعيب (الحلقة ٢٥)",
        danger: "مرتفع (Class 3)",
        description: "شرح استخدام المظاهر المادية البراقة والخادعة لصرف الانتباه عن الجوهر الديني والقيمي الحقيقي.",
        style: "runes",
        position: { x: 59.8, y: 3.5, z: 35 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 165, type: "triangle", duration: 2.2, modFreq: 5, modGain: 40 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس الحلقة رقم (٢٥) وزي ما احنا متعودين يبان انه هزار بس هو مش هزار خالص0.mp4"
    },
    {
        id: "gate_34",
        name: "درس: مدرسة الشياطين (الحلقة ٢٩)",
        danger: "مرتفع (Class 3)",
        description: "محاضرة في كيفية ترسيخ عدم المبالاة تجاه المواعظ والنصح، واستبدالها بالاستهزاء والتقليل من شأن الآخرين.",
        style: "spikes",
        position: { x: 59.8, y: 3.5, z: 45 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 190, type: "square", duration: 1.6, modFreq: 21, modGain: 30 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس الحلقة رقم (٢٩) وعلي فكرة مش هزار والله0.mp4"
    },
    {
        id: "gate_35",
        name: "منهج مدرسة الشياطين ودرس إبليس العام",
        danger: "كارثي (Class 5)",
        description: "الملخص العام والشامل لمنظومة التعليم الشيطاني والمداخل الفكرية والعملية لإخراج النفس عن الاستقامة واليقين.",
        style: "beast",
        position: { x: 59.8, y: 3.5, z: 55 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        sound: { frequency: 93, type: "sawtooth", duration: 2.3, modFreq: 14, modGain: 60 },
        videoUrl: "videos/مدرسة الشياطين ودرس ابليس0.mp4"
    }
];

const DataManager = {
    loadData() {
        return JSON.parse(JSON.stringify(DefaultHellDoorsData));
    }
};
