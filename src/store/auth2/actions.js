/*
export function someAction (context) {
}
*/
export function registerUser({}, payload) {
  Loading.show();
  firebaseAuth
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      console.log("response: ", response);
    })
    .catch(error => {
      showErrorMessage(error.message);
    });
}
export function loginUser({ dispatch }, payload) {
  Loading.show();
  firebaseAuth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      console.log("Login response: ", response);
      let user = response.user;
      dispatch("fetchUserProfile", user);
      // this.$router.replace("/");
    })
    .catch(error => {
      showErrorMessage(error.message);
    });
}
export function logoutUser() {
  console.log("logoutUser");
  firebaseAuth.signOut();
}
export async function fetchUserProfile({ commit }, user) {
  // fetch user profile
  const userDoc = await userCollection.doc(user.uid).get();

  // set user profile in state
  commit("setUser", { uid: user.uid, profile: userDoc.data() });

  // change route to dashboard
  if (this.$route === "/auth") {
    router.push("/");
  }
}
export function handleAuthStateChange({ commit, dispatch }) {
  firebaseAuth.onAuthStateChanged(user => {
    Loading.hide();
    if (user) {
      commit("setLoggedIn", true);
      LocalStorage.set("loggedIn", true);
      this.$router.replace("/");
    } else {
      commit("setLoggedIn", false);
      LocalStorage.set("loggedIn", false);
      this.$router.replace("/auth");
    }
  });
}
