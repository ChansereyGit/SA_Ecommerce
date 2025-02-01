<template>
  <div class="container">
    <!-- Modal for Token and ID Input -->
    <div v-if="showModal" class="overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeModal">
          <ion-icon name="close-outline"></ion-icon>
        </button> 
        <div class="newsletter">
          <form @submit.prevent="saveCredentials">
            <div class="newsletter-header">
              <h3 class="newsletter-title">Enter Telegram Bot Token & Chat ID</h3>
              <p class="newsletter-desc">Provide the <b>Telegram Bot Token</b> and <b>Chat ID</b> to receive order notifications.</p>
            </div>
            <div>
              <label for="token">Bot Token:</label>
              <input type="text" v-model="token" id="token" placeholder="Enter Bot Token" required />
            </div>
            <div>
              <label for="chatId">Chat ID:</label>
              <input type="text" v-model="chatId" id="chatId" placeholder="Enter Chat ID" required />
            </div>
            <button type="submit" class="btn-newsletter">Save</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal for Bot Info -->
    <div v-if="showSuccessModal" class="overlay" @click="closeSuccessModal"></div>
    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeSuccessModal">
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <div class="success-message">
          <h3>Bot Credentials Saved Successfully!</h3>
          <p>You can now place an order and receive Telegram notifications.</p>
        </div>
      </div>
    </div>

    <!-- Success Modal for Order -->
    <div v-if="orderSuccessModal" class="overlay" @click="closeOrderSuccessModal"></div>
    <div v-if="orderSuccessModal" class="modal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeOrderSuccessModal">
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <div class="success-message">
          <h3>Order Placed Successfully!</h3>
          <p>Your order has been placed and a notification was sent to Telegram.</p>
        </div>
      </div>
    </div>

    <!-- Your regular page content -->
    <div class="row">
      <div class="col-12">
        <h2 class="title">Checkout</h2>

        <div class="checkout-wrapper">
          <!-- Cart Section (60% width) -->
          <div class="cart-section">
            <h3>Shopping Cart</h3>
            <table class="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.items" :key="item.id">
                  <td>
                    <img :src="item.image" alt="item.title" class="cart-img" />
                  </td>
                  <td>{{ item.title }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>
                    <button @click="updateQuantity(item, -1)">-</button>
                    {{ item.quantity }}
                    <button @click="updateQuantity(item, 1)">+</button>
                  </td>
                  <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
                  <td><button @click="removeItem(item.id)" class="remove-btn">Remove</button></td>
                </tr>
              </tbody>
            </table>
            <h3 class="total">Cart Total: ${{ cartTotal.toFixed(2) }}</h3>
          </div>

          <!-- Form Section (40% width) -->
          <div class="form-section">
            <h3>Shipping & Billing Info</h3>
            <form @submit.prevent="submitOrder">
              <label>Name:</label>
              <input v-model="form.name" required />

              <label>Email:</label>
              <input v-model="form.email" type="email" required />

              <label>Address:</label>
              <input v-model="form.address" required />

              <label>City:</label>
              <input v-model="form.city" required />

              <label>Zip Code:</label>
              <input v-model="form.zip" required />

              <label>Phone:</label>
              <input v-model="form.phone" required />

              <button type="submit" class="checkout-btn" :disabled="!token || !chatId">Place Order</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { cart } from "@/cart";
import { ref, computed } from "vue";
import axios from "axios";

// Form for checkout
const form = ref({
  name: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  phone: "",
});

// Modal state
const showModal = ref(true); // Show modal when page loads
const token = ref("");
const chatId = ref("");

// Cart total calculation
const cartTotal = computed(() =>
  cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
);

// Remove item from cart
const removeItem = (id) => {
  cart.items = cart.items.filter((item) => item.id !== id);
};

// Update item quantity
const updateQuantity = (item, change) => {
  item.quantity = Math.max(1, item.quantity + change);
};

// Handle modal close
const closeModal = () => {
  showModal.value = false; // Close modal
};

// Handle success modal close
const closeSuccessModal = () => {
  showSuccessModal.value = false; // Close success modal
};

// Handle order success modal close
const closeOrderSuccessModal = () => {
  orderSuccessModal.value = false; // Close order success modal
};

// Success modals states
const showSuccessModal = ref(false);
const orderSuccessModal = ref(false);

// Save token and chatId
const saveCredentials = () => {
  if (token.value && chatId.value) {
    // You can store token and chatId in localStorage or Vuex for later use
    localStorage.setItem("botToken", token.value);
    localStorage.setItem("chatId", chatId.value);
    showModal.value = false; // Close modal after saving
    showSuccessModal.value = true; // Show success modal
  }
};

// Submit order and send to Telegram
const submitOrder = async () => {
  const orderDetails = {
    name: form.value.name,
    email: form.value.email,
    address: form.value.address,
    city: form.value.city,
    zip: form.value.zip,
    phone: form.value.phone,
    cartItems: cart.items,
    totalPrice: cartTotal.value.toFixed(2),
  };

  const message = `
    📦 *New Order Received!*
    *Customer Information:*
    🧑‍💻 *Name:* ${orderDetails.name}
    📧 *Email:* ${orderDetails.email}
    🏠 *Address:* ${orderDetails.address}
    🏙️ *City:* ${orderDetails.city}
    🔢 *Zip Code:* ${orderDetails.zip}
    📱 *Phone:* ${orderDetails.phone}
    *Cart Items:*
    ${orderDetails.cartItems
      .map((item) => `🛍️ *${item.title}* (x${item.quantity})`)
      .join("\n")}
    *Total Price:* 💵 $${orderDetails.totalPrice}
    📅 *Thank you for your order!*
  `;

  try {
    const botToken = localStorage.getItem("botToken");
    const chatId = localStorage.getItem("chatId");

    if (!botToken || !chatId) {
      alert("Bot credentials are missing. Please provide them first.");
      return;
    }

    const escapedMessage = message.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1');

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: escapedMessage,
        parse_mode: "MarkdownV2", 
      }
    );

    orderSuccessModal.value = true; // Show order success modal
    cart.items = []; // Clear cart after order
  } catch (error) {
    console.error("Error sending notification to Telegram bot:", error);
    alert("Something went wrong. Please try again.");
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

/* Modal Styles */
/* Center the modal using flexbox */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1000;
}






/* Success Modal Styles */
.success-modal {
  width: 300px;
  max-height: 200px;
}


.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center horizontally */
  align-items: center; 
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: red;
}

.newsletter-img img {
  width: 100%;
  height: auto;
}

.newsletter {
  width: 100%;
}

.newsletter-header {
  text-align: center;
  margin-bottom:  10px;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.newsletter-desc {
  font-size: 1rem;
  margin-top: 10px;
}

.btn-newsletter{
  margin-top: 20px;
}



.success-message {
  padding: 20px;
}

.checkout-wrapper {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.cart-section {
  flex: 0 0 60%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  flex: 0 0 40%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th, .cart-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.cart-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.remove-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.remove-btn:hover {
  background: #e60000;
}



.checkout-btn {
  margin-top: 20px;
  width: 100%;
  background: #ff6f61;
  color: white;
  padding: 12px 20px;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
}
</style>
