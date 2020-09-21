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
      <div class="row col-12 q-my-lg text-h4 text-center">Case Object</div>
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
          <div class="row">
            <q-btn
              color="grey"
              label="Get case detail"
              @click="getCaseDetail(caseId)"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="caseDetail = {}"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ caseDetail }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.caseDetail">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>

      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get case description (reasons)"
              @click="getCaseDescriptionReason"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="caseDescriptionReasons = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ caseDescriptionReasons }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.caseDescriptionReason">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get case description types"
              @click="getCaseDescriptionType"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="caseDescriptionTypes = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ caseDescriptionTypes }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.caseDescriptionType">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get case related"
              @click="getCaseRelated(accountId)"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="casesRelated = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ casesRelated }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.caseRelated">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <div class="row col-12 q-my-lg text-h4 text-center">
        EmailMessage Object
      </div>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get email messages"
              @click="getEmailMessage"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="emailMessages = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ emailMessages }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.emailMessage">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section class="text-h6">
          Add a new email message
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form
            @submit="onSubmitEmailMessageForm"
            @reset="onResetEmailMessageForm"
            class="q-gutter-md"
          >
            <q-input
              v-model="createEmailMessageForm.subject"
              label="Subject"
              hint="Subject for this case"
              :rules="[
                val =>
                  (val && val.length < 100) ||
                  'Please type something with up to 100 characters'
              ]"
              maxlength="100"
              counter
              outlined
              dense
            />
            <q-input
              v-model="createEmailMessageForm.textBody"
              type="textarea"
              label="Text Body"
              hint="Text body for thie email message"
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
            <div>
              <q-btn
                label="Submit"
                type="submit"
                color="primary"
                :loading="emailMessageObj.isLoading"
              />
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
          <pre>{{ emailMessageObj.createEmailMessageResponse }}</pre>
        </q-card-section>
      </q-card>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get emaile messages related to (parentId)"
              @click="getEmailMessageRelated(parentId)"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="emailMessagesRelated = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ emailMessagesRelated }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.emailMessageRelated">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
      <div class="row col-12 q-my-lg text-h4 text-center">
        Subscription Object
      </div>
      <q-card class="col-6 offset-3 q-mt-lg">
        <q-card-section>
          <div class="row">
            <q-btn
              color="grey"
              label="Get subscriptions related to (accountId)"
              @click="getSubscriptionRelated(accountId)"
              flat
              no-caps
            />
            <q-space />
            <q-btn
              color="grey"
              label="Clear"
              @click="subscriptionsRelated = []"
              flat
              no-caps
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="height: 300px">
          <q-scroll-area style="height: 300px;">
            <pre>{{ subscriptionsRelated }}</pre>
          </q-scroll-area>
        </q-card-section>
        <q-inner-loading :showing="isLoading.subscriptionRelated">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {
  firebaseFunctions,
  functionGetAccountsCallable,
  functionGetCasesCallable,
  functionGetCaseDetail,
  functionsGetCaseDescriptionReason,
  functionsGetCaseDescriptionType,
  functionCreateCaseCallable,
  functionsGetCaseRelated,
  functionsGetEmailMessage,
  functionsGetEmailMessageRelated,
  functionsCreateEmailMessage,
  functionsGetSubscriptionRelated
} from "boot/firebase";
import { date } from "quasar";

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
      caseId: "5004K000001UzzBQAS",
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
      createCaseFormTypeOptions: ["Type1", "Type2", "Type3"],
      caseDetail: {},
      caseDescriptionReasons: [],
      caseDescriptionTypes: [],
      casesRelated: [],
      emailMessages: [],
      emailMessagesRelated: [],
      emailMessageObj: {
        isLoading: false,
        createEmailMessageResponse: null
      },
      parentId: "5004K000001UzzBQAS",
      createEmailMessageForm: {
        parentId: "5004K000001UzzBQAS",
        subject: null,
        textBody: null,
        messageDate: null
      },
      subscriptionsRelated: [],
      isLoading: {
        caseDetail: false,
        caseDescriptionReason: false,
        caseDescriptionType: false,
        caseRelated: false,
        emailMessage: false,
        emailMessageRelated: false,
        subscriptionRelated: false
      }
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
    getCaseDetail(caseId) {
      console.log("This is the case ID :" + caseId);
      this.isLoading.caseDetail = true;
      functionGetCaseDetail({ caseId: caseId })
        .then(response => {
          console.log(response.data);
          this.caseDetail = response.data;
          this.isLoading.caseDetail = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.caseDetail = false;
        });
    },
    getCaseDescriptionReason() {
      this.isLoading.caseDescriptionReason = true;
      functionsGetCaseDescriptionReason()
        .then(response => {
          console.log(response.data);
          this.caseDescriptionReasons = response.data;
          this.isLoading.caseDescriptionReason = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.caseDescriptionReason = false;
        });
    },
    getCaseDescriptionType() {
      this.isLoading.caseDescriptionType = true;
      functionsGetCaseDescriptionType()
        .then(response => {
          console.log(response.data);
          this.caseDescriptionTypes = response.data;
          this.isLoading.caseDescriptionType = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.caseDescriptionType = false;
        });
    },
    getCaseRelated(accountId) {
      this.isLoading.caseRelated = true;
      functionsGetCaseRelated({ accountId: accountId })
        .then(response => {
          console.log(response.data);
          this.casesRelated = response.data;
          this.isLoading.caseRelated = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.caseRelated = false;
        });
    },
    onSubmitCaseForm() {
      this.caseObj.isLoading = true;

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
    // EmailMessage
    getEmailMessage() {
      this.isLoading.emailMessage = true;

      functionsGetEmailMessage()
        .then(response => {
          console.log(response.data);
          this.emailMessages = response.data;
          this.isLoading.emailMessage = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.emailMessage = false;
        });
    },
    getEmailMessageRelated(parentId) {
      this.isLoading.emailMessageRelated = true;

      functionsGetEmailMessageRelated({ parentId: parentId })
        .then(response => {
          console.log(response.data);
          this.emailMessagesRelated = response.data;
          this.isLoading.emailMessageRelated = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.emailMessageRelated = false;
        });
    },
    onSubmitEmailMessageForm() {
      this.emailMessageObj.isLoading = true;

      functionsCreateEmailMessage({
        parentId: this.parentId,
        subject: this.createEmailMessageForm.subject,
        textBody: this.createEmailMessageForm.textBody,
        messageDate: this.getNow()
      })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "o_cloud_done",
            message: "Submitted"
          });
          this.emailMessageObj.createEmailMessageResponse = response.data;
          this.onResetEmailMessageForm();
          this.emailMessageObj.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.emailMessageObj.isLoading = false;
        });
    },
    onResetEmailMessageForm() {
      this.createEmailMessageForm.subject = null;
      this.createEmailMessageForm.textBody = null;
      this.createEmailMessageForm.messageDate = null;
    },
    // Subscriptions
    getSubscriptionRelated(accountId) {
      this.isLoading.subscriptionRelated = true;
      functionsGetSubscriptionRelated({ accountId: accountId })
        .then(response => {
          console.log(response.data);
          this.subscriptionsRelated = response.data;
          this.isLoading.subscriptionRelated = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.details);
          this.isLoading.subscriptionRelated = false;
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
    },
    getNow() {
      // const today = new Date();
      // const date =
      //   today.getFullYear() +
      //   "-" +
      //   (today.getMonth() + 1) +
      //   "-" +
      //   today.getDate();
      // const time =
      //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // const dateTime = date + " " + time;
      let newTimeStamp = Date.now();
      let formattedString = date.formatDate(
        newTimeStamp,
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      // this.timestamp = formattedString;
      return formattedString;
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
