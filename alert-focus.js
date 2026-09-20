/* Alerta: enfoque exacto del elemento relacionado. Inclúyelo después del script principal. */
(function () {
  'use strict';

  const FOCUS_CLASS = 'alert-focus-target';
  const MONTHS = window.MONTHS || ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

  function clearFocus() {
    document.querySelectorAll('.' + FOCUS_CLASS).forEach(el => el.classList.remove(FOCUS_CLASS));
  }

  function focusElement(element) {
    if (!element) return;
    clearFocus();
    element.classList.add(FOCUS_CLASS);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    window.setTimeout(() => element.classList.remove(FOCUS_CLASS), 5000);
  }

  function focusFlow(section, month) {
    const flowSelect = document.getElementById('flowMonthSel');
    if (flowSelect && Number.isInteger(month)) {
      flowSelect.value = String(month);
      if (typeof window.setFlowView === 'function') window.setFlowView(String(month));
    }

    const selectors = {
      Gastos: 'tr[data-alert-section="expenses"]',
      Deudas: 'tr[data-alert-section="debts"]',
      Liquidez: 'tr[data-alert-section="liquidity"]',
      'Flujo mensual': 'tr[data-alert-section="liquidity"]'
    };
    focusElement(document.querySelector(selectors[section] || selectors.Liquidez));
  }

  function focusDebt(name) {
    const loans = [...document.querySelectorAll('.loan-card')];
    const target = loans.find(card => {
      const input = card.querySelector('.loan-title');
      return input && input.value.trim().toLowerCase() === String(name || '').trim().toLowerCase();
    });
    focusElement(target || loans[0]);
  }

  window.goAlertExact = function (tab, month, section, name) {
    if (Number.isInteger(month)) {
      const dashMonth = document.getElementById('dashMonth');
      if (dashMonth) dashMonth.value = String(month);
    }
    if (typeof window.switchTab === 'function') window.switchTab(tab || 'dashboard');
    window.requestAnimationFrame(() => {
      if (tab === 'flujo') focusFlow(section, month);
      else if (tab === 'deudas') focusDebt(name);
      else focusElement(document.getElementById('alerts'));
    });
  };
})();
