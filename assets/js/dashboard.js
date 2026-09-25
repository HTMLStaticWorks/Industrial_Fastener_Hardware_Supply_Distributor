/**
 * IndustrialPro Fasteners – B2B Client & Admin Dashboard JavaScript
 * Interactive Features: Tab switching, Dynamic Bulk Reorder cart, Shipment Tracker, Invoices
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initBulkReorderCart();
  initShipmentLookup();
  initInvoiceActions();
  initLogout();
});

/* Tab Switching (Only intercept links that have data-target) */
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dashboard-nav-link[data-target], .dashboard-drawer-link[data-target]');
  const tabPanes = document.querySelectorAll('.dashboard-tab-pane');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      e.preventDefault();

      tabLinks.forEach(l => l.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Sync active state on both sidebar and mobile drawer links
      document.querySelectorAll(`[data-target="${targetId}"]`).forEach(l => l.classList.add('active'));

      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        // Scroll smoothly to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // If drawer is open, trigger close button
      const closeBtn = document.querySelector('.dashboard-drawer .drawer-close, .nav-drawer .drawer-close');
      if (closeBtn) {
        closeBtn.click();
      }
    });
  });
}

/* Logout Navigation */
function initLogout() {
  const logoutBtns = document.querySelectorAll('#btn-logout-portal, .dashboard-logout-link');
  if (!logoutBtns.length) return;

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('industrialpro-session');
      localStorage.removeItem('industrialpro-session');
      window.location.href = 'login.html';
    });
  });
}

/* Bulk Reorder Cart & Dynamic Pricing */
function initBulkReorderCart() {
  const reorderTable = document.getElementById('reorder-table-body');
  const addRowBtn = document.getElementById('btn-add-reorder-row');
  const subtotalEl = document.getElementById('reorder-subtotal');
  const discountEl = document.getElementById('reorder-discount');
  const totalEl = document.getElementById('reorder-total');
  const submitReorderBtn = document.getElementById('btn-submit-reorder');

  if (!reorderTable || !addRowBtn) return;

  const catalogItems = [
    { sku: 'HEX-G8-050', name: 'Grade 8 Heavy Hex Bolt 1/2"-13 x 2"', unitPrice: 0.85, pack: 'Box of 100' },
    { sku: 'STR-A325-075', name: 'ASTM A325 Structural Bolt 3/4"-10 x 2-1/2"', unitPrice: 2.10, pack: 'Keg of 250' },
    { sku: 'NUT-2H-075', name: 'Grade 2H Heavy Hex Nut 3/4"-10 Hot-Dip', unitPrice: 0.65, pack: 'Box of 200' },
    { sku: 'WSH-F436-075', name: 'ASTM F436 Hardened Steel Washer 3/4"', unitPrice: 0.35, pack: 'Box of 500' },
    { sku: 'SS-316-037', name: '316 Stainless Socket Head Cap Screw 3/8"-16', unitPrice: 1.45, pack: 'Box of 100' }
  ];

  const tierDiscountPercent = 18; // Gold Tier OEM Discount: 18%

  function updateTotals() {
    let subtotal = 0;
    const rows = reorderTable.querySelectorAll('tr');

    rows.forEach(row => {
      const price = parseFloat(row.dataset.price || '0');
      const qtyInput = row.querySelector('.row-qty-input');
      const qty = parseInt(qtyInput ? qtyInput.value : '0', 10) || 0;
      const rowTotal = price * qty;
      const lineTotalEl = row.querySelector('.row-line-total');
      if (lineTotalEl) {
        lineTotalEl.textContent = '$' + rowTotal.toFixed(2);
      }
      subtotal += rowTotal;
    });

    const discountAmount = subtotal * (tierDiscountPercent / 100);
    const totalAmount = subtotal - discountAmount;

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (discountEl) discountEl.textContent = '-$' + discountAmount.toFixed(2) + ` (${tierDiscountPercent}%)`;
    if (totalEl) totalEl.textContent = '$' + totalAmount.toFixed(2);
  }

  function addRow(item = catalogItems[0], defaultQty = 5) {
    const tr = document.createElement('tr');
    tr.dataset.price = item.unitPrice;

    tr.innerHTML = `
      <td>
        <strong>${item.sku}</strong>
        <div style="font-size: 0.85rem; color: var(--color-text-muted);">${item.name}</div>
      </td>
      <td>${item.pack}</td>
      <td>$${item.unitPrice.toFixed(2)}</td>
      <td style="width: 130px;">
        <input type="number" class="form-control row-qty-input" value="${defaultQty}" min="1" max="1000" style="padding: 6px 10px;">
      </td>
      <td class="row-line-total" style="font-weight: 500; color: var(--color-accent);">$0.00</td>
      <td style="text-align: center;">
        <button type="button" class="btn btn-sm btn-outline btn-remove-row" style="padding: 4px 8px; border: none; color: var(--color-error);">
          <i class="ri-delete-bin-line" style="font-size: 1.15rem;"></i>
        </button>
      </td>
    `;

    const qtyInput = tr.querySelector('.row-qty-input');
    qtyInput.addEventListener('input', updateTotals);

    const removeBtn = tr.querySelector('.btn-remove-row');
    removeBtn.addEventListener('click', () => {
      tr.remove();
      updateTotals();
    });

    reorderTable.appendChild(tr);
    updateTotals();
  }

  // Populate initial rows
  addRow(catalogItems[0], 10);
  addRow(catalogItems[1], 4);
  addRow(catalogItems[2], 8);

  addRowBtn.addEventListener('click', () => {
    const randomItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
    addRow(randomItem, 2);
  });

  if (submitReorderBtn) {
    submitReorderBtn.addEventListener('click', () => {
      const banner = document.getElementById('reorder-success-banner');
      if (banner) {
        banner.style.display = 'flex';
        setTimeout(() => {
          banner.style.display = 'none';
        }, 5000);
      }
    });
  }
}

/* Shipment Status Interactive Timeline */
function initShipmentLookup() {
  const searchInput = document.getElementById('shipment-search-input');
  const searchBtn = document.getElementById('btn-shipment-search');
  const trackerOutput = document.getElementById('shipment-tracker-card');

  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const val = searchInput.value.trim().toUpperCase();
    if (val && trackerOutput) {
      trackerOutput.classList.add('highlight-pulse');
      setTimeout(() => trackerOutput.classList.remove('highlight-pulse'), 1000);
    }
  });
}

/* Invoice Actions */
function initInvoiceActions() {
  const viewInvoiceBtns = document.querySelectorAll('.btn-view-invoice');

  viewInvoiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const invNum = btn.dataset.invoice || 'INV-2026-904';
      alert(`IndustrialPro Invoice ${invNum} retrieved. Downloading certified PDF manifest.`);
    });
  });
}
