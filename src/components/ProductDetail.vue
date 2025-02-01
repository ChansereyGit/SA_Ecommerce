<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <div class="product-featured">
          <h2 class="title">Product Detail</h2>

          <div class="showcase-wrapper has-scrollbar">
            <!-- <div class="showcase-container">
                   <div class="showcase">
                     <div class="showcase-banner">
                       <img src="../../assets/images/products/shampoo.jpeg" alt="shampoo, conditioner & facewash packs"
                         class="showcase-img" />
                     </div>
   
                     <div class="showcase-content">
                       <div class="showcase-rating">
                         <ion-icon name="star"></ion-icon>
                         <ion-icon name="star"></ion-icon>
                         <ion-icon name="star"></ion-icon>
                         <ion-icon name="star-outline"></ion-icon>
                         <ion-icon name="star-outline"></ion-icon>
                       </div>
   
                       <a href="#">
                         <h3 class="showcase-title">shampoo, conditioner & facewash packs</h3>
                       </a>
   
                       <p class="showcase-desc">
                         Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor dolor sit amet consectetur Lorem ipsum
                         dolor
                       </p>
   
                       <div class="price-box">
                         <p class="price">$150.00</p>
   
                         <del>$200.00</del>
                       </div>
   
                       <button class="add-cart-btn">add to cart</button>
   
                       <div class="showcase-status">
                         <div class="wrapper">
                           <p>already sold: <b>20</b></p>
   
                           <p>available: <b>40</b></p>
                         </div>
   
                         <div class="showcase-status-bar"></div>
                       </div>
   
                       <div class="countdown-box">
                         <p class="countdown-desc">
                           Hurry Up! Offer ends in:
                         </p>
   
                         <div class="countdown">
                           <div class="countdown-content">
                             <p class="display-number">360</p>
   
                             <p class="display-text">Days</p>
                           </div>
   
                           <div class="countdown-content">
                             <p class="display-number">24</p>
                             <p class="display-text">Hours</p>
                           </div>
   
                           <div class="countdown-content">
                             <p class="display-number">59</p>
                             <p class="display-text">Min</p>
                           </div>
   
                           <div class="countdown-content">
                             <p class="display-number">00</p>
                             <p class="display-text">Sec</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div> -->

            <div class="showcase-container" v-if="product">
              <div class="showcase">
                <div class="showcase-banner">
                  <img
                    style="width: 100%; height: 300px; object-fit: contain"
                    :src="product.image"
                    :alt="product.title"
                    class="showcase-img"
                  />
                </div>
                <div class="showcase-content">
                  <div class="showcase-rating">
                    <ion-icon
                      v-for="n in 5"
                      :key="n"
                      :name="
                        n <= Math.round(product.rating.rate)
                          ? 'star'
                          : 'star-outline'
                      "
                    ></ion-icon>
                  </div>
                  <a href="#">
                    <h3 class="showcase-title" style="color: slategray">
                      {{ product.title }}
                    </h3>
                  </a>
                  <a href="" class="showcase-title" style="color: coral"
                    ><b>Category: </b>{{ product.category }}
                  </a>

                  <p class="showcase-desc">
                    {{ product.description }}
                  </p>
                  <div class="price-box">
                    <p class="price">${{ round(product.price * 0.85, 2) }}</p>
                    <del>${{ product.price }}</del>
                  </div>
                  <button class="add-cart-btn" @click="addToCart">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { cart } from "@/cart"; // Import global cart store

const route = useRoute();
const product = ref(null);

onMounted(async () => {
  const id = route.params.id; // Get product ID from URL
  const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
  product.value = response.data;
});

const addToCart = () => {
  if (product.value) {
    cart.addItem(product.value); // Add product to cart
    console.log("Added to Cart:", cart.items);
  }
};

const round = (value, decimals) => {
  return value ? Number(Math.round(value + "e" + decimals) + "e-" + decimals) : 0;
};
</script>


