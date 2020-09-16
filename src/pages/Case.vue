<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The Case Object</div>
        <q-space />
        <q-btn
          color="primary"
          icon="assignment"
          label="New Case"
          @click="showCreateCase = true"
          no-caps
        />
      </div>
      <div class="row q-mb-xl">
        <div class="col-12 text-center text-h5">Web-To-Case</div>
        <q-separator />
        <div class="col-3 offset-3 q-pt-xl">
          <web-to-case />
        </div>
        <div class="col-3 q-pt-xl">
          <q-web-to-case />
        </div>
        <q-separator class="q-mt-xl" />
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
              v-for="(caseObject, index) in cases"
              :key="index"
            >
              <q-card
                @click="toCaseDetail(caseObject.Id)"
                class="cursor-pointer"
              >
                <q-card-section>
                  <div class="text-h6">{{ caseObject.Subject }}</div>
                  <div class="text-subtitle2">{{ caseObject.Id }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-gutter-sm">
                  <q-badge
                    v-if="caseObject.Reason"
                    color="secondary"
                    :label="caseObject.Reason"
                  />
                  <q-badge
                    v-if="caseObject.Type"
                    color="accent"
                    :label="caseObject.Type"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="showCreateCase">
      <q-card class="col-12 q-pa-md" style="width: 400px">
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
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="isLoading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  components: {
    "web-to-case": require("../components/WebToCase.vue").default,
    "q-web-to-case": require("../components/QWebToCase.vue").default
  },
  data() {
    return {
      isLoading: false,
      cases: [],
      errored: false,
      showCreateCase: false,
      createCaseForm: {
        accountId: "",
        subject: null,
        description: null,
        reason: null,
        type: null,
        accept: false
      },
      createCaseFormReasonOptions: ["Reason1", "Reason2", "Reason3"],
      createCaseFormTypeOptions: ["Type1", "Type2", "Type3"],
      name: null,
      age: null
    };
  },
  methods: {
    getCases() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/case/all")
        .then(response => {
          this.cases = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    },
    toCaseDetail(caseObjectId) {
      this.$router.push({ path: `/case/${caseObjectId}` });
    },
    onSubmitCaseForm() {
      if (this.createCaseForm.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the rules and terms first"
        });
      } else {
        this.$axios
          .post("http://localhost:3000/case/new", {
            accountId: this.createCaseForm.accountId,
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
              icon: "cloud_done",
              message: "Submitted"
            });
            this.showCreateCase = false;
            this.onResetCaseForm();
            this.getCases();
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
    }
  },
  mounted() {
    this.getCases();
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
  }
};
</script>

<style></style>
