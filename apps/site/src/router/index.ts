import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/router/index.vue";
import "../../global.css";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView
    }
  ],
})

export default router
