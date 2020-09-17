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
        <div class="col-12 text-center q-py-lg">
          <q-btn
            color="primary"
            icon="o_add"
            label="Add more EmailMessages"
            @click="showCreateEmailMessage = true"
            no-caps
          />
        </div>
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
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Case Email Timeline
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-scroll-area style="height: 300px;">
              <case-activity :activity="emailMessages" />
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
    <q-dialog v-model="showCreateEmailMessage">
      <q-card class="col-12 q-pa-md" style="width: 400px">
        <q-card-section class="text-h6">
          Add EmailMessage to this case
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form
            @submit="onSubmitEmailMessageForm"
            @reset="onResetEmailMessageForm"
            class="q-gutter-md"
          >
            <q-input v-model="createEmailMessageForm.parentId" class="hidden" />
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
              lazy-rules
              outlined
              dense
            />
            <q-input
              v-model="createEmailMessageForm.textBody"
              type="textarea"
              label="Message"
              hint="Message for this EmailMessage"
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
import { date } from "quasar";

export default {
  components: {
    "case-activity": require("components/CaseEmailTimeline.vue").default
  },
  data() {
    return {
      isLoading: false,
      caseObjectId: "",
      showCreateEmailMessage: false,
      timestamp: null,
      createEmailMessageForm: {
        parentId: null,
        subject: null,
        textBody: null
        // createdById: "0014K000004X8MNQA0"
      },
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
      this.timestamp = formattedString;
    },
    onSubmitEmailMessageForm() {
      this.getNow();
      this.$axios
        .post("http://localhost:3000/email-message/new", {
          parentId: this.createEmailMessageForm.parentId,
          subject: this.createEmailMessageForm.subject,
          textBody: this.createEmailMessageForm.textBody,
          messageDate: this.timestamp
          // createdById: this.createEmailMessageForm.createdById
        })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "o_cloud_done",
            message: "Submitted"
          });
          this.showCreateEmailMessage = false;
          this.onResetEmailMessageForm();
          this.getCaseDetail(this.caseObjectId);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },
    onResetEmailMessageForm() {
      this.createEmailMessageForm.subject = null;
      this.createEmailMessageForm.textBody = null;
    }
  },
  mounted() {
    this.caseObjectId = this.$route.params.caseObjectId;
    this.createEmailMessageForm.parentId = this.$route.params.caseObjectId;
    this.getCaseDetail(this.caseObjectId);
  },
  filters: {
    niceDate(value) {
      // value = parseInt(value);
      return date.formatDate(value, "HH:mm, DD/MM/YYYY");
    }
  },
  computed: {
    orderedEmailMessages() {
      return _.orderBy(this.emailMessages, "MessageDate");
    }
  }
};
</script>

<style></style>
