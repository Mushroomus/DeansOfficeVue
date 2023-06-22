import { createRouter, createWebHistory } from 'vue-router';
import UserTable from './components/UserTable.vue';

const routes = [
  { path: '/users', component: UserTable },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;