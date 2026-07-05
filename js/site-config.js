// Applies owner-editable settings from data/site.json across the site.
// The HTML keeps the original values as fallbacks; when the owner changes
// a value in the CMS, this script swaps it in on page load.
(function () {
    // Values as they are hard-coded in the HTML today. Used to find the
    // elements that need updating. Do not change these when the business
    // details change — edit data/site.json (via the CMS) instead.
    var DEFAULTS = {
        whatsapp: '254720069883',
        phone1: '+254720069883',
        phone2: '+254713361225',
        email1: 'info@delphigraphics.co.ke',
        email2: 'delphigraphics@gmail.com',
        address: 'Sunrays House, 1st Floor, Room 108, Nairobi, Kenya'
    };

    function digits(v) { return String(v || '').replace(/\D/g, ''); }

    function apply(cfg) {
        window.SITE_CONFIG = cfg;

        // WhatsApp links: swap the number, keep the pre-filled message
        if (cfg.whatsapp && digits(cfg.whatsapp) !== DEFAULTS.whatsapp) {
            document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
                a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + digits(cfg.whatsapp));
            });
        }

        // Phone links
        [['phone1', 'phone1_display'], ['phone2', 'phone2_display']].forEach(function (pair) {
            var num = cfg[pair[0]], display = cfg[pair[1]] || cfg[pair[0]];
            if (!num || num === DEFAULTS[pair[0]]) return;
            document.querySelectorAll('a[href="tel:' + DEFAULTS[pair[0]] + '"]').forEach(function (a) {
                a.href = 'tel:' + num;
                if (a.children.length === 0) a.textContent = display;
            });
        });

        // Email links
        ['email1', 'email2'].forEach(function (key) {
            if (!cfg[key] || cfg[key] === DEFAULTS[key]) return;
            document.querySelectorAll('a[href^="mailto:' + DEFAULTS[key] + '"]').forEach(function (a) {
                a.href = 'mailto:' + cfg[key];
                if (a.children.length === 0 && a.textContent.trim() === DEFAULTS[key]) {
                    a.textContent = cfg[key];
                }
            });
        });

        // Address (plain text occurrences)
        if (cfg.address && cfg.address !== DEFAULTS.address) {
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            var node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue.indexOf(DEFAULTS.address) !== -1) {
                    node.nodeValue = node.nodeValue.split(DEFAULTS.address).join(cfg.address);
                }
            }
        }

        // Elements explicitly tagged with data-site="<key>" get their text
        // replaced with the matching site.json value.
        document.querySelectorAll('[data-site]').forEach(function (el) {
            var val = cfg[el.getAttribute('data-site')];
            if (typeof val === 'string' && val.length) el.textContent = val;
        });
    }

    function init() {
        fetch('./data/site.json')
            .then(function (r) { return r.json(); })
            .then(apply)
            .catch(function () { /* keep hard-coded values */ });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
