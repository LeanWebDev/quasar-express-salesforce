<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The EmailMessage Object</div>
      </div>
      <div v-if="errored" class="row">
        <div class="col text-center text-negative">
          An error has occured.
        </div>
      </div>
      <div v-else class="row">
        <div class="col-8 offset-2">
          <div class="row q-col-gutter-md">
            <div
              class="col-4"
              v-for="(email, index) in emailMessages"
              :key="index"
            >
              <q-card class="cursor-pointer">
                <q-card-section>
                  <div class="text-h6">{{ email.Subject }}</div>
                  <div class="text-subtitle2">{{ email.TextBody }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-gutter-sm">
                  <q-badge
                    v-if="email.Status"
                    color="secondary"
                    :label="email.Status"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      emailMessages: [],
      errored: false
    };
  },
  methods: {
    getEmailMessages() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/email-message/all")
        .then(response => {
          this.emailMessages = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    }
    // toEmailMessageDetail(caseObjectId) {
    //   this.$router.push({ path: `/case/${caseObjectId}` });
    // }
  },
  mounted() {
    this.getEmailMessages();
  }
};
</script>

<style></style>
