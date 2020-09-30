import Vue from "vue";
import Vuex from "vuex";
import auth from "./store-auth";
import createPersistedState from "vuex-persistedstate";

// Use a new variable and export values to change default behaviour.
let store = null;

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      auth
    },
    plugins: [createPersistedState()],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });
  // add this so that we export store
  store = Store;

  return Store;
}

export { store };
