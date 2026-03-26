const STORAGE_KEY = 'منتجات الزرهوني_products';

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Quantum Wireless Headphones',
    price: 299.99,
    description: 'Experience pure audio fidelity with our premium noise-cancelling wireless headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p2',
    name: 'Nebula Smartwatch',
    price: 199.50,
    description: 'Track your fitness, health, and stay connected with the sleek Nebula Smartwatch.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p3',
    name: 'Aero Mechanical Keyboard',
    price: 149.00,
    description: 'Elevate your typing experience with tactile mechanical switches and RGB backlighting.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p4',
    name: 'Luminary Desk Lamp',
    price: 89.99,
    description: 'Modern minimalist desk lamp with adjustable color temperature and brightness.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600'
  }
];

class Store {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    }
  }

  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  getProduct(id) {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: 'p' + Date.now().toString()
    };
    products.push(newProduct);
    this._save(products);
    return newProduct;
  }

  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this._save(products);
      return products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    this._save(newProducts);
  }

  _save(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Dispatch custom event so other tabs/components can react to data changes
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  }
}

// Global instance
window.appStore = new Store();
