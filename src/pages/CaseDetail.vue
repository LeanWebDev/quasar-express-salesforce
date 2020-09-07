<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-12 text-center text-h3">
        {{ caseObject.Subject }} ({{ caseObject.CaseNumber }})
      </div>
    </div>
    <div class="row ">
      <div class="col-6 offset-3">
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Case Profile
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <pre>{{ caseObject }}</pre>
              <!-- <div class="col q-gutter-md">
                <q-input
                  :value="account.Website"
                  type="url"
                  label="Website"
                  outlined
                  dense
                />
                <q-input
                  :value="account.Phone"
                  type="tel"
                  label="Phone"
                  outlined
                  dense
                />
                <q-input
                  :value="account.Industry"
                  type="text"
                  label="Industry"
                  outlined
                  dense
                />
                <q-input
                  :value="account.NumberOfEmployees"
                  type="text"
                  label="Number of employees"
                  outlined
                  dense
                />
              </div> -->
            </div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Related Email Messages
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-scroll-area style="height: 200px;">
              <div class="q-pa-md row justify-center">
                <div style="width: 100%; max-width: 400px">
                  <q-chat-message
                    v-for="(email, index) in emailMessages"
                    :key="index"
                    sent
                    >{{ email.TextBody }}</q-chat-message
                  >
                  <!-- <q-chat-message :text="['hey, how are you?']" sent />
                  <q-chat-message :text="['doing fine, how r you?']" /> -->
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <pre>{{ emailMessages }}</pre>
            </div>
          </q-card-section>
        </q-card>
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
      caseObjectId: "",
      caseObject: {},
      emailMessages: []
    };
  },
  methods: {
    getCaseDetail(caseObject) {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/case/" + caseObject)
        .then(response => {
          this.caseObject = response.data;
          this.getEmailMessages(response.data.Id);
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
      this.isLoading = true;
    },
    getEmailMessages(parentId) {
      console.log(parentId);
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/email-message/related/" + parentId)
        .then(response => {
          this.emailMessages = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
      this.isLoading = true;
    }
  },
  mounted() {
    this.caseObjectId = this.$route.params.caseObjectId;
    this.getCaseDetail(this.caseObjectId);
  }
};
</script>

<style></style>
