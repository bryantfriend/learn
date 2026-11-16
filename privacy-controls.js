/* Local classroom data controls. Clears only the named application's browser storage. */
(function installClassroomPrivacyControls() {
    'use strict';
    var script = document.currentScript;
    var application = script.getAttribute('data-privacy-app');
    var prefix = script.getAttribute('data-privacy-prefix');
    var policy = script.getAttribute('data-privacy-policy');
    var allowedPrefixes = ['learn.', 'oxford.'];
    if (allowedPrefixes.indexOf(prefix) < 0 || !application || !policy) {
        return;
    }

    function clearApplicationStorage(storage) {
        var keys = [];
        var index;
        for (index = 0; index < storage.length; index += 1) {
            var key = storage.key(index);
            if (typeof key === 'string' && key.indexOf(prefix) === 0) {
                keys.push(key);
            }
        }
        for (index = 0; index < keys.length; index += 1) {
            storage.removeItem(keys[index]);
        }
    }

    function mountPrivacyControls() {
        var footer = document.createElement('aside');
        footer.setAttribute('aria-label', application + ' privacy');
        footer.style.cssText = 'padding:16px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;max-width:1100px;margin:0 auto;';
        var link = document.createElement('a');
        link.href = policy;
        link.textContent = 'Privacy / Конфиденциальность';
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Clear this app’s device data';
        var status = document.createElement('span');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        button.addEventListener('click', function clearAfterConfirmation() {
            var question = 'Clear saved lessons, settings and progress for ' + application + ' on this browser? Download anything you need first. Other apps and cloud records will stay unchanged.\n\nУдалить сохранённые уроки, настройки и прогресс этого приложения в данном браузере? Сначала скачайте нужные материалы.';
            if (!window.confirm(question)) {
                return;
            }
            try {
                clearApplicationStorage(window.localStorage);
                clearApplicationStorage(window.sessionStorage);
                // Reload discards in-memory copies so old data cannot be saved again.
                window.location.reload();
            } catch (error) {
                status.textContent = 'Some browser data could not be cleared. Use this browser’s site-data settings to finish.';
            }
        });
        footer.appendChild(link);
        footer.appendChild(button);
        footer.appendChild(status);
        document.body.appendChild(footer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountPrivacyControls, { once: true });
    } else {
        mountPrivacyControls();
    }
}());
