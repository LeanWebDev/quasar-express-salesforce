<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-mb-lg">
        <div class="text-h5 text-center">Cloud Functions</div>
      </div>
      <q-card class="col-6 offset-3">
        <q-card-section>
          <div class="text-h6">Environment</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list bordered>
            <q-item
              v-for="(item, index) in lwdFbConfig"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="text-h6">getAccountsCallable</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-btn
            color="primary"
            label="Call"
            @click="getAccountsCallable"
            no-caps
            unelevated
          />
        </q-card-section>
        <q-card-section>
          <q-scroll-area style="height: 300px;">
            <q-list bordered rounded>
              <q-item
                v-for="(account, index) in accounts"
                :key="index"
                clickable
                v-ripple
              >
                <q-item-section
                  >{{ account.Name }}
                  <q-item-label caption>
                    {{ account.Id }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoadingAccounts">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="text-h6">getCasesCallable</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-btn
            color="primary"
            label="Call"
            @click="getCasesCallable"
            no-caps
            unelevated
          />
        </q-card-section>
        <q-card-section>
          <q-scroll-area style="height: 300px;">
            <q-list bordered rounded>
              <q-item
                v-for="(caseObj, index) in cases"
                :key="index"
                clickable
                v-ripple
              >
                <q-item-section
                  >{{ caseObj.Subject }}
                  <q-item-label caption>
                    {{ caseObj.Status }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoadingCases">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="text"
            type="text"
            label="Text"
            hint="For AuthedFunction"
            outlined
            dense
          />
          <q-btn
            color="primary"
            label="Send"
            @click="postAuthedFunction(text)"
            no-caps
            unelevated
          />
        </q-card-section>
        <q-card-section>
          <pre>
            {{ sanitizedMessage }}
          </pre>
        </q-card-section>
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
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <q-space />
          <q-btn
            color="grey"
            label="Get accounts"
            @click="getAccountsFunc"
            flat
            no-caps
          />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="accounts" style="height: 300px">
          No accounts yet
        </q-card-section>
        <q-scroll-area v-else style="height: 300px;">
          <q-list>
            <q-item
              v-for="(account, index) in accounts"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section caption>
                <q-icon :label="account.Id" />
              </q-item-section>
              <q-item-section>{{ account.Name }}</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-inner-loading :showing="isLoadingAccounts">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { firebaseFunctions } from "boot/firebase";

export default {
  data() {
    return {
      lwdFbConfig: {
        apiKey: process.env.LWD_API_KEY,
        authDomain: process.env.LWD_AUTH_DOMAIN,
        databaseURL: process.env.LWD_DATABASE_URL,
        projectId: process.env.LWD_PROJECT_ID,
        storageBucket: process.env.LWD_STORAGE_BUCKET,
        messagingSenderId: process.env.LWD_MESSAGING_SENDER_ID,
        appId: process.env.LWD_APP_ID,
        measurementId: process.env.LWD_MEASUREMENT_ID
      },
      accountId: "0014K000004X8MNQA0",
      text: null,
      sanitizedMessage: null,
      isLoadingAuthedFunction: false,
      accounts: null,
      cases: null,
      isLoadingAccounts: false,
      isLoadingCases: false,
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
    getAccountsFunc() {
      this.isLoadingAccounts = true;
      this.$axios
        .get(process.env.LWD_FUNC_GET_ACCOUNT_ALL_URL)
        .then(response => {
          this.accounts = response.data;
          this.isLoadingAccounts = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoadingAccounts = false;
        });
    },
    getAccountsCallable() {
      this.isLoadingAccounts = true;
      const functionGetAccountsCallable = firebaseFunctions.httpsCallable(
        "getAccountsCallable"
      );
      functionGetAccountsCallable()
        .then(response => {
          console.log(response.data);
          this.accounts = response.data;
          this.isLoadingAccounts = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoadingAccounts = false;
        });
    },
    // Cases
    getCasesCallable() {
      this.isLoadingCases = true;
      const functionGetCasesCallable = firebaseFunctions.httpsCallable(
        "getCasesCallable"
      );
      functionGetCasesCallable()
        .then(response => {
          console.log(response.data);
          this.cases = response.data;
          this.isLoadingCases = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoadingCases = false;
        });
    },
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
            this.getCasesCallable();
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
    this.getCasesCallable();
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
  }
};
</script>

<style></style>
