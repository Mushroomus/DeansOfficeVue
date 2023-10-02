<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex items-center">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" width="30" alt="" />
        </a>

        <a href="#" class="text-sm font-semibold leading-6 text-gray-900 ml-4">Dean's Office</a>
        <router-link v-if="role == 'ADMIN'" to= "/workers" class="text-sm font-semibold leading-6 text-gray-900 ml-4">Workers</router-link>
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900 ml-4">Help</a>

        <div v-if="role == 'USER'" class="relative ml-4" ref="dropdown">
          <button @click="toggleDropdown" class="text-sm font-semibold leading-6 text-gray-900">
            Appointments
          </button>
          <div v-show="showDropdown" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <router-link to="/createAppointment" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">New Appointment</router-link>
              <router-link to="/studentAppointments" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Appointments</router-link>
            </div>
          </div>
          <router-link to="/studentProfile" class="text-sm font-semibold leading-6 text-gray-900 ml-4" role="menuitem">Student Profile</router-link>
        </div>
      </div>

      <div class="hidden lg:flex lg:justify-end">

      <div v-if="showLogoutNotification">
          <div class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
          <span class="font-semibold mr-2 text-left flex-auto">You have been log out</span>
          </div>
      </div>

        <router-link v-if="loggedIn" to="/home">
          <button
            class="text-sm font-semibold leading-6 text-gray-900 border border-gray-900 rounded-md px-4 py-2 ml-4 hover:bg-gray-900 hover:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
            @click="logout"
          >
            Log out
          </button>
          </router-link>
        <router-link v-else to="/login">
          <button
            class="text-sm font-semibold leading-6 text-gray-900 border border-gray-900 rounded-md px-4 py-2 ml-4 hover:bg-gray-900 hover:text-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
          >
            Log in
          </button>
        </router-link>
      </div>
    </nav>
  </header>
  <main>
      <router-view></router-view>
  </main>
</template>

<script>
import eventBus from './eventBus';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import 'font-awesome/css/font-awesome.css'

export default {
  data() {
    return {
      loggedIn: false,
      showLogoutNotification: false,
      role: ''
    };
  },
  setup() {
    const showDropdown = ref(false);

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const closeDropdown = (event) => {
  if (!event.target.closest('.text-gray-900')) {
    showDropdown.value = false;
  }
};

      onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });
   

    return {
      showDropdown,
      toggleDropdown
    };
  },
  mounted() {
    const router = useRouter();

    eventBus.$on('login-success', (token, role) => {
      this.loggedIn = true;
      localStorage.setItem('token', token);
      this.role = role;
      router.push('/home');
    });
  },
  methods: {
    logout() {
      this.loggedIn = false;
      localStorage.removeItem('token');
      this.showLogoutNotification = true;
      setTimeout(() => {
        this.showLogoutNotification = false;
      }, 3000); 
    },
  }
};
</script>

