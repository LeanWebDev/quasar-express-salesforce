<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapState("auth", ["user"]),
    ...mapActions("auth", ["handleAuthStateChange"])
  },
  mounted() {
    this.handleAuthStateChange();
  }
};
</script>
