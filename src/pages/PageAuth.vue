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
    <q-card class="col-6 offset-3 q-mt-lg">
      <q-card-section class="text-h6">
        Add a new case
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form
          @submit="onSubmitCaseForm"
          @reset="onResetCaseForm"
          class="q-gutter-md"
        >
          <q-input v-model="createCaseForm.accountId" class="hidden" />
          <q-input
            v-model="createCaseForm.subject"
            label="Subject"
            hint="Subject for this case"
            :rules="[
              val =>
                (val && val.length < 100) ||
                'Please type something with up to 100 characters'
            ]"
            maxlength="100"
            counter
            lazy-rules
            outlined
            dense
          />
          <q-select
            v-model="createCaseForm.reason"
            :options="createCaseFormReasonOptions"
            label="Reason"
            outlined
            dense
            emit-value
          />
          <q-select
            v-model="createCaseForm.type"
            :options="createCaseFormTypeOptions"
            label="Type"
            outlined
            dense
            emit-value
          />
          <q-input
            v-model="createCaseForm.description"
            type="textarea"
            label="Description"
            hint="Description for this case"
            lazy-rules
            :rules="[
              val =>
                (val && val.length < 800) ||
                'Please type something with up to 800 characters'
            ]"
            maxlength="800"
            counter
            outlined
            dense
          />
          <q-toggle
            v-model="createCaseForm.accept"
            label="I accept the rules and terms"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-separator spaced inset />
      <q-card-section>
        <pre>{{ caseObj.createCaseResponse }}</pre>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { firebaseFunctions } from "boot/firebase";

export default {
  components: {
    "login-register": require("components/Auth/LoginRegister.vue").default
  },
  data() {
    return {
      tab: "login",
      accountId: "0014K000004X8MNQA0",
      caseObj: {
        isLoading: false,
        createCaseResponse: null
      },
      createCaseForm: {
        accountId: "",
        subject: null,
        description: null,
        reason: null,
        type: null,
        accept: false
      },
      createCaseFormReasonOptions: ["Reason1", "Reason2", "Reason3"],
      createCaseFormTypeOptions: ["Type1", "Type2", "Type3"]
    };
  },
  methods: {
    onSubmitCaseForm() {
      this.caseObj.isLoading = true;
      const functionCreateCaseCallable = firebaseFunctions.httpsCallable(
        "createCaseCallable"
      );
      if (this.createCaseForm.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "o_warning",
          message: "You need to accept the rules and terms first"
        });
      } else {
        functionCreateCaseCallable({
          accountId: this.accountId,
          subject: this.createCaseForm.subject,
          reason: this.createCaseForm.reason,
          type: this.createCaseForm.type,
          description: this.createCaseForm.description
        })
          .then(response => {
            console.log(response);
            this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "o_cloud_done",
              message: "Submitted"
            });
            this.caseObj.createCaseResponse = response.data;
            this.showCreateCase = false;
            this.onResetCaseForm();
            // this.getCasesCallable();
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    onResetCaseForm() {
      this.createCaseForm.subject = null;
      this.createCaseForm.reason = null;
      this.createCaseForm.type = null;
      this.createCaseForm.description = null;
      this.createCaseForm.accept = false;
    },
    getCreateCaseFormReasonOptions() {
      this.$axios
        .get("http://localhost:3000/case/describe/reason")
        .then(response => {
          this.createCaseFormReasonOptions = response.data;
          console.log(this.createCaseFormReasonOptions);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },
    getCreateCaseFormTypeOptions() {
      this.$axios
        .get("http://localhost:3000/case/describe/type")
        .then(response => {
          this.createCaseFormTypeOptions = response.data;
          console.log(this.createCaseFormTypeOptions);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },
    postAuthedFunction(text) {
      this.isLoadingAuthedFunction = true;
      const functionPostAuthedFunction = firebaseFunctions.httpsCallable(
        "authedFunction"
      );
      functionPostAuthedFunction({ text: text })
        .then(response => {
          console.log(response.data);
          this.sanitizedMessage = response.data.contextObj;
          this.isLoadingAuthedFunction = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoadingAuthedFunction = false;
        });
    }
  },
  mounted() {
    // this.getCasesCallable();
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
  }
};
</script>

<style lang="scss" scoped>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>
