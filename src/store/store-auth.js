import { LocalStorage, Loading } from "quasar";
import { firebaseAuth, firebaseDb, userCollection } from "boot/firebase";
import { showErrorMessage } from "src/plugins/function-show-error-message";
import router from "../router/index";

const state = {
  user: {},
  preferences: {
    darkMode: false
  },
  loggedIn: false,
  token: null,
  authStatus: false
};

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  setUser(state, val) {
    state.user.uid = val.uid;
    state.user.profile = val.profile;
  },
  setDarkMode(state, val) {
    state.isDark = val;
  }
};

const actions = {
  registerUser({}, payload) {
    Loading.show();
    firebaseAuth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log("response: ", response);
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
  },
  loginUser({ dispatch }, payload) {
    Loading.show();
    firebaseAuth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log("Login response: ", response);
        let user = response.user;
        dispatch("fetchUserProfile", user);
        // this.$router.replace("/");
        // change route to dashboard
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
    if (this.$route === "/auth") {
      this.$router.push("/");
    }
  },
  logoutUser({ commit }) {
    console.log("logoutUser");
    firebaseAuth.signOut();
    commit("setUser", null);
  },
  handleAuthStateChange({ commit, dispatch }) {
    firebaseAuth.onAuthStateChanged(user => {
      Loading.hide();
      if (user) {
        commit("setLoggedIn", true);
        LocalStorage.set("loggedIn", true);
        dispatch("fetchUserProfile", user);
        // this.$router.replace("/");
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        this.$router.replace("/auth");
      }
    });
  },
  async fetchUserProfile({ commit }, user) {
    // fetch user profile
    const userDoc = await userCollection.doc(user.uid).get();

    // set user profile in state
    commit("setUser", { uid: user.uid, profile: userDoc.data() });
  },
  async fetchPreferences({ commit }, user) {
    // fetch user profile
    const userDoc = await userCollection.doc(user.uid).get();

    // set user profile in state
    commit("setUser", { uid: user.uid, profile: userDoc.data() });
    commit("setDarkMode");
  },
  async updateProfile({ dispatch }, user) {
    if (!firebaseAuth.currentUser) {
      return console.log("Current user could not be found.");
    }
    let userId = firebaseAuth.currentUser.uid;
    // update user object
    console.log("Should have the UserID at this point:" + userId);
    const userDoc = await userCollection.doc(userId).update({
      preferences: {
        darkMode: user.preferences.darkMode
      }
    });
    console.log("Updated this user doc: " + userDoc);
    dispatch("fetchUserProfile", { uid: userId });
  }
};

const getters = {
  isAuthenticated: state => {
    console.log("state: ", state);
    return !!state.token;
  },
  user: state => {
    console.log("this is from above" + JSON.stringify(state.user));
    state.user;
  },
  test: state => state.authStatus,
  isDarkMode: state => {
    console.log(
      "I'm being called from state, this is the state: " + JSON.stringify(state)
    );
    return state.user.profile.preferences.darkMode;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
