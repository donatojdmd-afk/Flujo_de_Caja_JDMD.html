/* Resaltado exacto de alertas. Este archivo debe cargarse después del script principal. */
(function () {
  'use strict';

  const FOCUS_CLASS = 'alert-focus-target';
  const style = document.createElement('style');
  style.textContent = `
    .${FOCUS_CLASS} {
      outline: 3px solid #f59e0b !important;
      box-shadow: 0 0 0 5px rgba(245,158,11,.28), 0 0 24px rgba(245,158,11,.45) !important;
      background-image: linear-gradient(90deg, rgba(245,158,11,.22), transparent) !important;
      animation: alertFocusPulse 1s ease-in-out 3;
      position: relative;
      z-index: 8;
    }
    @keyframes alertFocusPulse {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.45); }
    }
  `;
  document.head.appendChild(style);

  function clearFocus() {
    document.querySelectorAll('.' + FOCUS_CLASS).forEach(el => el.classList.remove(FOCUS_CLASS));
  }

  function focusElement(element) {
    if (!element) return;
    clearFocus();
    element.classList.add(FOCUS_CLASS);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    window.setTimeout(() => element.classList.remove(FOCUS_CLASS), 6000);
  }

  function focusFlow(section, month) {
    const monthSelect = document.getElementById('flowMonthSel');
    if (monthSelect && Number.isInteger(month)) {
      monthSelect.value = String(month);
      if (typeof window.setFlowView === 'function') window.setFlowView(String(month));
    }

    const sectionKey = {
      'Gastos': 'expenses',
      'Deudas': 'debts',
      'Liquidez': 'liquidity',
      'Flujo mensual': 'liquidity',
      'Flujo quincenal': 'liquidity'
    }[section] || 'liquidity';

    let target = document.querySelector(`tr[data-alert-section="${sectionKey}"]`);
    if (!target) {
      const labels = {
        expenses: ['Egresos totales', 'Gastos fijos', 'Gastos variables'],
        debts: ['Deudas', 'Subtotal deudas'],
        liquidity: ['Liquidez mensual']
      }[sectionKey] || [];
      target = [...document.querySelectorAll('#flowTable tr')].find(row => {
        const text = (row.textContent || '').toLowerCase();
        return labels.some(label => text.includes(label.toLowerCase()));
      });
    }
    focusElement(target);
  }

  function focusDebt(name) {
    const cards = [...document.querySelectorAll('.loan-card')];
    const target = name
      ? cards.find(card => (card.querySelector('.loan-title')?.value || '').trim().toLowerCase() === String(name).trim().toLowerCase())
      : cards[0];
    focusElement(target);
  }

  window.goAlertExact = function (tab, month, section, name) {
    const dashMonth = document.getElementById('dashMonth');
    if (dashMonth && Number.isInteger(month)) dashMonth.value = String(month);
    if (typeof window.switchTab === 'function') window.switchTab(tab || 'dashboard');
    window.requestAnimationFrame(() => {
      if (tab === 'flujo') focusFlow(section, month);
      else if (tab === 'deudas') focusDebt(name);
      else focusElement(document.getElementById('alerts'));
    });
  };

  // Compatible con las alertas actuales: leen la sección desde title="Ir a ...".
  document.addEventListener('click', event => {
    const item = event.target.closest('.alert-item.clickable');
    if (!item) return;
    const title = item.getAttribute('title') || '';
    const section = title.replace(/^Ir a\s+/i, '').trim();
    const tab = document.querySelector('.tab.active')?.id || 'dashboard';
    const month = Number(document.getElementById('dashMonth')?.value);
    window.setTimeout(() => {
      if (tab === 'flujo') focusFlow(section, Number.isInteger(month) ? month : 0);
      else if (tab === 'deudas') focusDebt();
    }, 0);
  });
})();
