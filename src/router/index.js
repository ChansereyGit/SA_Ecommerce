import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AddToCartView from '../views/AddToCartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/product/:id', // ✅ Dynamic route for product details
      name: 'ProductDetail',
      component: ProductDetailView,
      props: true // ✅ Enables passing route params as props
    },
    {
      path: '/addToCart',
      name: 'AddToCart',
      component: AddToCartView,
    }
  ],
  
})

export default router
