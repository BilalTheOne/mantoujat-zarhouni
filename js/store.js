// 1. Paste Your Supabase Details Here!
const supabaseUrl = 'https://vygouszancdykvaevqjg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Z291c3phbmNkeWt2YWV2cWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDAwMjgsImV4cCI6MjA5MDExNjAyOH0.Z8ji1j9-L_vRR2kfZsR_C4hY8geF3Au2HAWSmHuW6qk';

// 2. Initialize the DB client
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

class Store {
  constructor() {
    this.products = [];
    if (supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') {
      this.fetchProducts();
    }
  }

  getProducts() {
    return this.products;
  }

  getProduct(id) {
    return this.products.find(p => p.id == id); // Loose equality in case DB id is integer, but JS is string
  }

  async fetchProducts() {
    const { data, error } = await supabaseClient.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    this.products = data || [];
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  }

  async addProduct(productData) {
    const { name, price, description, image } = productData;
    const { data, error } = await supabaseClient
      .from('products')
      .insert([{ name, price, description, image }])
      .select();

    if (error) console.error('Error adding product:', error);
    else if (data && data.length) {
      this.products.push(data[0]);
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
  }

  async updateProduct(id, updates) {
    const { name, price, description, image } = updates;
    const { data, error } = await supabaseClient
      .from('products')
      .update({ name, price, description, image })
      .eq('id', id)
      .select();

    if (error) console.error('Error updating product:', error);
    else if (data && data.length) {
      const index = this.products.findIndex(p => p.id == id);
      if (index !== -1) {
        this.products[index] = data[0];
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      }
    }
  }

  async deleteProduct(id) {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting product:', error);
    else {
      this.products = this.products.filter(p => p.id != id);
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
  }
}

// Global instance
window.appStore = new Store();

