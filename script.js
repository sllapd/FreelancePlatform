// Курс валюти для автоматичного перерахунку цін із доларів у гривні
const UAH_RATE = 41.5;


// Поле для збереження базового Google Client ID (для авторизації OAuth 2.0)
const DEFAULT_GOOGLE_CLIENT_ID = '1049187668087-avtsf7i7kqa3r5f39eam9rfjfqfe8fla.apps.googleusercontent.com';

// Функція генерації стандартної SVG-аватарки (силует користувача), закодованої через encodeURIComponent
function getDefaultAvatar(bgHex = 'cbd5e1', fgHex = '64748b') {
    const cleanBg = bgHex.replace('#', '');
    const cleanFg = fgHex.replace('#', '');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='60' fill='#${cleanBg}'/><circle cx='60' cy='45' r='22' fill='#${cleanFg}'/><path d='M20 108c0-22 18-36 40-36s40 14 40 36' fill='#${cleanFg}'/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DEFAULT_AVATAR = getDefaultAvatar('e2e8f0', '64748b');

// Допоміжна функція для коректного формування посилань між сторінками
function resolvePagePath(pageFileName) {
    return pageFileName;
}

// Функція стиснення завантажених із комп'ютера фотографій через HTML5 Canvas (щоб не переповнити пам'ять localStorage)
function compressUploadedImage(file, maxWidth = 900, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Базовий масив із 54 готових оголошень (поділений на 5 категорій: Розробка, Дизайн, Маркетинг, ШІ та Дані, Стратегія)
const defaultServices = [
    { id: 's1', title: 'Адаптивний лендінг під ключ (HTML/CSS/JS)', cat: 'Розробка', price: 65, time: '3 дні', rating: 4.9, rev: 84, name: 'Олександр С.', city: 'Київ', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', desc: 'Швидка та чиста верстка посадкової сторінки з анімаціями, формою заявки у Telegram та зеленою зоною PageSpeed 95+.' },
    { id: 's2', title: 'Розробка Telegram-бота з оплатою та адмінкою', cat: 'Розробка', price: 45, time: '2 дні', rating: 5.0, rev: 62, name: 'Максим Т.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', desc: 'Створення Telegram-бота на Python (aiogram) або Node.js. Підключення Monobank/LiqPay, розсилки та база користувачів.' },
    { id: 's3', title: 'Корпоративний сайт на WordPress + Elementor', cat: 'Розробка', price: 95, time: '5 днів', rating: 4.8, rev: 51, name: 'Ігор Б.', city: 'Львів', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', desc: 'Повноцінний багатосторінковий сайт зі зручною адмін-панеллю, мультимовністю та базовим SEO-налаштуванням.' },
    { id: 's4', title: 'React / Next.js вебзастосунок або SaaS-дашборд', cat: 'Розробка', price: 180, time: '7 днів', rating: 5.0, rev: 39, name: 'Артем К.', city: 'Київ', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', desc: 'Сучасний фронтенд на React 19, TypeScript та Tailwind CSS. Авторизація, графіки, підключення REST API.' },
    { id: 's5', title: 'Виправлення багів верстки та скриптів JS за 2 години', cat: 'Розробка', price: 20, time: '1 день', rating: 4.9, rev: 128, name: 'Денис М.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80', desc: 'Оперативне усунення проблем з мобільною адаптивністю, формами зворотного зв’язку, слайдерами або консоллю.' },
    { id: 's6', title: 'Інтернет-магазин на Хорошоп / OpenCart / Shopify', cat: 'Розробка', price: 140, time: '6 днів', rating: 4.8, rev: 44, name: 'Володимир С.', city: 'Харків', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', desc: 'Готовий до продажів магазин: каталог, фільтри, інтеграція Нової Пошти, Checkbox ПРРО та онлайн-оплати.' },
    { id: 's7', title: 'Інтеграція сайту з KeyCRM, KeepinCRM або Новою Поштою', cat: 'Розробка', price: 40, time: '2 дні', rating: 4.9, rev: 73, name: 'Роман Г.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', desc: 'Автоматична передача замовлень з лендінгу чи магазину в CRM, генерація ТТН та сповіщення менеджерів.' },
    { id: 's8', title: 'Парсер сайтів або прайсів конкурентів на Python', cat: 'Розробка', price: 35, time: '2 дні', rating: 5.0, rev: 56, name: 'Євген П.', city: 'Вінниця', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80', desc: 'Збір товарів, цін, контактів та фото у таблицю Excel/Google Sheets або JSON за розкладом.' },
    { id: 's9', title: 'Точна верстка з макета Figma у чистий HTML/Tailwind', cat: 'Розробка', price: 30, time: '2 дні', rating: 4.9, rev: 95, name: 'Богдан К.', city: 'Полтава', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80', desc: 'Pixel-perfect верстка за вашим макетом у Figma. Семантичні теги, плавний адаптив під усі екрани.' },
    { id: 's10', title: 'Прискорення сайту до 90–100 балів Google PageSpeed', cat: 'Розробка', price: 35, time: '1 день', rating: 4.8, rev: 67, name: 'Тарас Л.', city: 'Київ', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', desc: 'Оптимізація зображень у WebP, кешування, усунення блокуючих скриптів та покращення Core Web Vitals.' },
    { id: 's11', title: 'Мобільний додаток для iOS та Android на React Native', cat: 'Розробка', price: 290, time: '14 днів', rating: 5.0, rev: 19, name: 'Ілля Р.', city: 'Львів', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', desc: 'Кросплатформний мобільний застосунок з push-сповіщеннями, особистим кабінетом та публікацією у сторах.' },
    { id: 's12', title: 'Інтерактивна 3D-сцена на Three.js / WebGL для сайту', cat: 'Розробка', price: 110, time: '4 дні', rating: 4.9, rev: 31, name: 'Софія К.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', desc: 'Тривимірна візуалізація продукту чи об’єктів у браузері на 60 FPS з керуванням мишкою та скролом.' },
    { id: 's13', title: 'Дизайн логотипу (3 концепти) + векторні вихідники', cat: 'Дизайн', price: 35, time: '2 дні', rating: 4.9, rev: 142, name: 'Марина Л.', city: 'Львів', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', desc: 'Розробка унікального логотипу для бізнесу чи стартапу. Надаю файли у форматах SVG, AI, PDF, PNG.' },
    { id: 's14', title: 'UI/UX дизайн лендінгу у Figma (Десктоп + Мобайл)', cat: 'Дизайн', price: 75, time: '3 дні', rating: 5.0, rev: 88, name: 'Анна Ш.', city: 'Київ', img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80', desc: 'Продуманий прототип і стильний візуал на основі Auto Layout та UI-компонентів, готовий до передачі верстальнику.' },
    { id: 's15', title: 'Пакет 10 рекламних креативів для Instagram / TikTok', cat: 'Дизайн', price: 25, time: '1 день', rating: 4.9, rev: 164, name: 'Катерина Б.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', desc: 'Клікабельні банери для таргетованої реклами у форматах Stories та Reels з високим CTR.' },
    { id: 's16', title: 'Повний фірмовий стиль та брендбук компанії', cat: 'Дизайн', price: 120, time: '5 днів', rating: 4.8, rev: 41, name: 'Дарина М.', city: 'Київ', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', desc: 'Логотип, палітра кольорів, шрифтова пара, патерни, дизайн візитівок, мерчу та оформлення соцмереж.' },
    { id: 's17', title: 'Набір із 5 яскравих обкладинок (Прев’ю) для YouTube', cat: 'Дизайн', price: 15, time: '1 день', rating: 5.0, rev: 210, name: 'Владлен С.', city: 'Харків', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', desc: 'Соковиті CTR-прев’ю з кольорокорекцією, контурним світлом та виразною типографікою.' },
    { id: 's18', title: 'Дизайн інтерфейсу мобільного додатку (до 15 екранів)', cat: 'Дизайн', price: 110, time: '5 днів', rating: 4.9, rev: 37, name: 'Оксана Л.', city: 'Львів', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80', desc: 'Проєктування зручного UX та сучасного UI відповідно до гайдлайнів Apple HIG та Material Design 3.' },
    { id: 's19', title: 'Фотореалістична 3D-візуалізація товару в Blender', cat: 'Дизайн', price: 55, time: '3 дні', rating: 5.0, rev: 49, name: 'Микита З.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80', desc: '3D-моделювання упаковки, гаджетів чи косметики зі студійним рендером у роздільній здатності 4K.' },
    { id: 's20', title: 'Дизайн інвестиційної або бізнес-презентації (15 слайдів)', cat: 'Дизайн', price: 40, time: '2 дні', rating: 4.9, rev: 78, name: 'Вікторія Р.', city: 'Київ', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80', desc: 'Перетворюю сухий текст і таблиці на переконливий Pitch Deck у Figma, PowerPoint або Google Slides.' },
    { id: 's21', title: 'Редизайн існуючого сайту для підвищення продажів', cat: 'Дизайн', price: 65, time: '3 дні', rating: 4.8, rev: 53, name: 'Юлія Г.', city: 'Івано-Франківськ', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', desc: 'Оновлення застарілого візуалу, виправлення помилок юзабіліті та створення свіжого макета у Figma.' },
    { id: 's22', title: 'Дизайн карток товарів для Rozetka, Prom та OLX (10 шт)', cat: 'Дизайн', price: 20, time: '1 день', rating: 4.9, rev: 118, name: 'Аліна К.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80', desc: 'Інфографіка переваг товару, якісна обтравка фото та виділення головних характеристик.' },
    { id: 's23', title: 'Унікальний стікерпак або аватари для Telegram-каналу', cat: 'Дизайн', price: 30, time: '2 дні', rating: 5.0, rev: 64, name: 'Христина Б.', city: 'Тернопіль', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', desc: 'Маскот бренду та 10 фірмових стікерів для підвищення залученості підписників у спільноті.' },
    { id: 's24', title: 'Імпорт та адаптація існуючого сайту у Figma-компоненти', cat: 'Дизайн', price: 25, time: '1 день', rating: 4.9, rev: 42, name: 'Павло Д.', city: 'Київ', img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80', desc: 'Перенесення верстки живого сайту в редаговані шари Figma із впорядкуванням стилів.' },
    { id: 's25', title: 'Налаштування контекстної реклами Google Ads + Shopping', cat: 'Маркетинг', price: 55, time: '3 дні', rating: 4.9, rev: 91, name: 'Олена П.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', desc: 'Збір семантики, мінус-слова, пошукові кампанії та Performance Max для стабільного потоку замовлень.' },
    { id: 's26', title: 'Запуск таргетованої реклами у Facebook та Instagram', cat: 'Маркетинг', price: 50, time: '2 дні', rating: 4.8, rev: 112, name: 'Сергій М.', city: 'Київ', img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80', desc: 'Налаштування Meta Pixel, підбір платоспроможних аудиторій, A/B-тест оферів та оптимізація ціни ліда.' },
    { id: 's27', title: 'Повний SEO-аудит сайту та семантичне ядро', cat: 'Маркетинг', price: 60, time: '3 дні', rating: 4.9, rev: 58, name: 'Андрій Т.', city: 'Львів', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', desc: 'Технічний аналіз помилок індексації, кластеризація ключових слів та план виходу в ТОП-10 Google.' },
    { id: 's28', title: 'Запуск та просування бізнесу в TikTok та Reels', cat: 'Маркетинг', price: 45, time: '3 дні', rating: 5.0, rev: 74, name: 'Валерія Г.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80', desc: 'Сценарії для 15 коротких вертикальних відео, хуки у перші 3 секунди та налаштування TikTok Ads.' },
    { id: 's29', title: 'SMM-стратегія та контент-план на 30 днів', cat: 'Маркетинг', price: 40, time: '2 дні', rating: 4.8, rev: 63, name: 'Наталія П.', city: 'Вінниця', img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80', desc: 'Рубрикатор, теми постів і Stories, оформлення шапки профілю та воронка продажів через Direct.' },
    { id: 's30', title: 'Налаштування веб-аналітики Google Analytics 4 + GTM', cat: 'Маркетинг', price: 30, time: '1 день', rating: 5.0, rev: 89, name: 'Олег К.', city: 'Київ', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', desc: 'Відстеження всіх кліків, відправок форм, покупок e-commerce та передача конверсій у рекламні кабінети.' },
    { id: 's31', title: 'Просування Telegram-каналу або магазину (Під ключ)', cat: 'Маркетинг', price: 35, time: '2 дні', rating: 4.9, rev: 97, name: 'Дмитро О.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=800&q=80', desc: 'Підбір перевірених майданчиків без ботів, написання рекламних постів і закупівля трафіку.' },
    { id: 's32', title: 'Налаштування тригерних Email-розсилок (SendPulse / Klaviyo)', cat: 'Маркетинг', price: 35, time: '2 дні', rating: 4.8, rev: 34, name: 'Ірина С.', city: 'Львів', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', desc: 'Welcome-серія, повернення покинутих кошиків, верстка адаптивних листів та захист від спаму.' },
    { id: 's33', title: 'Оптимізація та просування відео на YouTube (SEO)', cat: 'Маркетинг', price: 25, time: '1 день', rating: 4.9, rev: 52, name: 'Руслан К.', city: 'Харків', img: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80', desc: 'Підбір високочастотних тегів, таймкоди, оптимізація заголовків та описів для органічних рекомендацій.' },
    { id: 's34', title: 'Просування в Threads та X (Twitter) для IT-продуктів', cat: 'Маркетинг', price: 30, time: '3 дні', rating: 4.9, rev: 41, name: 'Ярослав З.', city: 'Київ', img: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80', desc: 'Написання вірусних тредів для органічного залучення клієнтів на цифрові підписки, ПЗ та сервіси.' },
    { id: 's35', title: 'Автоматизація бізнес-процесів та ботів у n8n (Під ключ)', cat: 'ШІ та Дані', price: 50, time: '2 дні', rating: 5.0, rev: 68, name: 'Кирило М.', city: 'Київ', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', desc: 'Створення кастомних workflow у n8n з JavaScript-логікою, вебхуками, моніторингом каналів та інтеграцією API.' },
    { id: 's36', title: 'ШІ-бот підтримки клієнтів на базі ChatGPT / Claude', cat: 'ШІ та Дані', price: 65, time: '3 дні', rating: 5.0, rev: 47, name: 'Назар К.', city: 'Львів', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', desc: 'Навчання AI-асистента на ваших PDF-прайсах та FAQ. Відповідає клієнтам у Telegram та на сайті за 2 секунди.' },
    { id: 's37', title: 'Налаштування сценаріїв автоматизації у Make.com', cat: 'ШІ та Дані', price: 35, time: '1 день', rating: 4.9, rev: 55, name: 'Віталій Х.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', desc: 'Зв’язування Google Таблиць, Notion, Telegram, Gmail та CRM у єдиний безвідмовний конвеєр.' },
    { id: 's38', title: 'Генерація AI-відеоаватарів та озвучки (HeyGen / ElevenLabs)', cat: 'ШІ та Дані', price: 30, time: '1 день', rating: 4.8, rev: 79, name: 'Діана Л.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', desc: 'Створення 5 реалістичних рекламних роликів із цифровим ведучим українською або англійською мовою.' },
    { id: 's39', title: 'Інтерактивний фінансовий дашборд у Looker Studio / Power BI', cat: 'ШІ та Дані', price: 45, time: '2 дні', rating: 4.9, rev: 38, name: 'Гліб С.', city: 'Київ', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', desc: 'Візуалізація продажів, витрат і маржинальності з автоматичним оновленням даних щогодини.' },
    { id: 's40', title: 'Розробка бази знань RAG (Pinecone / Supabase + OpenAI)', cat: 'ШІ та Дані', price: 120, time: '4 дні', rating: 5.0, rev: 22, name: 'Олексій В.', city: 'Харків', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', desc: 'Векторний пошук по тисячах документів компанії з високою точністю відповідей без галюцинацій.' },
    { id: 's41', title: 'Автопостинг контенту з AI-генерацією у Telegram / соцмережі', cat: 'ШІ та Дані', price: 40, time: '2 дні', rating: 4.9, rev: 61, name: 'Станіслав Р.', city: 'Вінниця', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', desc: 'Автоматичний парсинг новин, рерайт через GPT-4o, генерація обкладинки та публікація за розкладом.' },
    { id: 's42', title: 'Пакет системних промптів для відділу продажів і маркетингу', cat: 'ШІ та Дані', price: 20, time: '1 день', rating: 4.8, rev: 94, name: 'Маргарита К.', city: 'Львів', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', desc: '25 протестованих шаблонів промптів для написання оферів, обробки заперечень та аналізу конкурентів.' },
    { id: 's43', title: 'Обробка та очищення таблиць Excel / Google Sheets + макроси', cat: 'ШІ та Дані', price: 25, time: '1 день', rating: 5.0, rev: 83, name: 'Вадим Ч.', city: 'Полтава', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', desc: 'Складні формули QUERY, VLOOKUP, зведені таблиці та скрипти Google Apps Script.' },
    { id: 's44', title: 'ШІ-фотосесія товару (Заміна фону та моделей у Midjourney)', cat: 'ШІ та Дані', price: 25, time: '1 день', rating: 4.9, rev: 71, name: 'Поліна С.', city: 'Київ', img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80', desc: 'Перетворюю звичайні фото на телефон у професійний студійний лукбук для каталогу або Instagram.' },
    { id: 's45', title: 'Динамічний монтаж 10 роликів Reels / TikTok / Shorts', cat: 'Стратегія', price: 40, time: '2 дні', rating: 5.0, rev: 136, name: 'Дмитро В.', city: 'Харків', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80', desc: 'Трендовий монтаж зі стильною анімацією субтитрів, звуковими ефектами (SFX), зумами та саунд-дизайном.' },
    { id: 's46', title: 'Аудит конверсії сайту (CRO) + карта точок зростання', cat: 'Стратегія', price: 55, time: '2 дні', rating: 4.9, rev: 46, name: 'Ростислав Б.', city: 'Київ', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', desc: 'Детальний відео-розбір вашого сайту: чому відвідувачі не купують і що змінити, щоб подвоїти заявки.' },
    { id: 's47', title: 'Продаючий копірайтинг для лендінгу українською та англійською', cat: 'Стратегія', price: 30, time: '2 дні', rating: 4.9, rev: 82, name: 'Соломія Г.', city: 'Львів', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', desc: 'Структура тексту за формулою AIDA/JTBD, сильні заголовки, вигоди та закриття заперечень клієнтів.' },
    { id: 's48', title: 'Налаштування корпоративного простору в Notion для команди', cat: 'Стратегія', price: 35, time: '2 дні', rating: 5.0, rev: 59, name: 'Тимур Л.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80', desc: 'Трекер завдань, база клієнтів, фінансовий облік, регламенти та зручні дашборди в одному місці.' },
    { id: 's49', title: 'Професійний переклад та локалізація сайту (UA / EN / PL)', cat: 'Стратегія', price: 20, time: '1 день', rating: 4.9, rev: 105, name: 'Зоряна П.', city: 'Івано-Франківськ', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', desc: 'Живий переклад інтерфейсів, додатків та статей носієм мови з урахуванням IT-термінології.' },
    { id: 's50', title: 'Ручне та автоматизоване QA-тестування сайту чи додатку', cat: 'Стратегія', price: 30, time: '2 дні', rating: 4.8, rev: 44, name: 'Антон Г.', city: 'Київ', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', desc: 'Перевірка всіх сценаріїв користувача, кросбраузерності, безпеки форм і детальний баг-репорт зі скріншотами.' },
    { id: 's51', title: '2D моушн-дизайн та анімація логотипу (After Effects)', cat: 'Стратегія', price: 35, time: '2 дні', rating: 5.0, rev: 67, name: 'Захар К.', city: 'Одеса', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', desc: 'Плавна інтро-анімація логотипу або промо-ролик для YouTube, сайту та презентацій.' },
    { id: 's52', title: 'Професійна дикторська озвучка роликів (Студійний мікрофон)', cat: 'Стратегія', price: 25, time: '1 день', rating: 4.9, rev: 91, name: 'Олеся Д.', city: 'Львів', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80', desc: 'Чистий запис голосу для реклами, автовідповідача чи YouTube-відео з обробкою звуку.' },
    { id: 's53', title: 'Фінансова модель та бізнес-план для гранту (єРобота / Дія)', cat: 'Стратегія', price: 75, time: '4 дні', rating: 5.0, rev: 53, name: 'Віктор М.', city: 'Київ', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', desc: 'Повний розрахунок окупності, податків та кошторису для успішного отримання державного або міжнародного гранту.' },
    { id: 's54', title: 'Комплексний супровід запуску цифрового продукту', cat: 'Стратегія', price: 90, time: '5 днів', rating: 4.9, rev: 38, name: 'Михайло К.', city: 'Дніпро', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', desc: 'Дорожня карта від ідеї до перших 100 платних клієнтів: офер, воронка, підключення оплат і трафік.' }
];

// Початковий масив заявок на проєкти
const defaultProjects = [];

// Дані для інтерактивного блоку «Як працює платформа» (3 кроки на головній сторінці)
const processSteps = [
    {
        index: '01',
        title: 'Швидкий вибір серед 54+ перевірених послуг',
        subtitle: 'Реальні ринкові ціни від $15 без агентських націнок',
        description: 'Обирайте готове рішення у каталозі з фіксованою ціною або опублікуйте власну заявку на біржі проєктів — виконавці відгукнуться за лічені хвилини.',
        metrics: ['Перевірене портфоліо', 'Прямий зв’язок у чаті', 'Чесні ціни в USD та грн'],
        ctaText: 'Перейти в повний каталог',
        ctaLink: 'catalog.html'
    },
    {
        index: '02',
        title: 'Повний контроль над вашими заявками',
        subtitle: 'Редагуйте, змінюйте бюджет або видаляйте проєкт у будь-який момент',
        description: 'Усі ваші заявки зберігаються у розділі «Мої проєкти» та в особистому профілі. Ви завжди бачите статус виконання та можете миттєво оновити технічне завдання.',
        metrics: ['Збереження у кабінеті', 'Миттєве редагування ТЗ', 'Прозорі дедлайни'],
        ctaText: 'Відкрити Мої проєкти',
        ctaLink: 'projects.html'
    },
    {
        index: '03',
        title: 'Безпечна оплата через систему Escrow',
        subtitle: 'Виконавець отримує кошти лише після вашого схвалення',
        description: 'Кошти резервуються на платформі. Ви перевіряєте результат, тестуєте сайт, бота чи макет у Figma і підтверджуєте виплату в один клік.',
        metrics: ['100% захист бюджету', 'Гарантія повернення коштів', 'Підтримка 24/7'],
        ctaText: 'Створити заявку',
        ctaLink: '#open-brief'
    }
];

// Масив відгуків замовників для головної сторінки
const defaultTestimonials = [
    { name: 'Микола Ф.', role: 'Засновник інтернет-магазину, Київ', metric: 'Бюджет лише $95', text: 'Замовили сайт і налаштування Google Ads. Ціни абсолютно адекватні, а якість у рази вища за дорогі студії!', rating: 5, avatar: DEFAULT_AVATAR },
    { name: 'Світлана М.', role: 'Власниця бренду одягу, Дніпро', metric: 'Запуск за 3 дні', text: 'Дуже зручно, що всі мої заявки видно в особистому кабінеті, можна легко змінити опис чи бюджет. Знайшли чудового таргетолога!', rating: 5, avatar: DEFAULT_AVATAR },
    { name: 'Артем Б.', role: 'Керівник IT-проєкту, Львів', metric: 'Автоматизація n8n за $50', text: 'Авторизувався через Google, оформив профіль і замовив автоматизацію в n8n. Усе працює бездоганно!', rating: 5, avatar: DEFAULT_AVATAR }
];

// Отримання списку власних послуг користувача зі сховища браузера (localStorage)
function getCustomServices() {
    try { return JSON.parse(localStorage.getItem('fh_custom_services') || '[]'); } catch { return []; }
}

// Збереження власних послуг у localStorage та миттєве оновлення сітки каталогу й профілю
function saveCustomServices(list) {
    localStorage.setItem('fh_custom_services', JSON.stringify(list));
    if (typeof window.refreshServiceGrids === 'function') window.refreshServiceGrids();
    if (typeof window.renderProfileCustomServices === 'function') window.renderProfileCustomServices();
    if (typeof window.renderProfileProjects === 'function') window.renderProfileProjects();
}

// Видалення власної послуги за її ID з каталогу та пам'яті браузера
function deleteCustomService(serviceId) {
    const updated = getCustomServices().filter(s => s.id !== serviceId);
    saveCustomServices(updated);
    closeModalById('project-modal');
    showToast('Послугу видалено', 'Ваше оголошення було видалено з каталогу.');
}

// Перевірка коректності аватарки (захист від пошкоджених посилань)
function sanitizeAvatar(av) {
    if (!av || (av.startsWith('data:image/svg+xml') && av.includes('"'))) {
        return DEFAULT_AVATAR;
    }
    return av;
}

// Об'єднання власних послуг користувача та 54 базових послуг в єдиний список із розрахунком ціни в грн
function getAllServices() {
    return [...getCustomServices(), ...defaultServices].map(s => ({
        ...s,
        avatar: sanitizeAvatar(s.avatar),
        priceText: `$${s.price}`,
        uahText: `${Math.round(s.price * UAH_RATE).toLocaleString('uk-UA')} ₴`,
        deliverables: (Array.isArray(s.deliverables) && s.deliverables.length > 0) ? s.deliverables : [
            'Виконання точно за вашим технічним завданням',
            'Передача всіх вихідних файлів та інструкції',
            '2 безкоштовні кола правок включено у вартість',
            'Гарантійна підтримка протягом 7 днів після здачі'
        ]
    }));
}

// Зчитування всіх створених заявок і замовлень із localStorage
function getProjects() {
    try {
        const stored = localStorage.getItem('fh_projects');
        if (stored) return JSON.parse(stored);
    } catch {}
    return defaultProjects;
}

// Збереження оновленого списку заявок у localStorage та оновлення лічильника в шапці
function saveProjects(list) {
    localStorage.setItem('fh_projects', JSON.stringify(list));
    updateHeaderBadges();
    if (typeof window.renderProjectsPage === 'function') window.renderProjectsPage();
    if (typeof window.renderProfileProjects === 'function') window.renderProfileProjects();
}

// Отримання списку ID обраних послуг (сердечка «Обране»)
function getSavedIds() {
    try { return new Set(JSON.parse(localStorage.getItem('fh_saved_ids') || '[]')); } catch { return new Set(); }
}

// Збереження списку обраних послуг у localStorage
function saveSavedIds(setObj) {
    localStorage.setItem('fh_saved_ids', JSON.stringify([...setObj]));
    updateHeaderBadges();
}

// Перевірка поточної сесії: повертає дані авторизованого користувача або null
function getCurrentUser() {
    try {
        const u = localStorage.getItem('fh_current_user');
        if (!u) return null;
        const parsed = JSON.parse(u);
        parsed.avatar = sanitizeAvatar(parsed.avatar);
        return parsed;
    } catch { return null; }
}

// Авторизація або оновлення даних профілю користувача та збереження в базу fh_users
function setCurrentUser(userObj) {
    if (!userObj) {
        localStorage.removeItem('fh_current_user');
    } else {
        userObj.avatar = sanitizeAvatar(userObj.avatar);
        localStorage.setItem('fh_current_user', JSON.stringify(userObj));
        const users = getUsersList();
        const idx = users.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
        if (idx >= 0) users[idx] = { ...users[idx], ...userObj }; else users.push(userObj);
        localStorage.setItem('fh_users', JSON.stringify(users));
        applyAccentTheme(userObj.accentColor || '#2563eb');
    }
    renderAuthHeader();
}

// Отримання списку всіх зареєстрованих акаунтів для перевірки логіна й пароля
function getUsersList() {
    try { return JSON.parse(localStorage.getItem('fh_users') || '[]'); } catch { return []; }
}

// Зчитування збереженого ключа Google Client ID для роботи Google OAuth 2.0
function getGoogleClientId() {
    return localStorage.getItem('fh_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID || '';
}

// Палітра акцентних кольорів сайту, які користувач може змінювати у своєму профілі
const ACCENT_PALETTES = {
    '#2563eb': { main: '#2563eb', hover: '#1d4ed8', soft: '#eff6ff' },
    '#059669': { main: '#059669', hover: '#047857', soft: '#ecfdf5' },
    '#7c3aed': { main: '#7c3aed', hover: '#6d28d9', soft: '#f5f3ff' },
    '#d97706': { main: '#d97706', hover: '#b45309', soft: '#fffbeb' },
    '#e11d48': { main: '#e11d48', hover: '#be123c', soft: '#fff1f2' }
};

// Динамічна зміна CSS-змінних (--accent) для миттєвого перефарбування кнопок та елементів сайту
function applyAccentTheme(hex) {
    const pal = ACCENT_PALETTES[hex] || ACCENT_PALETTES['#2563eb'];
    document.documentElement.style.setProperty('--accent', pal.main);
    document.documentElement.style.setProperty('--accent-hover', pal.hover);
    document.documentElement.style.setProperty('--accent-soft', pal.soft);
    localStorage.setItem('fh_theme_accent', pal.main);
}

// Перевірка поточної теми оформлення: світла (light) або темна (dark)
function getColorMode() {
    return localStorage.getItem('fh_color_mode') || 'light';
}

// Перемикання класу dark-mode на тегу <html> та оновлення іконки сонця/місяця в шапці
function applyColorMode(mode) {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('fh_color_mode', isDark ? 'dark' : 'light');
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = isDark ? '☀️' : '🌙';
        btn.title = isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему';
    });
}

// Обробник кліку по кнопці зміни теми (Світла / Темна)
function toggleColorMode() {
    const nextMode = getColorMode() === 'dark' ? 'light' : 'dark';
    applyColorMode(nextMode);
    showToast(
        nextMode === 'dark' ? 'Темну тему увімкнено 🌙' : 'Світлу тему увімкнено ☀️',
        'Налаштування теми збережено для всіх сторінок.'
    );
}

// Автоматичний запуск збереженої теми та кольору акценту одразу при відкритті сторінки
(function initTheme() {
    const user = getCurrentUser();
    const savedAccent = (user && user.accentColor) || localStorage.getItem('fh_theme_accent') || '#2563eb';
    applyAccentTheme(savedAccent);
    applyColorMode(getColorMode());
})();

// Функція показу спливаючих сповіщень (Toast) у правому нижньому кутку екрана
function showToast(message, subtext = '', linkUrl = '', linkText = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-white rounded-2xl border border-slate-200 text-slate-900 px-5 py-4 shadow-2xl flex items-start gap-3.5 min-w-[290px] max-w-sm transition-all duration-300';
    toast.innerHTML = `
        <span class="w-6 h-6 rounded-full bg-accent-dynamic text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
        <div class="flex-1">
            <div class="text-xs font-bold text-slate-900">${message}</div>
            ${subtext ? `<div class="text-[11px] text-slate-500 mt-0.5">${subtext}</div>` : ''}
            ${linkUrl ? `<a href="${resolvePagePath(linkUrl)}" class="inline-block mt-2 px-3 py-1 rounded-lg bg-accent-dynamic text-white text-xs font-bold shadow-sm hover:opacity-90">${linkText || 'Переглянути →'}</a>` : ''}
        </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

// Оновлення числових лічильників на кнопках «Обране» та «Мої проєкти» у шапці
function updateHeaderBadges() {
    const savedCount = getSavedIds().size;
    const projectsCount = getProjects().length;

    document.querySelectorAll('.saved-count-badge').forEach(el => el.textContent = savedCount);
    document.querySelectorAll('.projects-count-badge').forEach(el => el.textContent = projectsCount);
}

// Генерація правого блоку шапки: кнопка теми, обране, додавання послуги та віджет акаунту з аватаркою
function renderAuthHeader() {
    const headerFlex = document.querySelector('header .max-w-7xl');
    if (headerFlex && !document.getElementById('global-theme-toggle')) {
        const rightGroup = headerFlex.lastElementChild;
        if (rightGroup) {
            const themeBtn = document.createElement('button');
            themeBtn.id = 'global-theme-toggle';
            themeBtn.type = 'button';
            themeBtn.className = 'theme-toggle-btn';
            themeBtn.innerHTML = getColorMode() === 'dark' ? '☀️' : '🌙';
            themeBtn.title = getColorMode() === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему';
            rightGroup.insertBefore(themeBtn, rightGroup.firstChild);
        }
    }

    const container = document.getElementById('header-auth-Slot');
    if (!container) return;

    const parentFlex = container.parentElement;

    if (parentFlex && !document.getElementById('open-saved-btn')) {
        const savedBtn = document.createElement('button');
        savedBtn.id = 'open-saved-btn';
        savedBtn.type = 'button';
        savedBtn.className = 'px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm hover:border-blue-400 transition-all';
        savedBtn.innerHTML = `<span>♥</span><span class="saved-count-badge bg-accent-dynamic text-white px-1.5 py-0.2 rounded-full text-[10px]">0</span>`;
        parentFlex.insertBefore(savedBtn, container);
    }

    if (parentFlex && !document.getElementById('open-add-service-btn')) {
        const srvBtn = document.createElement('button');
        srvBtn.id = 'open-add-service-btn';
        srvBtn.type = 'button';
        srvBtn.className = 'open-add-service-modal-btn hidden md:inline-flex px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-accent-dynamic font-bold text-xs shadow-sm hover:opacity-90 transition-all';
        srvBtn.textContent = '+ Додати послугу';
        parentFlex.insertBefore(srvBtn, container);
    }

    const user = getCurrentUser();
    if (user) {
        container.innerHTML = `
            <a href="${resolvePagePath('profile.html')}" class="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 shadow-sm transition-all" title="Натисніть, щоб відкрити ваш профіль">
                <div class="relative">
                    <img src="${sanitizeAvatar(user.avatar)}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover bg-slate-200 border border-slate-200">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                </div>
                <div class="text-left">
                    <div class="text-xs font-extrabold text-slate-900 leading-none">${user.name}</div>
                    <div class="text-[10px] font-semibold text-emerald-600 leading-none mt-1">● В акаунті</div>
                </div>
            </a>
        `;
    } else {
        container.innerHTML = `
            <a href="${resolvePagePath('auth.html')}" class="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 text-xs font-bold text-slate-800 transition-all shadow-sm" title="Увійти або створити акаунт">
                <img src="${DEFAULT_AVATAR}" alt="Гість" class="w-7 h-7 rounded-full object-cover opacity-75">
                <div class="text-left">
                    <div class="text-xs font-bold text-slate-900 leading-none">Увійти</div>
                    <div class="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Не авторизовано</div>
                </div>
            </a>
        `;
    }
    updateHeaderBadges();
}

// Генерація HTML-коду однієї картки послуги для головної сторінки та каталогу
function createServiceCardHTML(item) {
    const savedSet = getSavedIds();
    const isSaved = savedSet.has(item.id);
    return `
        <article class="portfolio-card group" data-id="${item.id}">
            <div class="portfolio-cover-wrap cursor-pointer open-detail-trigger" data-id="${item.id}">
                <img src="${item.img}" alt="${item.title}" class="portfolio-cover" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'">
                <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] font-bold text-accent-dynamic shadow-sm">
                    ${item.cat}
                </div>
                ${item.isCustom ? `<div class="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow">★ Ваша послуга</div>` : ''}
            </div>

            <div class="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                ${item.isCustom ? `
                    <button 
                        type="button"
                        class="edit-custom-srv-btn w-8 h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm hover:border-blue-500 transition-all text-xs"
                        data-id="${item.id}"
                        title="Редагувати вашу послугу"
                    >
                        ✏️
                    </button>
                    <button 
                        type="button"
                        class="delete-custom-srv-btn w-8 h-8 rounded-full flex items-center justify-center bg-red-600 text-white shadow-sm hover:bg-red-700 transition-all text-xs"
                        data-id="${item.id}"
                        title="Видалити ваше оголошення"
                    >
                        🗑
                    </button>
                ` : ''}
                <button 
                    type="button"
                    class="toggle-save-btn w-8 h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-md border ${isSaved ? 'border-blue-600 text-blue-600' : 'border-slate-200 text-slate-400 hover:text-slate-800'} shadow-sm transition-all"
                    data-id="${item.id}"
                    title="${isSaved ? 'Прибрати з обраного' : 'Додати в обране'}"
                >
                    ${isSaved ? '♥' : '♡'}
                </button>
            </div>

            <div class="card-body">
                <div class="flex items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2.5">
                        <img src="${sanitizeAvatar(item.avatar)}" alt="${item.name}" class="card-avatar">
                        <div>
                            <div class="text-xs font-bold text-slate-900">${item.name}</div>
                            <div class="text-[11px] text-slate-500">${item.city}</div>
                        </div>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-full px-2.5 py-0.5">${item.time}</span>
                </div>

                <h3 class="card-title cursor-pointer open-detail-trigger" data-id="${item.id}">${item.title}</h3>
                <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">${item.desc}</p>

                <div class="card-footer">
                    <div class="font-semibold text-xs">
                        <span class="text-amber-500">★ ${Number(item.rating || 5).toFixed(1)}</span>
                        <span class="text-slate-400 ml-0.5">(${item.rev || 1})</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="text-right">
                            <div class="card-price leading-none">${item.priceText}</div>
                            <div class="text-[10px] text-slate-400 font-semibold mt-0.5">≈ ${item.uahText}</div>
                        </div>
                        <button 
                            type="button" 
                            class="open-detail-trigger px-3 py-2 rounded-xl bg-accent-soft-dynamic text-accent-dynamic hover:opacity-90 text-xs font-bold transition-all"
                            data-id="${item.id}"
                        >
                            Деталі
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

let pendingCustomCoverDataUrl = '';

// Динамічне вбудовування глобальних модальних вікон (деталі послуги, додавання послуги, створення заявки, панель обраного)
function ensureGlobalModals() {
    if (document.getElementById('global-modals-injected')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'global-modals-injected';
    wrapper.innerHTML = `
        <div id="project-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <span id="modal-category-tag" class="text-xs font-bold uppercase tracking-wider text-accent-dynamic">Категорія</span>
                    <button type="button" data-close-modal="project-modal" class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xl leading-none">&times;</button>
                </div>
                <div class="overflow-y-auto p-6 sm:p-8 space-y-5" id="project-modal-body"></div>
            </div>
        </div>

        <div id="global-add-service-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div>
                        <div class="text-xs font-bold uppercase text-accent-dynamic" id="g-srv-modal-subtitle">Нова пропозиція в каталог</div>
                        <h3 id="g-srv-modal-title" class="font-display text-xl font-extrabold text-slate-900">Додати власну послугу</h3>
                    </div>
                    <button type="button" data-close-modal="global-add-service-modal" class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 text-xl leading-none">&times;</button>
                </div>
                <form id="global-add-service-form" class="p-6 space-y-4 overflow-y-auto">
                    <input type="hidden" id="g-srv-edit-id" value="">
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Назва вашої послуги *</label>
                        <input type="text" required id="g-srv-title" placeholder="Наприклад: Розробка Telegram-бота або Дизайн лендінгу у Figma" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                    </div>
                    <div class="grid sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Категорія *</label>
                            <select id="g-srv-cat" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none">
                                <option value="Розробка">Розробка</option>
                                <option value="Дизайн">Дизайн</option>
                                <option value="Маркетинг">Маркетинг</option>
                                <option value="ШІ та Дані">ШІ та Дані</option>
                                <option value="Стратегія">Стратегія</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Ціна ($) *</label>
                            <input type="number" required min="5" max="5000" id="g-srv-price" value="50" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-accent-dynamic outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Термін виконання *</label>
                            <input type="text" required id="g-srv-time" value="2 дні" placeholder="2 дні" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1.5">Фото обкладинки послуги (з вашого комп'ютера)</label>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                            <label for="g-srv-file" class="px-4 py-2.5 rounded-xl bg-accent-dynamic text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all whitespace-nowrap shadow-sm">
                                📁 Обрати файл з ПК
                            </label>
                            <input type="file" id="g-srv-file" accept="image/*" class="hidden">
                            <div class="flex-1 min-w-0">
                                <div id="g-srv-file-name" class="text-xs font-semibold text-slate-600 truncate">Файл ще не обрано (або буде стандартна обкладинка)</div>
                                <div class="text-[10px] text-slate-400">Підтримуються JPG, PNG, WebP</div>
                            </div>
                            <button type="button" id="g-srv-clear-file" class="hidden text-xs font-bold text-red-600 hover:underline">Скинути</button>
                        </div>
                        <div id="g-srv-cover-preview-wrap" class="hidden mt-3 relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-100">
                            <img id="g-srv-cover-preview" src="" alt="Preview" class="w-full h-full object-cover">
                            <span class="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/75 text-white text-[10px] font-bold">Прев'ю вашої обкладинки</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Детальний опис послуги *</label>
                        <textarea required id="g-srv-desc" rows="3" placeholder="Опишіть ваш досвід, стек технологій та що саме отримає замовник..." class="w-full bg-slate-50 rounded-xl border border-slate-200 p-3.5 text-sm outline-none"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Що входить у вартість (через кому)</label>
                        <input type="text" id="g-srv-deliverables" placeholder="Вихідний код, Адаптивний дизайн, Інструкція, 7 днів підтримки" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                    </div>

                    <div class="pt-2 flex items-center justify-between gap-3">
                        <span class="text-xs text-slate-500">Надійно зберігається у вашому браузері</span>
                        <button type="submit" id="g-srv-submit-btn" class="btn btn-primary">Опублікувати послугу</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="brief-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-accent-dynamic" id="brief-modal-subtitle">Нове замовлення</div>
                        <h3 id="brief-modal-title" class="font-display text-xl font-extrabold text-slate-900">Опублікувати заявку на проєкт</h3>
                    </div>
                    <button type="button" data-close-modal="brief-modal" class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xl leading-none">&times;</button>
                </div>

                <form id="brief-form" class="p-6 space-y-4">
                    <input type="hidden" id="brief-edit-id" value="">
                    <input type="hidden" id="brief-service-id" value="">
                    <input type="hidden" id="brief-seller-name" value="">
                    <div id="selected-specialist-banner" class="hidden p-3 rounded-2xl border border-blue-200 bg-blue-50 flex items-center justify-between">
                        <div class="text-xs">
                            <span class="text-slate-500">Замовлення послуги:</span>
                            <strong id="banner-specialist-name" class="text-blue-700 ml-1"></strong>
                        </div>
                        <button type="button" id="clear-specialist-btn" class="text-xs font-semibold text-slate-500 hover:text-slate-900 underline">Скасувати</button>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Назва вашого проєкту або завдання *</label>
                        <input type="text" required id="brief-title" placeholder="Наприклад: Розробити лендінг для магазину або бота в n8n" class="w-full bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-sm outline-none">
                    </div>

                    <div class="grid sm:grid-cols-2 gap-3.5">
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Ваше ім'я *</label>
                            <input type="text" required id="brief-name" placeholder="Введіть ваше ім'я" class="w-full bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-sm outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Telegram або Email *</label>
                            <input type="text" required id="brief-email" placeholder="@username або email" class="w-full bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-sm outline-none">
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-3 gap-3.5">
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Категорія</label>
                            <select id="brief-category" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none">
                                <option value="Розробка">Розробка</option>
                                <option value="Дизайн">Дизайн</option>
                                <option value="Маркетинг">Маркетинг</option>
                                <option value="ШІ та Дані">ШІ та Дані</option>
                                <option value="Стратегія">Стратегія</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Бюджет ($)</label>
                            <input type="text" required id="brief-budget" value="$65" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-accent-dynamic font-bold outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Термін виконання</label>
                            <input type="text" required id="brief-deadline" value="3 дні" placeholder="3 дні" class="w-full bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Детальний опис завдання *</label>
                        <textarea required id="brief-notes" rows="3" placeholder="Опишіть, що саме потрібно зробити, які є матеріали та побажання..." class="w-full bg-slate-50 rounded-xl border border-slate-200 p-3.5 text-sm outline-none"></textarea>
                    </div>

                    <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span class="text-xs text-slate-500">Заявка збережеться у «Моїх проєктах» та профілі</span>
                        <button type="submit" class="btn btn-primary w-full sm:w-auto" id="brief-submit-btn">Зберегти та опублікувати</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="saved-drawer" class="fixed inset-0 z-50 hidden">
            <div id="saved-backdrop" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
            <div class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 p-6 flex flex-col justify-between z-10 shadow-2xl">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div>
                            <div class="text-xs font-bold uppercase tracking-wider text-accent-dynamic">Збережені послуги</div>
                            <h3 class="font-display text-2xl font-extrabold text-slate-900">Обране</h3>
                        </div>
                        <button id="close-saved-drawer" type="button" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xl">&times;</button>
                    </div>
                    <div id="saved-items-list" class="mt-5 space-y-3 max-h-[65vh] overflow-y-auto pr-1"></div>
                </div>
                <div class="pt-4 border-t border-slate-200 space-y-2">
                    <a href="${resolvePagePath('catalog.html')}" class="btn btn-primary w-full">Перейти до всього каталогу (54+)</a>
                    <button id="clear-all-saved-btn" type="button" class="w-full py-2 text-xs font-semibold text-slate-500 hover:text-red-600">Очистити список</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);
}

// Відкриття модального вікна створення нової або редагування існуючої власної послуги
function openAddServiceModal(editServiceObj = null) {
    ensureGlobalModals();
    const user = getCurrentUser();
    if (!user) {
        showToast(
            'Потрібна авторизація',
            'Увійдіть у свій акаунт, щоб публікувати або редагувати власні послуги.',
            'auth.html',
            'Увійти в акаунт →'
        );
        return;
    }

    const modal = document.getElementById('global-add-service-modal');
    const editIdInput = document.getElementById('g-srv-edit-id');
    const titleInput = document.getElementById('g-srv-title');
    const catSelect = document.getElementById('g-srv-cat');
    const priceInput = document.getElementById('g-srv-price');
    const timeInput = document.getElementById('g-srv-time');
    const descInput = document.getElementById('g-srv-desc');
    const delivInput = document.getElementById('g-srv-deliverables');
    const modalTitle = document.getElementById('g-srv-modal-title');
    const modalSub = document.getElementById('g-srv-modal-subtitle');
    const submitBtn = document.getElementById('g-srv-submit-btn');
    const previewWrap = document.getElementById('g-srv-cover-preview-wrap');
    const previewImg = document.getElementById('g-srv-cover-preview');
    const fileNameEl = document.getElementById('g-srv-file-name');
    const clearFileBtn = document.getElementById('g-srv-clear-file');

    if (editServiceObj) {
        modalSub.textContent = 'Редагування оголошення';
        modalTitle.textContent = 'Змінити вашу послугу';
        submitBtn.textContent = 'Зберегти зміни';
        editIdInput.value = editServiceObj.id;
        titleInput.value = editServiceObj.title || '';
        catSelect.value = editServiceObj.cat || 'Розробка';
        priceInput.value = editServiceObj.price || 50;
        timeInput.value = editServiceObj.time || '2 дні';
        descInput.value = editServiceObj.desc || '';
        delivInput.value = Array.isArray(editServiceObj.deliverables) ? editServiceObj.deliverables.join(', ') : '';
        pendingCustomCoverDataUrl = editServiceObj.img || '';
        if (pendingCustomCoverDataUrl) {
            previewImg.src = pendingCustomCoverDataUrl;
            previewWrap.classList.remove('hidden');
            fileNameEl.textContent = 'Поточна обкладинка збережена';
            clearFileBtn.classList.remove('hidden');
        }
    } else {
        modalSub.textContent = 'Нова пропозиція в каталог';
        modalTitle.textContent = 'Додати власну послугу';
        submitBtn.textContent = 'Опублікувати послугу';
        editIdInput.value = '';
        titleInput.value = '';
        catSelect.value = 'Розробка';
        priceInput.value = 50;
        timeInput.value = '2 дні';
        descInput.value = '';
        delivInput.value = '';
        pendingCustomCoverDataUrl = '';
        previewWrap.classList.add('hidden');
        clearFileBtn.classList.add('hidden');
        fileNameEl.textContent = 'Файл ще не обрано (або буде стандартна обкладинка)';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Відкриття модального вікна з детальним описом обраної послуги, ціною та кнопкою замовлення
function openProjectModal(serviceId) {
    ensureGlobalModals();
    const item = getAllServices().find(s => s.id === serviceId);
    if (!item) return;

    const modal = document.getElementById('project-modal');
    document.getElementById('modal-category-tag').textContent = `${item.cat} • Термін: ${item.time}`;
    const savedSet = getSavedIds();

    document.getElementById('project-modal-body').innerHTML = `
        <div class="grid sm:grid-cols-12 gap-5 items-center">
            <div class="sm:col-span-5">
                <img src="${item.img}" alt="${item.title}" class="w-full h-48 object-cover rounded-2xl border border-slate-200">
            </div>
            <div class="sm:col-span-7 space-y-2.5">
                <div class="flex items-center gap-3">
                    <img src="${sanitizeAvatar(item.avatar)}" alt="${item.name}" class="w-11 h-11 rounded-full object-cover border border-slate-200 bg-slate-100">
                    <div>
                        <div class="text-sm font-bold text-slate-900">${item.name}</div>
                        <div class="text-xs text-accent-dynamic font-semibold">${item.cat} • ${item.city}</div>
                    </div>
                </div>
                <h3 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">${item.title}</h3>
                <div class="text-xs text-slate-500 font-semibold">
                    <span class="text-amber-500 font-bold">★ ${Number(item.rating || 5).toFixed(1)} (${item.rev || 1} відгуків)</span> • Фіксована ціна: <strong class="text-slate-900">${item.priceText} (≈ ${item.uahText})</strong>
                </div>
            </div>
        </div>

        <div class="border-t border-slate-200 pt-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Опис послуги</h4>
            <p class="text-sm text-slate-700 leading-relaxed">${item.desc}</p>
        </div>

        <div class="border-t border-slate-200 pt-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Що входить у вартість</h4>
            <div class="grid sm:grid-cols-2 gap-2.5">
                ${item.deliverables.map(d => `
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2">
                        <span class="text-accent-dynamic font-bold">✓</span><span>${d}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <div class="text-xs text-slate-500 font-semibold">Вартість пакета (Escrow)</div>
                <div class="font-display text-3xl font-extrabold text-accent-dynamic">${item.priceText} <span class="text-xs text-slate-400 font-normal">≈ ${item.uahText}</span></div>
            </div>
            <div class="flex flex-wrap gap-2.5 w-full sm:w-auto">
                ${item.isCustom ? `
                    <button type="button" id="modal-edit-custom-btn" class="btn btn-secondary">
                        ✏️ Редагувати
                    </button>
                    <button type="button" id="modal-delete-custom-btn" class="btn btn-danger">
                        🗑 Видалити
                    </button>
                ` : ''}
                <button type="button" id="modal-save-btn" class="btn btn-secondary">
                    ${savedSet.has(item.id) ? '♥ В обраному' : '♡ В обране'}
                </button>
                <button type="button" id="modal-book-btn" class="btn btn-primary">
                    Замовити за ${item.priceText}
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const editBtn = document.getElementById('modal-edit-custom-btn');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModalById('project-modal');
            const rawSrv = getCustomServices().find(s => s.id === item.id) || item;
            openAddServiceModal(rawSrv);
        };
    }

    const delBtn = document.getElementById('modal-delete-custom-btn');
    if (delBtn) {
        delBtn.onclick = () => deleteCustomService(item.id);
    }

    document.getElementById('modal-save-btn').onclick = () => {
        toggleSaveService(item.id);
        document.getElementById('modal-save-btn').textContent = getSavedIds().has(item.id) ? '♥ В обраному' : '♡ В обране';
    };
    document.getElementById('modal-book-btn').onclick = () => {
        closeModalById('project-modal');
        openBriefModal({ service: item });
    };
}

// Відкриття форми створення або редагування заявки на проєкт (з перевіркою авторизації)
function openBriefModal(options = {}) {
    ensureGlobalModals();
    const user = getCurrentUser();
    if (!user) {
        showToast(
            'Потрібна авторизація',
            'Увійдіть у свій акаунт або зареєструйтеся, щоб створити заявку або замовити послугу.',
            'auth.html',
            'Увійти в акаунт →'
        );
        return;
    }

    const modal = document.getElementById('brief-modal');
    const banner = document.getElementById('selected-specialist-banner');
    const bannerName = document.getElementById('banner-specialist-name');
    const editIdInput = document.getElementById('brief-edit-id');
    const serviceIdInput = document.getElementById('brief-service-id');
    const sellerNameInput = document.getElementById('brief-seller-name');
    const titleInput = document.getElementById('brief-title');
    const nameInput = document.getElementById('brief-name');
    const emailInput = document.getElementById('brief-email');
    const catSelect = document.getElementById('brief-category');
    const budgetInput = document.getElementById('brief-budget');
    const deadlineInput = document.getElementById('brief-deadline');
    const notesInput = document.getElementById('brief-notes');
    const modalTitle = document.getElementById('brief-modal-title');
    const submitBtn = document.getElementById('brief-submit-btn');

    if (!options.editProject) {
        nameInput.value = user.name || '';
        emailInput.value = user.telegram || user.email || '';
    }

    if (options.editProject) {
        const p = options.editProject;
        modalTitle.textContent = 'Редагувати ваше замовлення';
        submitBtn.textContent = 'Зберегти зміни';
        editIdInput.value = p.id;
        serviceIdInput.value = p.orderedServiceId || '';
        sellerNameInput.value = p.sellerName || '';
        titleInput.value = p.title;
        nameInput.value = p.author;
        emailInput.value = p.email;
        catSelect.value = p.category;
        budgetInput.value = p.budget;
        deadlineInput.value = p.deadline || '3 дні';
        notesInput.value = p.notes;
        if (p.sellerName) {
            banner.classList.remove('hidden');
            bannerName.textContent = `${p.sellerName}`;
        } else {
            banner.classList.add('hidden');
        }
    } else {
        modalTitle.textContent = options.service ? 'Замовити обрану послугу' : 'Опублікувати заявку на проєкт';
        submitBtn.textContent = options.service ? 'Підтвердити замовлення' : 'Зберегти та опублікувати';
        editIdInput.value = '';
        if (options.service) {
            const s = options.service;
            banner.classList.remove('hidden');
            bannerName.textContent = `${s.name} — ${s.title}`;
            serviceIdInput.value = s.id;
            sellerNameInput.value = s.name;
            titleInput.value = `Замовлення послуги: ${s.title}`;
            catSelect.value = s.cat;
            budgetInput.value = s.priceText;
            deadlineInput.value = s.time;
            notesInput.value = `Замовляю послугу «${s.title}» у виконавця ${s.name}.`;
        } else {
            banner.classList.add('hidden');
            serviceIdInput.value = '';
            sellerNameInput.value = '';
            titleInput.value = '';
            notesInput.value = '';
            if (options.budget) budgetInput.value = options.budget;
            if (options.category) catSelect.value = options.category;
            if (options.deadline) deadlineInput.value = options.deadline;
        }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Закриття будь-якого модального вікна за його ID
function closeModalById(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }
}

// Додавання або видалення послуги зі списку «Обране» при кліку на сердечко
function toggleSaveService(id) {
    const setObj = getSavedIds();
    const srv = getAllServices().find(s => s.id === id);
    if (setObj.has(id)) {
        setObj.delete(id);
        showToast('Видалено з обраного', srv ? srv.title : '');
    } else {
        setObj.add(id);
        showToast('Додано в обране ♥', srv ? `${srv.name} — ${srv.priceText}` : '');
    }
    saveSavedIds(setObj);
    renderSavedDrawerList();
    if (typeof window.refreshServiceGrids === 'function') window.refreshServiceGrids();
}

// Відмальовування списку збережених послуг у боковій висувній панелі «Обране»
function renderSavedDrawerList() {
    const listEl = document.getElementById('saved-items-list');
    if (!listEl) return;
    const savedSet = getSavedIds();
    const items = getAllServices().filter(s => savedSet.has(s.id));

    if (items.length === 0) {
        listEl.innerHTML = `<div class="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">У вас поки немає збережених послуг. Натисніть ♡ на будь-якій картці.</div>`;
        return;
    }

    listEl.innerHTML = items.map(item => `
        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
                <img src="${sanitizeAvatar(item.avatar)}" class="w-10 h-10 rounded-full object-cover bg-slate-200">
                <div>
                    <div class="text-xs font-bold text-slate-900 line-clamp-1">${item.title}</div>
                    <div class="text-[11px] text-slate-500">${item.name} • <strong class="text-accent-dynamic">${item.priceText}</strong></div>
                </div>
            </div>
            <div class="flex items-center gap-1">
                <button type="button" class="drawer-book-btn px-2.5 py-1.5 rounded-lg bg-accent-dynamic text-white text-[11px] font-bold" data-id="${item.id}">Замовити</button>
                <button type="button" class="drawer-remove-btn w-7 h-7 rounded-full hover:bg-slate-200 text-slate-500" data-id="${item.id}">&times;</button>
            </div>
        </div>
    `).join('');
}

// Головна функція запуску платформи: прив'язка всіх кліків, завантаження файлів з ПК та обробка форм
function initCorePlatform() {
    if (window.__fhCoreInitialized) return;
    window.__fhCoreInitialized = true;

    ensureGlobalModals();
    renderAuthHeader();
    renderSavedDrawerList();
    applyColorMode(getColorMode());

    const fileInput = document.getElementById('g-srv-file');
    const fileNameEl = document.getElementById('g-srv-file-name');
    const previewWrap = document.getElementById('g-srv-cover-preview-wrap');
    const previewImg = document.getElementById('g-srv-cover-preview');
    const clearFileBtn = document.getElementById('g-srv-clear-file');

    function resetCoverUpload() {
        pendingCustomCoverDataUrl = '';
        if (fileInput) fileInput.value = '';
        if (fileNameEl) fileNameEl.textContent = 'Файл ще не обрано (або буде стандартна обкладинка)';
        if (previewWrap) previewWrap.classList.add('hidden');
        if (clearFileBtn) clearFileBtn.classList.add('hidden');
    }

    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                fileNameEl.textContent = `Обробка: ${file.name}...`;
                const compressedDataUrl = await compressUploadedImage(file, 900, 0.82);
                pendingCustomCoverDataUrl = compressedDataUrl;
                fileNameEl.textContent = `Обрано: ${file.name}`;
                previewImg.src = compressedDataUrl;
                previewWrap.classList.remove('hidden');
                clearFileBtn.classList.remove('hidden');
            } catch (err) {
                showToast('Помилка читання файлу', 'Спробуйте інше зображення у форматі JPG або PNG.');
            }
        });
    }

    if (clearFileBtn) {
        clearFileBtn.addEventListener('click', resetCoverUpload);
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle-btn')) {
            e.preventDefault();
            toggleColorMode();
            return;
        }

        if (e.target.closest('#open-add-service-btn') || e.target.closest('.open-add-service-modal-btn')) {
            e.preventDefault();
            e.stopPropagation();
            openAddServiceModal(null);
            return;
        }

        const editCustomBtn = e.target.closest('.edit-custom-srv-btn');
        if (editCustomBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = editCustomBtn.getAttribute('data-id');
            const srv = getCustomServices().find(s => s.id === id);
            if (srv) openAddServiceModal(srv);
            return;
        }

        const delCustomBtn = e.target.closest('.delete-custom-srv-btn');
        if (delCustomBtn) {
            e.preventDefault();
            e.stopPropagation();
            deleteCustomService(delCustomBtn.getAttribute('data-id'));
            return;
        }

        const briefBtn = e.target.closest('.open-brief-modal-btn');
        if (briefBtn) {
            e.preventDefault();
            openBriefModal();
            return;
        }

        const openSavedBtn = e.target.closest('#open-saved-btn');
        if (openSavedBtn) {
            e.preventDefault();
            renderSavedDrawerList();
            document.getElementById('saved-drawer').classList.remove('hidden');
            return;
        }

        if (e.target.closest('#close-saved-drawer') || e.target.id === 'saved-backdrop') {
            document.getElementById('saved-drawer').classList.add('hidden');
            return;
        }

        if (e.target.closest('#clear-all-saved-btn')) {
            saveSavedIds(new Set());
            renderSavedDrawerList();
            if (typeof window.refreshServiceGrids === 'function') window.refreshServiceGrids();
            showToast('Список обраного очищено');
            return;
        }

        const remSaved = e.target.closest('.drawer-remove-btn');
        if (remSaved) {
            toggleSaveService(remSaved.getAttribute('data-id'));
            return;
        }
        const bookSaved = e.target.closest('.drawer-book-btn');
        if (bookSaved) {
            const srv = getAllServices().find(s => s.id === bookSaved.getAttribute('data-id'));
            document.getElementById('saved-drawer').classList.add('hidden');
            openBriefModal({ service: srv });
            return;
        }

        const saveBtn = e.target.closest('.toggle-save-btn');
        if (saveBtn) {
            e.stopPropagation();
            toggleSaveService(saveBtn.getAttribute('data-id'));
            return;
        }

        const detailBtn = e.target.closest('.open-detail-trigger');
        if (detailBtn) {
            openProjectModal(detailBtn.getAttribute('data-id'));
            return;
        }

        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
            closeModalById(closeBtn.getAttribute('data-close-modal'));
            return;
        }

        if (e.target.closest('#clear-specialist-btn')) {
            document.getElementById('selected-specialist-banner').classList.add('hidden');
            document.getElementById('brief-service-id').value = '';
            document.getElementById('brief-seller-name').value = '';
            return;
        }

        if (e.target.closest('#mobile-menu-btn')) {
            const mobMenu = document.getElementById('mobile-menu');
            if (mobMenu) mobMenu.classList.toggle('hidden');
            return;
        }
    });

    const globalAddSrvForm = document.getElementById('global-add-service-form');
    if (globalAddSrvForm) {
        globalAddSrvForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            const editId = document.getElementById('g-srv-edit-id').value;
            const title = document.getElementById('g-srv-title').value.trim();
            const cat = document.getElementById('g-srv-cat').value;
            const price = parseInt(document.getElementById('g-srv-price').value, 10) || 45;
            const time = document.getElementById('g-srv-time').value.trim() || '2 дні';
            const desc = document.getElementById('g-srv-desc').value.trim();
            const delivRaw = document.getElementById('g-srv-deliverables').value.trim();

            const deliverables = delivRaw
                ? delivRaw.split(',').map(d => d.trim()).filter(Boolean)
                : [
                    'Виконання точно за вашим технічним завданням',
                    'Передача всіх вихідних файлів та інструкції',
                    '2 безкоштовні кола правок включено у вартість'
                ];

            const customList = getCustomServices();

            if (editId) {
                const idx = customList.findIndex(s => s.id === editId);
                if (idx >= 0) {
                    customList[idx] = {
                        ...customList[idx],
                        title,
                        cat,
                        price,
                        time,
                        desc,
                        deliverables,
                        img: pendingCustomCoverDataUrl || customList[idx].img
                    };
                    saveCustomServices(customList);
                    closeModalById('global-add-service-modal');
                    resetCoverUpload();
                    showToast('Вашу послугу оновлено!', `${title} — $${price}`);
                    return;
                }
            }

            const newSrv = {
                id: 'custom-' + Date.now(),
                title,
                cat,
                price,
                time,
                rating: 5.0,
                rev: 1,
                name: user ? user.name : 'Спеціаліст',
                ownerEmail: user ? user.email : '',
                city: (user && user.city) ? user.city : 'Україна',
                avatar: (user && user.avatar) ? sanitizeAvatar(user.avatar) : DEFAULT_AVATAR,
                img: pendingCustomCoverDataUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                desc,
                deliverables,
                isCustom: true
            };

            customList.unshift(newSrv);
            saveCustomServices(customList);

            closeModalById('global-add-service-modal');
            e.target.reset();
            resetCoverUpload();
            showToast(
                'Послугу збережено та опубліковано!',
                `${newSrv.title} — $${newSrv.price}`,
                'profile.html',
                'Переглянути у профілі →'
            );
        });
    }

    const briefForm = document.getElementById('brief-form');
    if (briefForm) {
        briefForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('brief-edit-id').value;
            const orderedServiceId = document.getElementById('brief-service-id').value;
            const sellerName = document.getElementById('brief-seller-name').value;
            const title = document.getElementById('brief-title').value.trim();
            const author = document.getElementById('brief-name').value.trim();
            const email = document.getElementById('brief-email').value.trim();
            const category = document.getElementById('brief-category').value;
            let budget = document.getElementById('brief-budget').value.trim();
            if (!budget.startsWith('$') && !budget.includes('₴')) budget = '$' + budget;
            const deadline = document.getElementById('brief-deadline').value.trim() || '3 дні';
            const notes = document.getElementById('brief-notes').value.trim();

            const projects = getProjects();

            if (editId) {
                const idx = projects.findIndex(p => p.id === editId);
                if (idx >= 0) {
                    projects[idx] = { ...projects[idx], title, author, email, category, budget, deadline, notes, orderedServiceId, sellerName };
                    saveProjects(projects);
                    showToast('Замовлення успішно оновлено!', title, 'profile.html', 'Переглянути у профілі →');
                }
            } else {
                const newProj = {
                    id: 'prj-' + Date.now(),
                    title,
                    category,
                    budget,
                    deadline,
                    status: 'Активна',
                    author,
                    email,
                    orderedServiceId,
                    sellerName,
                    createdAt: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
                    isMine: true,
                    notes
                };
                projects.unshift(newProj);
                saveProjects(projects);
                showToast('Замовлення збережено!', `Бюджет: ${budget}. Доступно у вашому профілі та «Моїх проєктах».`, 'profile.html', 'Перейти у профіль →');
            }

            closeModalById('brief-modal');
            e.target.reset();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCorePlatform);
} else {
    initCorePlatform();
}