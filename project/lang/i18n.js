/**
 * Sistema i18n leggero per Priscio Collettivo
 * Rileva la lingua del browser e applica le traduzioni
 */
const I18n = (() => {
    const translations = { it, en };
    let currentLang = 'it';

    // Rileva la lingua: 1) localStorage, 2) navigator.language, 3) fallback 'it'
    function detectLanguage() {
        const saved = localStorage.getItem('lang');
        if (saved && translations[saved]) return saved;

        const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
        // Se il browser è italiano, mostra italiano. Altrimenti inglese.
        return browserLang === 'it' ? 'it' : 'en';
    }

    // Ottieni traduzione per chiave
    function t(key) {
        const lang = translations[currentLang] || translations['it'];
        return lang[key] !== undefined ? lang[key] : (translations['it'][key] || key);
    }

    // Applica traduzioni a tutti gli elementi con data-i18n
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = t(key);
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        // Traduci data-description nei work-item
        document.querySelectorAll('[data-i18n-desc]').forEach(el => {
            const key = el.getAttribute('data-i18n-desc');
            const value = t(key);
            if (value !== undefined) {
                el.setAttribute('data-description', value);
            }
        });

        // Aggiorna meta tags
        const metaDesc = document.querySelector('meta[name="description"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const twDesc = document.querySelector('meta[property="twitter:description"]');
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        const htmlEl = document.documentElement;

        if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
        if (ogDesc) ogDesc.setAttribute('content', t('meta.og.description'));
        if (twDesc) twDesc.setAttribute('content', t('meta.og.description'));
        if (ogLocale) ogLocale.setAttribute('content', currentLang === 'it' ? 'it_IT' : 'en_US');
        htmlEl.setAttribute('lang', currentLang);

        // Aggiorna stato selettore lingua
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    // Cambia lingua
    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();

        // Evento custom per notificare il cambio lingua (usato dal typewriter)
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    // Ottieni sequenze typewriter per la lingua corrente
    function getTypewriterSequences() {
        return t('tw.sequences');
    }

    // Init
    function init() {
        currentLang = detectLanguage();
        applyTranslations();
    }

    return { init, setLanguage, t, getTypewriterSequences, get currentLang() { return currentLang; } };
})();
