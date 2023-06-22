<template>
  <v-app>
    <v-app-bar app color="indigo">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Dean's Office</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="showLoginForm = true" v-if="!loggedIn">Login</v-btn>
      <v-btn text @click="logout" v-if="loggedIn">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :rail="rail" width="1000px" floating permanent>
      <v-list density="compact" nav>
        <v-list-item v-for="item in filteredMenuItems" :key="item.title" @click="selectMenuItem(item)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>    

    <v-main>
      <v-container>
        <component :is="currentComponent"></component>
        <v-container v-if="showLoginForm">
          <LoginForm :loggedIn="loggedIn" @loginSuccess="loginSuccess" />
        </v-container>
        <router-view v-else></router-view>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import '@mdi/font/css/materialdesignicons.css';

export default {
  data() {
    return {
      drawer: true,
      rail: true,
      showLoginForm: false,
      loggedIn: false,
      token: '',
      role: '',
       menuItems: [
        { icon: "mdi-home-city", value: "home" },
        { icon: "mdi-account", value: "account", roles: ["ADMIN", "WORKER"] },
        { icon: "mdi-account-group-outline", value: "users", roles: ["WORKER"] }
      ],
      currentComponent: 'HomePage'
    };
  },
  components: {
    LoginForm
  },
  computed: {
    filteredMenuItems() {
      return this.menuItems.filter(item => {
        if (item.roles) {
          return item.roles.includes(this.role);
        }
        return true;
      });
    }
  },
  methods: {
    selectMenuItem(item) {
      this.drawer = false;
      this.showLoginForm = false;

      if (item.value === 'users') {
        this.$router.push('/users');
        console.log("users")
      }
    },
    logout() {
      this.loggedIn = false;
      this.token = '';
    },
    loginSuccess(token, role) {
      this.loggedIn = true;
      this.showLoginForm = false;
      this.token = token;
      this.role = role;
    }
  }
};
</script>
