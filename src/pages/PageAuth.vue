<template>
  <q-page padding>
    <q-card class="auth-tabs">
      <q-tabs v-model="tab" class="text-primary">
        <q-tab name="login" label="Login" no-caps />
        <q-tab name="register" label="Register" no-caps />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-register :tab="tab" />
        </q-tab-panel>
        <q-tab-panel name="register">
          <login-register :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  components: {
    "login-register": require("components/Auth/LoginRegister.vue").default
  },
  data() {
    return {
      tab: "login"
    };
  }
};
</script>

<style lang="scss" scoped>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>
