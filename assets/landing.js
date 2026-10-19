/* ============================================================================
   STRATIVA — Landing page behaviour
   • renders the domain/module catalogue, scoring methods, maturity dimensions,
     the strategic-management cycle and the FAQ
   • progressive enhancement: nav, scroll reveal, counters, filters, accordion
   No dependencies. Safe to run with JS disabled (page stays readable).
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  root.classList.add('js');

  /* ── small helpers ─────────────────────────────────────────────────────── */
  function fa(n) { try { return Number(n).toLocaleString('fa-IR'); } catch (e) { return String(n); } }
  function el(tag, cls) { var e = d.createElement(tag); if (cls) e.className = cls; return e; }
  function icon(id, cls) {
    var s = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', cls || 'ic');
    s.setAttribute('aria-hidden', 'true');
    var u = d.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  function txt(tag, cls, value) { var e = el(tag, cls); e.textContent = value; return e; }

  /* ── content model (facts taken from the application itself) ───────────── */
  var DOMAINS = [
    { name: 'سازمان، افراد و ذی‌نفعان', icon: 'i-users', c: 'c-indigo', items: [
      ['شرکت‌ها و سازمان‌ها', 'شناسنامهٔ حقوقی و عمومی سازمان‌ها و ساختار هلدینگ/زیرمجموعه.'],
      ['ساختار سازمانی و واحدها', 'واحدها، مدیر واحد، مأموریت و وزن واحد برای تجمیع امتیاز.'],
      ['کارکنان و سمت‌ها', 'پروفایل شغلی، مهارت و شایستگی افراد و مالکیت شاخص‌ها.'],
      ['ذی‌نفعان و ارتباطات', 'قدرت اثر، میزان توجه، نگرش و راهبرد تعامل (ISO 9001 §4.2).']
    ]},
    { name: 'جهت‌گیری و تحلیل', icon: 'i-compass', c: 'c-teal', items: [
      ['جهت‌گیری استراتژیک', 'چشم‌انداز، مأموریت، ارزش‌ها، اصول، اولویت‌ها و سیاست‌ها با نسخه‌بندی.'],
      ['تحلیل استراتژیک', 'SWOT، PESTEL، پنج نیروی پورتر، تحلیل رقبا و بازار، یافته‌ها و گزینه‌های راهبردی.'],
      ['سناریو و فرضیات', 'سناریوهای پایه/خوش‌بینانه/بدبینانه، فرض راهبردی و تحلیل What-if.']
    ]},
    { name: 'استراتژی و کارت امتیازی', icon: 'i-layers', c: 'c-violet', items: [
      ['استراتژی‌ها', 'مضمون، قصد راهبردی، وزن، اولویت، مالک و معیارهای موفقیت هر استراتژی.'],
      ['کتابخانهٔ چارچوب‌های اجرا', 'BSC، OKR، OGSM، Hoshin Kanri یا چارچوب سفارشی و ترکیبی — با گردش‌کار و قواعد.'],
      ['کارت امتیازی متوازن', 'منظرها با وزن، ترتیب، مالک و منطق موفقیت؛ همراه با نمای کاشی‌ای امتیاز.'],
      ['نقشهٔ استراتژی', 'روابط علت‌ومعلولی میان اهداف با نوع، قدرت و وضعیت اعتبارسنجی رابطه.'],
      ['عوامل حیاتی موفقیت', 'CSF با وزن، اولویت و شواهد موفقیت و اتصال به استراتژی و شاخص.']
    ]},
    { name: 'اهداف و OKR', icon: 'i-target', c: 'c-rose', items: [
      ['اهداف استراتژیک', 'اتصال استراتژی ↔ منظر ↔ شاخص، با وزن هدف، مالک و نتیجهٔ مورد انتظار.'],
      ['مدیریت OKR', 'Objectives و Key Results در پنج سطح، چرخه، اطمینان، Check-in و امتیاز ۰ تا ۱.']
    ]},
    { name: 'شاخص‌ها و هدف‌گذاری', icon: 'i-gauge', c: 'c-amber', items: [
      ['شاخص‌ها', 'نوع (KPI/PI/RI/KRI)، ماهیت زمانی، واحد، جهت مطلوب، فرمول، وزن، مالک و مالک داده.'],
      ['اهداف دوره‌ای شاخص‌ها', 'خط مبنا، حداقل، هدف، هشدار، بحرانی و هدف کششی برای هر دوره.']
    ]},
    { name: 'پایش، اندازه‌گیری و امتیازدهی', icon: 'i-chart', c: 'c-indigo', items: [
      ['دوره‌های پایش', 'تعریف دوره‌های سالانه/فصلی/ماهانه و انتخاب دورهٔ جاری سامانه.'],
      ['اندازه‌گیری عملکرد', 'ثبت عملکرد واقعی هر شاخص در هر دوره، همراه با کیفیت داده و منبع داده.'],
      ['مدل‌های وزن‌دهی و امتیازدهی', 'روش امتیازدهی، روش تجمیع، سقف، آستانه‌های سبز/زرد/قرمز و حداقل پوشش داده.']
    ]},
    { name: 'فرآیندها', icon: 'i-workflow', c: 'c-teal', items: [
      ['دسته‌بندی فرآیندها', 'معماری فرآیند در سه دستهٔ مدیریتی، اصلی و پشتیبان به‌صورت درختی.'],
      ['فرآیندها', 'شناسنامهٔ فرآیند (مشتری، تأمین‌کننده، دامنه، ورودی/خروجی) با سطح بلوغ و مدل‌ساز BPMN.'],
      ['فعالیت‌های فرآیند', 'فعالیت‌ها با مسئول، مدت استاندارد، SLA و اتصال به شاخص، ریسک و کنترل.']
    ]},
    { name: 'ریسک، انطباق و کنترل', icon: 'i-shield', c: 'c-rose', items: [
      ['ثبت و مدیریت ریسک', 'احتمال و اثر ذاتی و باقی‌مانده، راهبرد پاسخ، وضعیت نسبت به اشتهای ریسک.'],
      ['اشتها و تحمل ریسک', 'بیانیهٔ اشتهای ریسک به تفکیک حوزه و سال، با تحمل، ظرفیت و قاعدهٔ ارجاع.'],
      ['ارزیابی‌های ریسک', 'ارزیابی دوره‌ای با اثربخشی کنترل، روند و شواهد.'],
      ['برنامه‌های پاسخ به ریسک', 'اقدام، مسئول، بودجه، پیشرفت و امتیاز باقی‌ماندهٔ مورد انتظار.'],
      ['کنترل‌ها و انطباق', 'اثربخشی طراحی و اجرا، آزمون کنترل، شواهد و نتیجهٔ آزمون (COSO).']
    ]},
    { name: 'اجرا، منابع و منافع', icon: 'i-box', c: 'c-violet', items: [
      ['ابتکارات راهبردی', 'برنامه‌های تغییر با بودجه، پیشرفت، اولویت و وضعیت سلامت RAG.'],
      ['پروژه‌ها', 'فاز/دروازه، خروجی‌های کلیدی، حامی و مدیر، بودجه و سلامت RAG.'],
      ['وظایف و اقدامات', 'Task برای هر کارمند با اتصال به هدف، فرآیند، ابتکار، پروژه و شاخص.'],
      ['منابع و بودجه', 'تخصیص و مصرف بودجه، نیروی انسانی، زمان، فناوری و تجهیزات.'],
      ['تحقق منافع', 'تفکیک تحویل پروژه از تحقق واقعی منفعت: ارزش پایه، مورد انتظار و محقق‌شده.']
    ]},
    { name: 'حاکمیت، تصمیم و اسناد', icon: 'i-clipboard', c: 'c-amber', items: [
      ['حاکمیت و جلسات', 'هیئت‌مدیره و کمیته‌ها، اختیارات، حد نصاب، دستور جلسه و صورت‌جلسه.'],
      ['تصمیمات و مصوبات', 'منطق تصمیم، مسئول اجرا، مهلت و اتصال به استراتژی، هدف، شاخص و ریسک.'],
      ['گردش‌کار و تأیید', 'مراحل، قواعد انتقال، تأییدکنندگان و SLA هر مرحله.'],
      ['اسناد و شواهد', 'SOP، خط‌مشی، روش اجرایی، فرم، مقرره و شواهد با نسخه و تاریخ بازنگری.']
    ]},
    { name: 'بهبود، تغییر و داده', icon: 'i-spark', c: 'c-green', items: [
      ['بهبود و اقدامات اصلاحی', 'ایده بهبود، تحلیل علت ریشه‌ای، CAPA، بنچمارک و اثربخشی پس از اجرا.'],
      ['مدیریت تغییر', 'امتیاز آمادگی، واحدها و فرآیندهای متأثر، مقاومت و برنامهٔ ارتباطات.'],
      ['قابلیت و شایستگی', 'سطح فعلی و هدف، شکاف و برنامهٔ توسعه/آموزش متصل به استراتژی.'],
      ['داده و یکپارچه‌سازی', 'منابع ERP/CRM/HRIS، پایگاه‌داده، Excel و REST API با مالک، تبار و تبدیلات داده.']
    ]},
    { name: 'ارزیابی، بلوغ و هشدار', icon: 'i-award', c: 'c-violet', items: [
      ['ارزیابی و بلوغ', 'EFQM، بلوغ فرآیند، داده، دیجیتال، آمادگی هوش مصنوعی و بلوغ استراتژی.'],
      ['معیارهای سالانهٔ EFQM', 'درخت معیار و زیرمعیار با وزن و حداکثر امتیاز برای هر شرکت و هر سال.'],
      ['RAID و هشدارها', 'ریسک، فرض، مسئله، وابستگی و هشدار زودهنگام با شدت و محرک هشدار.']
    ]},
    { name: 'نماها و ابزارهای سیستمی', icon: 'i-database', c: 'c-indigo', items: [
      ['داشبورد', 'تصویر یکپارچهٔ سلامت استراتژی و ورود سریع به هر بخش.'],
      ['بلوغ و انطباق', 'ارزیابی ۹ بُعدی با ۶۸ معیار، نردبان پنج‌سطحی، شواهد و اقدام پیشنهادی.'],
      ['مدیریت دسترسی', 'کنترل دسترسی کاربران در سه سطح ماژول، واحد سازمانی و دورهٔ پایش.']
    ]}
  ];

  var METHODS = [
    ['درصد تحقق', 'ساده‌ترین و رایج‌ترین روش', 'Balanced Scorecard', 'افزایشی: min(۱۰۰ , واقعی ÷ هدف × ۱۰۰) — کاهشی: min(۱۰۰ , هدف ÷ واقعی × ۱۰۰)'],
    ['میانگین وزنی', 'وقتی شاخص‌ها اهمیت متفاوت دارند', 'Weighted Scorecard', 'امتیاز = Σ(امتیاز شاخص × وزن) ÷ Σ(وزن)'],
    ['RAG (چراغ راهنما)', 'گزارش‌دهی مدیریتی و داشبورد اجرایی', 'RAG Reporting', 'تحقق‌یافته ۱۰۰ · نزدیک هدف ۸۰ · نیازمند توجه ۶۰ · بحرانی ۳۰ · عدم تحقق ۰'],
    ['آستانه‌ای', 'اهداف انطباقی و SLA: رسیدن یا نرسیدن', 'Threshold / Banded', 'a ≥ سبز → ۱۰۰ · a ≥ زرد → ۸۰ · a ≥ قرمز → ۵۰ · پایین‌تر → ۰'],
    ['خطی', 'هر میزان پیشرفت، همان نسبت امتیاز', 'Linear Proportional', 'نسبت خطیِ تحقق تا سقف ۱۰۰ (بدون شکست در میانه)'],
    ['غیرخطی', 'اهداف کششی و تحولی', 'Non-linear / Stretch', 'امتیاز = ۱۰۰ × √(a ÷ ۱۰۰) — پیشرفت‌های میانی پاداش بیشتری می‌گیرند'],
    ['فرمول سفارشی', 'سازمان‌هایی که فرمول اختصاصی دارند', 'Custom Formula', 'فرمول دلخواه با متغیرهای a، x، g، w و توابع min/max/sqrt/abs/round']
  ];

  var DIMS = [
    ['جهت‌گیری و رهبری', 'Hoshin Kanri · ISO 9001 §5', '1.3'],
    ['تحلیل و تدوین استراتژی', 'SWOT · PESTEL · Porter · Scenario', '1.2'],
    ['نقشهٔ استراتژی و کارت امتیازی', 'Kaplan & Norton BSC & Strategy Map', '1.3'],
    ['شاخص‌ها و سنجه‌ها', 'SMART · KPI dictionary', '1.4'],
    ['هدف‌گذاری و پایش عملکرد', 'Baseline→Target→Stretch · Data governance', '1.4'],
    ['مدیریت ریسک', 'ISO 31000 · COSO ERM', '1.2'],
    ['اجرا، منابع و حاکمیت', 'PMI portfolio · Hoshin catchball', '1.2'],
    ['ارزیابی، یادگیری و بهبود', 'EFQM 2020 RADAR · ISO 9001 §10 · ISO 30414', '1.1'],
    ['ذی‌نفعان و ارتباطات', 'ISO 9001 §4.2 · Mendelow · ADKAR', '1.0']
  ];

  var CYCLE = [
    ['جهت‌گیری و تدوین', 'ترسیم مقصد سازمان و تحلیل محیط', ['جهت‌گیری استراتژیک', 'تحلیل استراتژیک', 'سناریو و فرضیات'], 'i-compass'],
    ['ترجمه به اهداف و شاخص', 'آبشاری‌سازی استراتژی تا سطح سنجه', ['استراتژی‌ها و چارچوب اجرا', 'کارت امتیازی متوازن', 'اهداف / OKR', 'شاخص‌ها و اهداف دوره‌ای'], 'i-target'],
    ['پایش و امتیازدهی', 'اندازه‌گیری دوره‌ای و محاسبهٔ خودکار امتیاز', ['دوره‌های پایش', 'اندازه‌گیری عملکرد', 'مدل امتیازدهی', 'تابلوی امتیاز'], 'i-chart'],
    ['ارزیابی و بهبود', 'سنجش بلوغ، اصلاح و یادگیری سازمانی', ['ارزیابی و بلوغ', 'بلوغ و انطباق', 'بهبود و اقدامات اصلاحی', 'مدیریت تغییر'], 'i-award']
  ];

  var STANDARDS = [
    ['کارت امتیازی متوازن (BSC)', 'منطق چهار منظر مالی، مشتری، فرآیندهای داخلی و یادگیری و رشد با وزن‌دهی و تجمیع امتیاز.', 'کارت امتیازی متوازن · نقشهٔ استراتژی · تابلوی امتیاز', 'i-layers'],
    ['نقشهٔ استراتژی', 'زنجیرهٔ علت‌ومعلولی اهداف؛ اعتبارسنجی فرض «اگر این را بهبود دهیم، آن بهتر می‌شود».', 'نقشهٔ استراتژی · مدل امتیازدهی', 'i-network'],
    ['OKR', 'اهداف و نتایج کلیدی با امتیاز ۰ تا ۱، اطمینان و Check-in دوره‌ای.', 'مدیریت OKR', 'i-target'],
    ['Hoshin Kanri', 'آبشاری‌سازی جهت‌گیری سازمانی به پایین و بازخورد (catchball) از پایین به بالا.', 'جهت‌گیری استراتژیک · مدل امتیازدهی · حاکمیت', 'i-compass'],
    ['EFQM 2020 و منطق RADAR', 'خودارزیابی و امتیازدهی سطوح بر پایهٔ سقف ۱۰۰ و آستانه‌های سبز/زرد/قرمز.', 'ارزیابی و بلوغ · معیارهای سالانهٔ EFQM', 'i-award'],
    ['ISO 31000', 'چرخهٔ مدیریت ریسک: شناسایی، ارزیابی ذاتی و باقی‌مانده، پاسخ و پایش.', 'ریسک‌ها · اشتها و تحمل ریسک · ارزیابی‌ها', 'i-shield'],
    ['COSO ERM', 'کنترل داخلی، آزمون اثربخشی طراحی و اجرا، و مستندسازی شواهد انطباق.', 'کنترل‌ها و انطباق', 'i-clipboard'],
    ['ISO 9001', 'رویکرد فرآیندی، ذی‌نفعان (§4.2)، رهبری (§5)، پایش و بهبود (§9 و §10).', 'فرآیندها · ذی‌نفعان · حاکمیت · بهبود', 'i-workflow'],
    ['ISO 30414', 'راهنمای گزارش‌دهی سرمایهٔ انسانی و سنجه‌های نیروی کار.', 'کارکنان و سمت‌ها · قابلیت و شایستگی', 'i-users'],
    ['PMI و مدیریت سبد', 'مدیریت سبد ابتکارات و پروژه‌ها از ایده تا تحقق منافع کسب‌وکار.', 'ابتکارات · پروژه‌ها · منابع و بودجه · تحقق منافع', 'i-box']
  ];

  var FAQ = [
    ['STRATIVA برای چه سازمان‌هایی مناسب است؟',
     'برای شرکت‌ها، هلدینگ‌ها و واحدهای PMO یا دفتر مدیریت عملکرد که می‌خواهند استراتژی را عملیاتی و اندازه‌پذیر کنند. ساختار سازمانی چندسطحی، واحد سازمانی و کنترل دسترسی، سامانه را برای گروه‌های چندشرکتی مناسب کرده است.'],
    ['آیا می‌توانیم چارچوب مدیریتی خودمان را داشته باشیم؟',
     'بله. «کتابخانهٔ چارچوب‌های اجرا» اجازه می‌دهد BSC، OKR، OGSM، Hoshin Kanri یا یک چارچوب «سفارشی / ترکیبی» تعریف کنید و موجودیت‌ها، سطوح آبشاری، گردش‌کار، قواعد اعتبارسنجی و پیکربندی داشبورد آن را ثبت کنید.'],
    ['امتیازدهی عملکرد چگونه و چه زمانی محاسبه می‌شود؟',
     'بلافاصله. با ثبت هدف دوره‌ای و عملکرد واقعی، امتیاز هر شاخص با روش انتخابی مدل (درصد تحقق، وزنی، RAG، آستانه‌ای، خطی، غیرخطی یا فرمول سفارشی) محاسبه و در سطوح هدف، کارت امتیازی/استراتژی، واحد و سازمان تجمیع می‌شود.'],
    ['مدل امتیازدهی چه کنترل‌هایی دارد؟',
     'سقف امتیاز (جلوگیری از باد کردن امتیاز با یک شاخص)، نرمال‌سازی مجموع وزن‌ها، آستانه‌های سبز/زرد/قرمز، حداقل پوشش داده و گزارش «درصد پوشش داده» در هر سطح تا نتیجه درست تفسیر شود.'],
    ['داده‌ها از سیستم‌های دیگر چطور وارد می‌شوند؟',
     'ماژول «داده و یکپارچه‌سازی» منابع ERP، CRM، HRIS، پایگاه‌داده، Excel، CSV و REST API را با مالک داده، تناوب دریافت، قواعد تبدیل و شرح تبار داده ثبت می‌کند؛ ورود گروهی مقادیر هم برای ثبت سریع دوره‌ای وجود دارد.'],
    ['آیا ریسک و انطباق هم پوشش داده شده است؟',
     'بله. ریسک ذاتی و باقی‌مانده، بیانیهٔ اشتهای ریسک، ارزیابی‌های دوره‌ای، برنامه‌های پاسخ و کنترل‌های انطباق با آزمون اثربخشی طراحی و اجرا — بر پایهٔ ISO 31000 و COSO ERM.'],
    ['بلوغ سازمانی چگونه سنجیده می‌شود؟',
     'موتور بلوغ، سازمان را در ۹ بُعد و ۶۸ معیار ارزیابی می‌کند. امتیاز هر معیار از رکوردهای واقعی سامانه محاسبه می‌شود؛ پس اگر بخشی هنوز داده ندارد، امتیاز پایین‌تر می‌آید. هر معیار شواهد، مرجع استاندارد و اقدام پیشنهادی دارد و نتیجه در نردبان پنج‌سطحی نمایش داده می‌شود.'],
    ['امنیت و کنترل دسترسی چگونه است؟',
     'دسترسی کاربران در سه سطح کنترل می‌شود: ماژول‌ها، واحدهای سازمانی و دوره‌های پایش. رابط کاربری کامل فارسی و راست‌به‌چپ است و خروجی چاپ/PDF برای گزارش‌های مدیریتی و هیئت‌مدیره در دسترس است.']
  ];

  /* ── render: module catalogue ──────────────────────────────────────────── */
  var grid = d.getElementById('moduleGrid');
  var chips = d.getElementById('domainChips');

  if (grid && chips) {
    DOMAINS.forEach(function (dom, di) {
      dom.items.forEach(function (it) {
        var card = el('article', 'module');
        card.setAttribute('data-domain', String(di));

        var top = el('div', 'module-top');
        var badge = el('span', 'module-badge ' + dom.c);
        badge.appendChild(icon(dom.icon));
        top.appendChild(badge);

        var head = el('div');
        head.appendChild(txt('h4', null, it[0]));
        head.appendChild(txt('span', 'mdom', dom.name));
        top.appendChild(head);

        card.appendChild(top);
        card.appendChild(txt('p', null, it[1]));
        grid.appendChild(card);
      });
    });

    var chipAll = el('button', 'chip active');
    chipAll.type = 'button';
    chipAll.setAttribute('data-domain', 'all');
    chipAll.setAttribute('aria-pressed', 'true');
    chipAll.appendChild(txt('span', null, 'همهٔ دامنه‌ها'));
    var total = DOMAINS.reduce(function (n, x) { return n + x.items.length; }, 0);
    chipAll.appendChild(txt('span', 'n', fa(total)));
    chips.appendChild(chipAll);

    DOMAINS.forEach(function (dom, di) {
      var b = el('button', 'chip');
      b.type = 'button';
      b.setAttribute('data-domain', String(di));
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(icon(dom.icon, 'ic'));
      b.appendChild(txt('span', null, dom.name));
      b.appendChild(txt('span', 'n', fa(dom.items.length)));
      chips.appendChild(b);
    });

    chips.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('.chip') : null;
      if (!btn || !chips.contains(btn)) return;
      var want = btn.getAttribute('data-domain');

      Array.prototype.forEach.call(chips.querySelectorAll('.chip'), function (c) {
        var on = c === btn;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var cards = grid.querySelectorAll('.module');
      var shown = 0;
      Array.prototype.forEach.call(cards, function (card) {
        var match = (want === 'all') || (card.getAttribute('data-domain') === want);
        card.style.display = match ? '' : 'none';
        if (match) {
          shown++;
          /* re-trigger the entrance animation */
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
          card.style.animationDelay = (shown * 22) + 'ms';
        }
      });
    });
  }

  /* ── render: scoring methods ───────────────────────────────────────────── */
  var methods = d.getElementById('methods');
  if (methods) {
    METHODS.forEach(function (m) {
      var box = el('article', 'method');

      var top = el('div', 'method-top');
      top.appendChild(icon('i-scale'));
      top.appendChild(txt('b', null, m[0]));
      top.appendChild(txt('span', 'method-tag', m[2]));
      box.appendChild(top);

      box.appendChild(txt('small', null, m[1]));
      box.appendChild(txt('div', 'method-code', m[3]));
      methods.appendChild(box);
    });
  }

  /* ── render: maturity dimensions ───────────────────────────────────────── */
  var dims = d.getElementById('dims');
  if (dims) {
    DIMS.forEach(function (x) {
      var row = el('div', 'dim');
      var left = el('div');
      left.appendChild(txt('div', 'dim-name', x[0]));
      left.appendChild(txt('div', 'dim-meta', x[1]));
      row.appendChild(left);
      row.appendChild(txt('span', 'dim-w', 'وزن ' + x[2]));
      dims.appendChild(row);
    });
  }

  /* ── render: cycle ─────────────────────────────────────────────────────── */
  var cycle = d.getElementById('cycleSteps');
  if (cycle) {
    CYCLE.forEach(function (s, i) {
      var box = el('article', 'cycle-step reveal');
      var num = el('div', 'cnum');
      num.appendChild(icon(s[3]));
      box.appendChild(num);
      box.appendChild(txt('h3', null, fa(i + 1) + '. ' + s[0]));
      box.appendChild(txt('p', null, s[1]));

      var ul = el('ul');
      s[2].forEach(function (li) { ul.appendChild(txt('li', null, li)); });
      box.appendChild(ul);
      cycle.appendChild(box);
    });
  }

  /* ── render: standards ─────────────────────────────────────────────────── */
  var stds = d.getElementById('standards-grid');
  if (stds) {
    STANDARDS.forEach(function (s) {
      var box = el('div', 'std reveal');
      var ic = el('span', 'std-ic');
      ic.appendChild(icon(s[3]));
      box.appendChild(ic);

      var body = el('div');
      body.appendChild(txt('b', null, s[0]));
      body.appendChild(txt('p', null, s[1]));
      body.appendChild(txt('span', 'where', 'در سامانه: ' + s[2]));
      box.appendChild(body);
      stds.appendChild(box);
    });
  }

  /* ── render: faq ───────────────────────────────────────────────────────── */
  var faqList = d.getElementById('faq-list');
  if (faqList) {
    FAQ.forEach(function (q, i) {
      var item = el('div', 'faq-item');
      var btn = el('button', 'faq-q');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'faq-a-' + i);
      btn.appendChild(txt('span', null, q[0]));
      btn.appendChild(icon('i-chevron'));

      var panel = el('div', 'faq-a');
      panel.id = 'faq-a-' + i;
      panel.appendChild(txt('div', 'faq-a-inner', q[1]));

      item.appendChild(btn);
      item.appendChild(panel);
      faqList.appendChild(item);

      btn.addEventListener('click', function () {
        var open = item.classList.contains('open');
        Array.prototype.forEach.call(faqList.querySelectorAll('.faq-item.open'), function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0px';
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── navbar behaviour ──────────────────────────────────────────────────── */
  var nav = d.getElementById('nav');
  var navToggle = d.getElementById('navToggle');
  var navLinks = d.getElementById('navLinks');

  function onScrollNav() {
    var y = window.scrollY || root.scrollTop || 0;
    if (nav) nav.classList.toggle('scrolled', y > 14);

    var toTop = d.getElementById('toTop');
    if (toTop) toTop.classList.toggle('show', y > 620);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navLinks && nav) {
    navLinks.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        nav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  d.addEventListener('click', function (ev) {
    if (!nav || !nav.classList.contains('open')) return;
    if (!nav.contains(ev.target)) {
      nav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  var toTopBtn = d.getElementById('toTop');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* active nav link while scrolling */
  var sections = Array.prototype.slice.call(d.querySelectorAll('main section[id]'));
  if (sections.length && 'IntersectionObserver' in window && navLinks) {
    var linkFor = {};
    Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function (a) {
      linkFor[a.getAttribute('href').slice(1)] = a;
    });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function (a) { a.classList.remove('active'); });
        var a = linkFor[e.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── scroll reveal + counters ───────────────────────────────────────────── */
  var revealables = Array.prototype.slice.call(d.querySelectorAll('.reveal'));
  var counters = Array.prototype.slice.call(d.querySelectorAll('.count'));
  var vh = function () { return window.innerHeight || root.clientHeight || 800; };

  function inView(node, slack) {
    var r = node.getBoundingClientRect();
    return r.top < vh() - (slack || 20) && r.bottom > -40;
  }

  function activate() {
    if (revealables) {
      revealables.forEach(function (n, i) {
        if (n.classList.contains('in')) return;
        if (!inView(n)) return;
        /* stagger the elements that are visible on first paint */
        if (n.closest && n.closest('.hero')) n.style.transitionDelay = Math.min(i, 5) * 90 + 'ms';
        n.classList.add('in');
      });
    }
    if (counters) {
      counters.forEach(function (c) {
        if (c.getAttribute('data-done')) return;
        if (!inView(c, 80)) return;
        c.setAttribute('data-done', '1');
        runCounter(c);
      });
    }
  }

  /* run on the first frames, on scroll/resize (rAF-throttled), and once more
     as a safety net — content is never left hidden if IntersectionObserver
     is unavailable, throttled, or the document is not being rendered. */
  var ticking = false;
  function onScrollActivate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; activate(); });
  }
  window.addEventListener('scroll', onScrollActivate, { passive: true });
  window.addEventListener('resize', onScrollActivate, { passive: true });
  window.addEventListener('load', activate);
  requestAnimationFrame(activate);
  [120, 420, 1000, 2200].forEach(function (t) { window.setTimeout(activate, t); });

  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealables.forEach(function (n) { if (!n.classList.contains('in')) revObs.observe(n); });

    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.getAttribute('data-done')) return;
        e.target.setAttribute('data-done', '1');
        runCounter(e.target);
        cObs.unobserve(e.target);
      });
    }, { threshold: .35 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    activate();
  }

  function runCounter(node) {
    var to = parseInt(node.getAttribute('data-to'), 10) || 0;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { node.textContent = fa(to); return; }
    var t0 = null, dur = 1100;
    requestAnimationFrame(function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      node.textContent = fa(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    });
  }

  /* ── footer year (Gregorian → Jalali, approximated for the label) ──────── */
  var year = d.getElementById('year');
  if (year) {
    var jy = new Date().getFullYear() - 621;
    year.textContent = String(jy).replace(/\d/g, function (dg) { return '۰۱۲۳۴۵۶۷۸۹'[+dg]; });
  }
})();
