<template>
  <v-card>
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field v-model="form.username" label="Username"></v-text-field>
        <v-text-field v-model="form.password" label="Password" type="password"></v-text-field>
        <v-btn color="primary" type="submit">Login</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
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
  props: {
    loggedIn: {
      type: Boolean,
      required: true
    }
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
          console.log(role);
          this.$emit('loginSuccess', token, role);
        })
        .catch(error => {
          console.error('Login error:', error);
        });
    },
  },
};
</script>
