document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container');

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  function renderProducts() {
    // Get products from our global store instance
    const products = window.appStore.getProducts();

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <p>No products available right now.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => `
      <article class="product-card glass-panel">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-content">
          <h2 class="product-title">${product.name}</h2>
          <div class="product-price">${formatPrice(product.price)}</div>
          <p class="product-desc">${product.description}</p>
          <button class="btn btn-primary" style="width: 100%; background-color: #25D366; box-shadow: 0 4px 14px 0 rgba(37, 211, 102, 0.39);" onclick="window.open('https://wa.me/+212648300759?text=' + encodeURIComponent('bch7al: ${product.name}'), '_blank')">
            Order via WhatsApp
          </button>
        </div>
      </article>
    `).join('');
  }

  // Initial render
  renderProducts();

  // Re-render if another tab updates the data (or if we do it programmatically)
  window.addEventListener('storage', (e) => {
    if (e.key === 'منتجات الزرهوني_products') {
      renderProducts();
    }
  });
  window.addEventListener('productsUpdated', renderProducts);
});
