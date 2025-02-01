import { reactive } from "vue";

export const cart = reactive({
  items: [],
  get count() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },
  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  },
});
