<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 shadow-md rounded-md max-w-md w-full pt-10 pb-8">
      <h2 class="text-3xl font-semibold mb-6">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-3"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-3"
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import eventBus from '../eventBus';

export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        username: '',
        password: '',
      }
    };
  },
  methods: {
    login() {
      fetch('http://localhost:8082/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.form),
      })
        .then(response => response.json())
        .then(data => {
          const token = data.token;
          const role = data.role;

          eventBus.$emit('login-success', token, role);
        })
        .catch(error => {
          console.error('Login error:', error);
        });
    },
  },
};
</script>
