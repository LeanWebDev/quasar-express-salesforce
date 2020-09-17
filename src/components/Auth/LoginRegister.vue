<template>
  <q-form @submit.prevent="submitForm">
    <div class="row q-mb-md">
      <q-banner class="bg-orange-1 text-orange col" rounded>
        <template v-slot:avatar>
          <q-icon name="o_account_circle" color="orange"></q-icon>
        </template>
        {{ tab | titleCase }} to access Quasar x Express x Salesforce!
      </q-banner>
    </div>
    <div class="row q-mb-md">
      <q-input
        v-model="formData.email"
        class="col"
        outlined
        dense
        label="Email"
        stack-label
        ref="email"
        :rules="[
          val =>
            isValidEmailAddress(val) || 'Please enter a valid email address.'
        ]"
        lazy-rules
      ></q-input>
    </div>
    <div class="row q-mb-md">
      <q-input
        v-model="formData.password"
        class="col"
        outlined
        dense
        label="Password"
        type="password"
        stack-label
        ref="password"
        :rules="[
          val => val.length >= 6 || 'Please use a minimum of 6 characters.'
        ]"
        lazy-rules
      ></q-input>
    </div>
    <div class="row">
      <q-space />
      <q-btn type="submit" color="primary" :label="tab" />
    </div>
  </q-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["tab"],
  data() {
    return {
      formData: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions("auth", ["registerUser", "loginUser"]),
    submitForm() {
      this.$refs.email.validate();
      this.$refs.password.validate();
      if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
        if (this.tab == "login") {
          this.loginUser(this.formData);
        } else {
          this.registerUser(this.formData);
        }
      }
    },
    isValidEmailAddress(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  },
  filters: {
    titleCase(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style></style>
