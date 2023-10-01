import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue'
import MainView from './components/MainView.vue'
import WorkersDataTable from './components/WorkersDataTable.vue'
import StudentMakeAppointment from './components/StudentMakeAppointment.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: MainView},
  { path: '/login', component: LoginForm },
  { path: '/workers', name: "Workers", component: WorkersDataTable, props: true },
  { path: '/createAppointment', name: "Create Appointment", component: StudentMakeAppointment, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;