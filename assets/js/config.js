'use strict';
/* =====================================================================
   КОНФІГУРАЦІЯ САЙТУ
   Усе, що позначено DEMO, — тимчасові дані. Замініть реальними значеннями.
   ===================================================================== */
const CONFIG = {
  brand: { name: 'RDK', suffix: 'candle' },
  showDemoNotice: true,                 // DEMO: вимкніть, коли дані тари й палітри стануть реальними

  // Продукт: одна склянка, один об’єм. Покупцеві показуємо «Свічка 200 мл».
  product: { name: 'Свічка 200 мл', fillMl: 200, containerMl: 250, wax: 'Соєвий віск' },   // віск — стандартний, не обирається

  // Ґніт: покупець обирає один варіант. surcharge — доплата за шт (0 — без доплати).
  wicks: [
    { id: 'cotton', name: 'Бавовняний', desc: 'Класичне рівне полум’я', surcharge: 0 },
    { id: 'wood',   name: 'Дерев’яний', desc: 'Широке полум’я й тихе потріскування', surcharge: 0 }
  ],
  defaultWickId: 'cotton',

  // Пропорції склянки взяті з фото тари («кості» мокапа): висота до діаметра, еліпси вінець і дна, звуження донизу.
  // Абсолютні мм поки демонстраційні: на сайті не показуються. Замініть даними з креслення, коли їх уточнять.
  vessel: {
    demo: true,
    name: 'Скляна тара місткістю 250 мл',
    diameterMm: 80,
    heightMm: 77.5,                     // з фото: (дно − вінця) / радіус × 40
    ellipseTop: 0.1861,              // вертикальна піввісь еліпса вінець / радіус
    ellipseBottom: 0.1935,           // те саме для дна (перспектива)
    taper: 0.9628,                   // видиме звуження дна відносно вінець (перспектива)
    printArea: {
      wrap: true,                       // true — друк по колу (360°), ширина зони = довжина кола π·D
      heightMm: 56,
      offsetFromBottomMm: 12,
      widthMm: 100                      // ширина фронтальної зони; лише при wrap: false
    }
  },

  // Базові кольори склянки (колір чи покриття скла, не воску).
  // finish: 'clear' — прозоре скло, 'gloss' — глянцеве покриття, 'satin' — сатинове покриття.
  colors: [
    { id: 'clear', name: 'Прозора', hex: '#E4EAE7', clear: true, finish: 'clear' },
    { id: 'black', name: 'Чорна',   hex: '#151517', finish: 'gloss' },
    { id: 'white', name: 'Біла',    hex: '#F3F1EC', finish: 'satin' }
  ],
  defaultColorId: 'clear',

  // Індивідуальний колір: не гарантований стандартними умовами, погоджується окремо.
  customColor: {
    enabled: true,
    name: 'Інший колір під замовлення',
    defaultPreviewHex: '#B7A08C',
    note: 'Можливість виготовлення, мінімальну кількість, вартість і терміни погодимо окремо. Відтінок на прев’ю орієнтовний.',
    maxRefMb: 10
  },

  // Аромати в наявності (великі кількості). Групи й описи можна змінювати; available: false — показується, але не обирається.
  // other — варіант «Інший аромат за запитом» з полем опису.
  scents: {
    demo: false,
    groups: [
      { id: 'fruit', name: 'Фруктові та ягідні', items: [
        { id: 'cherry', name: 'Вишня', desc: 'Соковитий ягідний, трохи терпкий', available: true },
        { id: 'strawberry', name: 'Полуниця', desc: 'Солодкий і свіжий ягідний', available: true },
        { id: 'blueberry', name: 'Чорниця', desc: 'М’який ягідний із прохолодною ноткою', available: true },
        { id: 'mango', name: 'Манго', desc: 'Стиглий, солодкий тропічний', available: true },
        { id: 'tropical', name: 'Тропічні фрукти', desc: 'Яскравий мікс екзотичних фруктів', available: true },
        { id: 'fruits', name: 'Фрукти', desc: 'Легкий фруктовий мікс', available: true },
        { id: 'prosecco', name: 'Просекко', desc: 'Ігристий, свіжий, фруктовий', available: true } ]},
      { id: 'citrus', name: 'Цитрусові та пряні', items: [
        { id: 'grapefruit', name: 'Грейпфрут', desc: 'Свіжий цитрус із легкою гірчинкою', available: true },
        { id: 'lavender-lemon', name: 'Лаванда-Лимон', desc: 'Трав’яна лаванда з бадьорим лимоном', available: true },
        { id: 'coriander', name: 'Коріандр', desc: 'Пряний, трав’яний, теплий', available: true } ]},
      { id: 'floral', name: 'Квіткові та зелені', items: [
        { id: 'rose', name: 'Троянда', desc: 'Класичний квітковий', available: true },
        { id: 'violet', name: 'Фіалка', desc: 'Ніжний, пудровий квітковий', available: true },
        { id: 'strelitzia', name: 'Стреліція', desc: 'Яскравий екзотичний квітковий', available: true },
        { id: 'monstera', name: 'Монстера', desc: 'Зелений, свіжий, листяний', available: true } ]},
      { id: 'fresh', name: 'Свіжі та чисті', items: [
        { id: 'cotton', name: 'Бавовна', desc: 'Чистий і м’який, як свіжа білизна', available: true },
        { id: 'sea-breeze', name: 'Морський бриз', desc: 'Прохолодний, свіжий, морський', available: true },
        { id: 'spa', name: 'Спа', desc: 'Спокійний, чистий, розслабляючий', available: true } ]},
      { id: 'gourmand', name: 'Теплі та гурманські', items: [
        { id: 'tobacco-vanilla', name: 'Табак-Ваніль', desc: 'Глибокий тютюн і тепла ваніль', available: true },
        { id: 'sandal-vanilla', name: 'Сандал-Ваніль', desc: 'Кремовий деревний із ваніллю', available: true },
        { id: 'coconut', name: 'Кокос', desc: 'Солодкий, кремовий, тропічний', available: true },
        { id: 'blackberry-pie', name: 'Ожиновий пиріг', desc: 'Ягоди й тепла випічка', available: true } ]}
    ],
    other: { enabled: true, name: 'Інші — за запитом', note: 'Можливість виготовлення з іншим ароматом уточнимо окремо.' }
  },

  // Фотомокап: реальне фото прозорої склянки. Чорна, біла й індивідуальний колір будуються з цього ж фото
  // (покриття + світлотінь і відблиски з фото), тож модель однакова всюди. Калібрування — у пікселях зображення base.
  // photos — необов’язкові окремі фото для конкретного кольору з тими самими полями.
  mockup: {
    photo: {
      src: window.MOCKUP_ASSETS.base, shade: window.MOCKUP_ASSETS.shade, dark: window.MOCKUP_ASSETS.dark,
      highlights: window.MOCKUP_ASSETS.hl, wickPatch: window.MOCKUP_ASSETS.patch,
      cx: 432, rimY: 97, rimA: 403, rimB: 75,     // центр і піввісі еліпса вінець
      lipA: 408, lipB: 77, innerA: 387, innerB: 69,      // зовнішній і внутрішній край вінець
      wax: {"cy": 162, "a": 382, "b": 40},                // видима поверхня воску
      wickTip: [431, 83], wickBase: [431, 180],
      patch: {"x": 400, "y": 60},                       // де лежить латка, що ховає бавовняний ґніт
      highlight: { clear: 0.5, gloss: 1.7, satin: 0.55, custom: 0.8 }   // сила відблисків з фото за типом покриття
    },
    photos: {}
  },

  // Кольори друку для швидкого вибору (довільний колір теж доступний).
  printColors: [
    { name: 'Чорнильний', hex: '#1F1D1B' }, { name: 'Білий', hex: '#FFFFFF' },
    { name: 'Охра', hex: '#B08443' },       { name: 'Винний', hex: '#8C2F39' },
    { name: 'Хвойний', hex: '#2F4A3A' },    { name: 'Синій', hex: '#233A63' },
    { name: 'Кремовий', hex: '#EADFC8' }
  ],

  print: {
    targetDpi: 300,                     // роздільність виробничого макета
    goodDpi: 220,                       // від цього значення якість вважаємо достатньою
    minDpi: 150,                        // нижче — попередження про недостатню якість
    maxFileMb: 20,
    minImagePx: 200,
    maxImagePx: 12000
  },

  // Ціни за штуку залежно від кількості. tiers: від скількох штук діє ціна (за зростанням min).
  // approved: false — ціни показуються як орієнтовні з приміткою note.
  // scentSurcharge — доплата за аромат за шт (0 — включено в ціну).
  // quoteFromQty — від цієї кількості показувати «індивідуальний розрахунок» замість суми (null — не використовувати).
  // enabled: false — калькулятор вимикається, на сайті знову «Отримати розрахунок».
  // Прев’ю в конструкторі: свічка повільно обертається, поки покупець нічого не редагує.
  preview: { autoSpin: true, degPerSec: 16, resumeAfterMs: 4000 },

  pricing: {
    enabled: true,
    approved: false,
    currency: 'грн',
    tiers: [
      { min: 1,  price: 800 },
      { min: 2,  price: 500 },          // до 10 шт
      { min: 10, price: 300 }           // від 10 до 99 шт
    ],
    scentSurcharge: 0,
    quoteFromQty: 100,                  // від цієї кількості — індивідуальний розрахунок
    note: 'Орієнтовна ціна. Остаточну вартість підтвердимо після погодження макета.',
    customColorNote: 'Вартість індивідуального кольору склянки розрахуємо окремо.'
  },

  order: {
    unitPrice: null,                    // застаріле: використовується лише якщо pricing.enabled = false
    currency: 'грн',
    minQty: null,                       // мінімальна кількість, якщо є
    leadTime: null,                     // наприклад '5–7 робочих днів'
    // Адреса для приймання заявок (multipart/form-data: payload + файли).
    // Наприклад Netlify Function, що створює замовлення в CRM. Поки null — заявки не надсилаються.
    endpoint: null
  },

  contacts: { phone: null, email: null, instagram: null },  // покажуться у футері та після заявки
  privacyUrl: null                                          // посилання на політику обробки даних
};
