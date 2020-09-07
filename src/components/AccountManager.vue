<template>
  <q-card class="col-12 q-mb-md">
    <q-card-section class="text-h6">
      Account Manager
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row">
        <div class="col q-gutter-md">
          <div class="text-h6">
            {{ accountManager.Name }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-inner-loading :showing="isLoading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
export default {
  name: "AccountManager",
  props: ["ownerId"],
  data() {
    return {
      isLoading: false,
      accountManager: {}
    };
  },
  methods: {
    getAccountManager(userId) {
      this.isLoading = true;
      this.$axios
        .get(`http://localhost:3000/user/${userId}`)
        .then(respone => {
          this.accountManager = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    }
  },
  mounted() {
    console.log(this.ownerId);
    this.getAccountManager(this.ownerId);
  }
};
</script>

<style></style>
