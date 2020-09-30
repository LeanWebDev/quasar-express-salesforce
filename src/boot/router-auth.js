import { LocalStorage } from "quasar";
import { firebaseAuth } from "./firebase";

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    console.log(
      "This is the current user!: " + JSON.stringify(firebaseAuth.currentUser)
    );
    // let loggedIn = LocalStorage.getItem("loggedIn");
    if (!firebaseAuth.currentUser && requiresAuth) {
      next("/auth");
    } else {
      next();
    }
  });
};
