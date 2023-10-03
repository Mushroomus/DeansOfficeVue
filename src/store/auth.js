export default {
  state: {
    token: null,
    role: null,
    id: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
    setRole(state, role) {
      state.role = role;
    },
    clearRole(state) {
      state.role = null;
    },
    setId(state, id) {
      state.id = id;
    },
    clearId(state) {
      state.id = null;
    }
  }
};