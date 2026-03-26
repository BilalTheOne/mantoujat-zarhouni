document.addEventListener('DOMContentLoaded', () => {

  // --- Elements ---
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logoutBtn');

  const tableBody = document.getElementById('admin-products-table');
  const addProductBtn = document.getElementById('addProductBtn');

  const modal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  // --- Authentication ---
  function checkAuth() {
    return sessionStorage.getItem('منتجات الزرهوني_admin_auth') === 'true';
  }

  function toggleViews() {
    if (checkAuth()) {
      loginView.style.display = 'none';
      dashboardView.style.display = 'block';
      renderTable();
    } else {
      loginView.style.display = 'flex';
      dashboardView.style.display = 'none';
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'simo' && pass === 'simo1234') {
      sessionStorage.setItem('منتجات الزرهوني_admin_auth', 'true');
      loginError.style.display = 'none';
      loginForm.reset();
      toggleViews();
    } else {
      loginError.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('منتجات الزرهوني_admin_auth');
    toggleViews();
  });

  // --- Dashboard Logic ---

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Inject helper methods into global scope for inline onclick handlers inside HTML string
  window.editProduct = (id) => {
    const p = window.appStore.getProduct(id);
    if (!p) return;

    modalTitle.textContent = 'Edit Product';
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productImage').value = p.image;
    document.getElementById('productDesc').value = p.description;

    openModal();
  };

  window.deleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      window.appStore.deleteProduct(id);
      renderTable();
    }
  };

  function renderTable() {
    const products = window.appStore.getProducts();

    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem;">No products found. Add one!</td></tr>`;
      return;
    }

    tableBody.innerHTML = products.map(p => `
      <tr>
        <td class="product-thumbnail">
          <img src="${p.image}" alt="${p.name}">
        </td>
        <td style="font-weight: 500;">${p.name}</td>
        <td style="color: #a5b4fc; font-weight: 600;">${formatPrice(p.price)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-ghost" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="window.editProduct('${p.id}')">Edit</button>
            <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="window.deleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- Modal Logic ---
  function openModal() {
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    productForm.reset();
    document.getElementById('productId').value = ''; // clear hidden id
  }

  addProductBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    openModal();
  });

  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const productData = {
      name: document.getElementById('productName').value,
      price: parseFloat(document.getElementById('productPrice').value),
      image: document.getElementById('productImage').value,
      description: document.getElementById('productDesc').value
    };

    if (id) {
      // Edit existing
      window.appStore.updateProduct(id, productData);
    } else {
      // Add new
      window.appStore.addProduct(productData);
    }

    closeModal();
    renderTable();
  });

  // Initial check
  toggleViews();
});
