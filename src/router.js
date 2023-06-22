import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue'
import MainView from './components/MainView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: MainView},
  { path: '/login', component: LoginForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;