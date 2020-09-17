<template>
  <div>
    <div class="row">
      <div class="col-12 ">
        <div id="section-cases">
          <div class="row q-mb-md">
            <div class="column">
              <q-space />
              <div class="text-weight-regular" style="font-size: 25px">
                Support
              </div>
              <!-- <div class="text-subtitle1">View your account details</div> -->
            </div>
            <q-space />
            <div class="column justify-end">
              <q-space />
              <q-btn
                @click="getRelatedCases(accountId)"
                class="q-mt-lg"
                color="primary"
                icon="o_autorenew"
                size="12px"
                flat
                round
              />
            </div>
          </div>
          <!-- <q-separator spaced /> -->
          <q-card
            class="q-mb-md section-card"
            style="min-height: 250px"
            flat
            bordered
          >
            <q-table
              v-if="cases[0]"
              :data="cases"
              :columns="columns"
              row-key="Subject"
              color="primary"
              :loading="isLoading"
              title="Cases"
              :no-data-label="errorMessage"
              style="min-height: 250px"
            >
              <template v-slot:top-right>
                <q-btn
                  color="primary"
                  label="New Case"
                  @click="showCreateCase = true"
                  class="q-mb-xs"
                  no-caps
                  unelevated
                />
                <q-dialog
                  v-model="showViewCase"
                  :full-width="$q.screen.lt.md"
                  full-height
                >
                  <q-card class="case-dialog">
                    <q-card-section>
                      <div class="row">
                        <div class="col-12 col-md-6 q-py-md q-px-sm">
                          <q-btn
                            v-if="$q.screen.lt.md"
                            class="float-right"
                            color="primary"
                            label="Close"
                            v-close-popup
                            no-caps
                            unelevated
                          />
                          <div class="row text-h5 q-mb-sm">
                            {{ updateCaseForm.Subject }}
                          </div>
                          <span class="row text-subtitle">
                            {{ updateCaseForm.CreatedDate | niceDate }}
                          </span>
                          <div class="row text-caption text-grey">
                            Description
                          </div>
                          <q-card flat>
                            <!-- <q-scroll-area
                              class="case-scroll-area"
                              style="height: 200px"
                            >
                              <div class="row text-body1 ">
                                
                              </div>
                            </q-scroll-area> -->
                            <q-scroll-area
                              class="case-scroll-area"
                              :thumb-style="thumbStyle"
                            >
                              <div class="text-body1 q-py-xs">
                                "{{ updateCaseForm.Description }}"
                              </div>
                            </q-scroll-area>
                          </q-card>
                          <!-- <div class="row q-col-gutter-md q-mb-md">
                            <q-input
                              v-model="updateCaseForm.Subject"
                              class="col"
                              label="Subject"
                              outlined
                              dense
                            ></q-input>
                            <q-select
                              :options="caseTypes"
                              v-model="updateCaseForm.Type"
                              class="col"
                              label="Type"
                              outlined
                              dense
                            ></q-select>
                          </div> -->
                          <!-- <div class="row q-mb-md">
                            <q-input
                              v-model="updateCaseForm.Description"
                              type="textarea"
                              class="col"
                              label="Description"
                              disable
                              readonly
                              outlined
                              dense
                            ></q-input>
                          </div> -->
                        </div>
                        <!-- <q-separator v-if="$q.screen.gt.lg" inset vertical /> -->
                        <div class="col-12 col-md-6 q-py-md">
                          <!-- TODO: (Flex) Make the timeline a responsive height to accomodate the left over space but not make the dialog scroll -->
                          <q-card flat>
                            <q-card-actions class="q-pr-none" align="right">
                              <q-btn
                                @click="updateExpanded = true"
                                label="Send Update"
                                color="primary"
                                no-caps
                                unelevated
                              />
                            </q-card-actions>
                          </q-card>
                          <q-card
                            bordered
                            flat
                            style="margin-top: 8px; background: rgba(0,0,0,0.01)"
                          >
                            <q-scroll-area
                              class="case-scroll-area"
                              ref="timelineScrollArea"
                              :thumb-style="thumbStyle"
                              :content-active-style="contentActiveStyle"
                            >
                              <!-- <case-timeline :activity="caseEmailMessages" /> -->
                              <div class="q-px-lg q-pb-md">
                                <!-- <q-timeline>
                                  <div v-if="caseEmailMessages[0]">
                                    <q-timeline-entry
                                      v-for="(entry,
                                      index) in caseEmailMessages"
                                      :key="index"
                                      :title="entry.Subject"
                                      :subtitle="entry.MessageDate"
                                      side="left"
                                    >
                                      <template slot="subtitle">
                                        {{ entry.MessageDate | niceDate }}
                                      </template>
                                      <div>
                                        {{ entry.TextBody }}
                                      </div>
                                    </q-timeline-entry>
                                    <q-timeline-entry
                                      title="Case opened"
                                      subtitle="12:30, 09/09/2020"
                                      side="left"
                                    />
                                  </div>
                                </q-timeline> -->
                                <div>
                                  <q-timeline>
                                    <q-timeline-entry
                                      v-for="(entry,
                                      index) in caseEmailMessages"
                                      :key="index"
                                      :title="entry.Subject"
                                      :subtitle="entry.MessageDate"
                                      side="left"
                                    >
                                      <template slot="subtitle">
                                        {{ entry.MessageDate | niceDate }}
                                      </template>
                                      <div>
                                        {{ entry.TextBody }}
                                      </div>
                                    </q-timeline-entry>
                                  </q-timeline>
                                </div>

                                <!-- <div v-if="!activity[0]" class="row" style="padding-top: 160px">
      <div class="col text-center">
        No email messages for this case yet.
      </div>
    </div> -->
                              </div>
                            </q-scroll-area>
                            <q-inner-loading :showing="isLoading">
                              <q-spinner-tail size="50px" color="primary" />
                            </q-inner-loading>
                          </q-card>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-dialog>
                <q-dialog
                  v-model="updateExpanded"
                  persistent
                  transition-show="scale"
                  transition-hide="scale"
                  @hide="
                    getRelatedCaseEmailMessages(createEmailMessageForm.parentId)
                  "
                >
                  <q-card style="width: 500px">
                    <q-card-section>
                      <div class="text-h6">Update</div>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      <q-input
                        v-model="createEmailMessageForm.textBody"
                        type="textarea"
                        label="Description"
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
                    </q-card-section>
                    <q-card-actions class="q-pr-md q-pb-md" align="right">
                      <q-btn
                        @click="onResetEmailMessageForm"
                        flat
                        label="Cancel"
                        v-close-popup
                        no-caps
                      />
                      <q-btn
                        @click="
                          onSubmitEmailMessageForm();
                          onResetEmailMessageForm();
                          scrollBackToTop();
                        "
                        label="Send"
                        color="primary"
                        v-close-popup
                        no-caps
                        unelevated
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </template>

              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  @click="viewCase(props.row)"
                  class="cursor-pointer"
                >
                  <q-td key="Subject" :props="props" auto-width>{{
                    props.row.Subject
                  }}</q-td>
                  <q-td key="Status" :props="props" class="text-capitalize">
                    <q-badge v-if="!props.row.ClosedDate" color="positive">
                      Open
                    </q-badge>
                    <q-badge v-if="props.row.ClosedDate" color="grey">
                      Closed
                    </q-badge>
                  </q-td>
                  <!-- <q-td key="Description" :props="props">{{
                  props.row.Description
                }}</q-td> -->
                  <q-td key="Type" :props="props">{{ props.row.Type }}</q-td>
                  <q-td key="Reason" :props="props">{{
                    props.row.Reason
                  }}</q-td>
                  <q-td key="CreatedDate" :props="props">{{
                    props.row.CreatedDate | niceDate
                  }}</q-td>
                  <q-td key="ClosedDate" :props="props">{{
                    props.row.ClosedDate | niceDate
                  }}</q-td>
                </q-tr>
              </template>
            </q-table>
            <div
              v-if="!cases[0] && !isLoading"
              class="text-subtitle text-center"
              style="margin-top: 80px"
            >
              <div class="column q-col-gutter-sm">
                <div class="col">
                  There are no support cases for your account.
                </div>
                <div class="col">
                  <q-btn
                    color="primary"
                    label="New case"
                    @click="showCreateCase = true"
                    unelevated
                    no-caps
                  />
                </div>
              </div>
            </div>

            <q-inner-loading :showing="isLoading">
              <q-spinner-tail v-if="cases[0]" size="40px" color="transparent" />
              <q-spinner-tail v-else size="40px" color="primary" />
            </q-inner-loading>
          </q-card>
          <!-- <skeleton-table v-if="isLoading" /> -->
        </div>
      </div>
    </div>
    <!-- :maximized="$q.screen.lt.md" -->
    <q-dialog
      v-model="showCreateCase"
      :full-width="$q.screen.lt.md"
      :full-height="$q.screen.lt.md"
      @hide="onResetCreateCaseForm"
    >
      <q-card class="create-case-dialog">
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h6">
                Add a new case
                <q-btn
                  class="float-right"
                  color="primary"
                  label="Close"
                  v-close-popup
                  flat
                  no-caps
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="row q-mb-md">
            <q-input v-model="accountId" class="hidden" />
            <q-input
              class="col"
              v-model="createCaseForm.Subject"
              label="Subject"
              hint="Summarise this case"
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
          </div>
          <div class="row q-mb-md">
            <q-select
              class="col"
              v-model="createCaseForm.Reason"
              :options="createCaseFormReasonOptions"
              label="Reason"
              outlined
              dense
              emit-value
            />
          </div>
          <div class="row q-mb-md">
            <q-select
              class="col"
              v-model="createCaseForm.Type"
              :options="createCaseFormTypeOptions"
              label="Type"
              outlined
              dense
              emit-value
            />
          </div>
          <div class="row">
            <q-input
              class="col"
              v-model="createCaseForm.Description"
              type="textarea"
              label="Description"
              hint="Describe this case for our support team"
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
          </div>
        </q-card-section>
        <q-card-actions class="q-pr-md q-pb-md" align="right">
          <!-- <a
                          href="mailto:hello@john.cpm"
                          class="btn"
                          v-close-popup
                          >Send EmailMessage</a
                        > -->
          <!-- <q-btn
            @click="onResetCreateCaseForm"
            label="Reset"
            color="primary"
            no-caps
            flat
          /> -->
          <q-btn
            @click="onSubmitCreateCaseForm"
            label="Confirm"
            color="primary"
            v-close-popup
            no-caps
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  components: {
    // "skeleton-table": require("../components/common/SkeletonTable.vue").default,
    // "case-timeline": require("components/CaseEmailTimeline.vue").default
  },
  data() {
    return {
      accountId: "0014K00000365SbQAI",
      maximized: false,
      isLoading: false,
      isLoadingTimeline: false,
      updateExpanded: false,
      cases: [],
      caseEmailMessages: [],
      errored: false,
      errorMessage: null,
      showCreateCase: false,
      showViewCase: false,
      viewingCase: {
        Id: null,
        Subject: null,
        Description: null,
        Status: null,
        Type: null,
        Reason: null,
        OpenedDate: null,
        ClosedDate: null
      },
      //   updatedIndex: -1,
      createCaseForm: {
        Subject: null,
        Description: null,
        Status: null,
        Type: null,
        Reason: null,
        CreatedDate: Date.now(),
        ClosedDate: null
      },
      updateCaseForm: {
        Subject: null,
        Description: null,
        Status: null,
        Type: null,
        Reason: null,
        CreatedDate: null,
        ClosedDate: null
      },
      createEmailMessageForm: {
        parentId: null,
        subject: "Update",
        textBody: null
        // createdById: "0014K000004X8MNQA0"
      },
      contentStyle: {
        backgroundColor: "rgba(0,0,0,0.01)"
      },

      contentActiveStyle: {
        backgroundColor: "rgba(0,0,0,0.04)",
        color: "black"
      },
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#2b89c0",
        width: "5px",
        opacity: 0.75
      },
      caseTypes: ["Hardware", "Network", "WiFi", "Software", "Voice"],
      createCaseFormReasonOptions: [],
      createCaseFormTypeOptions: [],
      caseTimeline: [],
      columns: [
        {
          name: "Subject",
          required: true,
          label: "Subject",
          align: "left",
          field: row => row.Subject,
          format: val => `${val}`
        },
        {
          name: "Status",
          align: "left",
          label: "Status"
        },
        {
          name: "Type",
          align: "left",
          label: "Type"
        },
        {
          name: "Reason",
          align: "left",
          label: "Reason"
        },
        {
          name: "CreatedDate",
          align: "left",
          label: "Opened",
          field: "CreatedDate"
          //   sortable: true,
          //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "ClosedDate",
          align: "left",
          label: "Closed",
          field: "ClosedDate"
          //   sortable: true,
          //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      data: [
        {
          Subject: "WiFi issue #1",
          Status: "open",
          Description: "This is a case description...",
          Type: "WiFi",
          Reason: 4.0,
          sodium: 87,
          CreatedDate: 1598975701324,
          ClosedDate: 1598975702724
        },
        {
          Subject: "Network issue #1",
          Status: "open",
          Description: "This is a case description...",
          Type: "Network",
          Reason: 4.3,
          sodium: 129,
          CreatedDate: 1298975705624,
          ClosedDate: 1598975702724
        },
        {
          Subject: "Voice issue #1",
          Status: "closed",
          Description: "This is a case description...",
          Type: "Voice",
          Reason: 6.0,
          sodium: 337,
          CreatedDate: 1898975702724,
          ClosedDate: 1598975702724
        }
      ]
    };
  },
  methods: {
    getCases() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/case/all", { timeout: 10000 })
        .then(response => {
          this.cases = response.data;
          console.log(this.cases);
          // this.cases = []
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.stack);
          if (error.response) {
            this.isLoading = false;
            return (this.errorMessage = error.response);
          } else if (error.code == "ECONNABORTED") {
            this.isLoading = false;
            return (this.errorMessage = "A network error has occurred");
          } else {
            console.log(error);
            this.errored = true;
            this.isLoading = false;
          }
        });
    },
    getRelatedCases(accountId) {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/case/related/" + accountId, {
          timeout: 10000
        })
        .then(response => {
          this.cases = response.data;
          console.log(this.cases);
          // this.cases = []
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.stack);
          if (error.response) {
            this.isLoading = false;
            return (this.errorMessage = error.response);
          } else if (error.code == "ECONNABORTED") {
            this.isLoading = false;
            return (this.errorMessage = "A network error has occurred");
          } else {
            console.log(error);
            this.errored = true;
            this.isLoading = false;
          }
        });
    },
    getCreateCaseFormReasonOptions() {
      this.$axios
        .get("http://localhost:3000/case/describe/reason")
        .then(response => {
          this.createCaseFormReasonOptions = response.data;
          console.log(this.createCaseFormReasonOptions);
        })
        .catch(error => {
          if (error.response) {
            return (this.errorMessage = error.response);
          } else if (error.request) {
            return (this.errorMessage = "A network error has occurred");
          } else {
            console.log(error);
            this.errored = true;
          }
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
    viewCase(item) {
      console.log(item);
      this.getRelatedCaseEmailMessages(item.Id);
      console.log("THIS IS THE ITEM ID YOU LOOKING FOR --> " + item.Id);
      this.createEmailMessageForm.parentId = item.Id;
      this.viewingCase.OpenedDate = item.CreatedDate;
      console.log(
        "NOW CHECK IT HERE -> " + this.createEmailMessageForm.parentId
      );
      this.updateCaseForm = Object.assign({}, item);
      this.showViewCase = true;
    },
    onSubmitUpdateCaseForm() {
      this.showViewCase = false;
      this.onResetUpdateCaseForm();
      this.$q.notify({
        message: "This will eventually send to SF",
        color: "grey",
        timeout: 1000
      });
    },
    onResetUpdateCaseForm() {
      this.updateCaseForm.Id = null;
      this.updateCaseForm.Subject = null;
      this.updateCaseForm.Reason = null;
      this.updateCaseForm.Type = null;
      this.updateCaseForm.Description = null;
      this.updateCaseForm.CreatedDate = null;
    },
    onSubmitCreateCaseForm() {
      this.$axios
        .post("http://localhost:3000/case/new", {
          accountId: this.accountId,
          subject: this.createCaseForm.Subject,
          reason: this.createCaseForm.Reason,
          type: this.createCaseForm.Type,
          description: this.createCaseForm.Description
        })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "o_cloud_done",
            message: "Submitted"
          });
          this.showCreateCase = false;
          this.onResetCreateCaseForm();
          this.getCases();
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "o_warning",
            message: error
          });
        });
    },
    onResetCreateCaseForm() {
      this.createCaseForm.Subject = null;
      this.createCaseForm.Reason = null;
      this.createCaseForm.Type = null;
      this.createCaseForm.Description = null;
    },
    getRelatedCaseEmailMessages(parentId) {
      this.isLoadingTimeline = true;

      console.log(parentId);
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/email-message/related/" + parentId)
        .then(response => {
          this.caseEmailMessages = response.data;
          this.caseEmailMessages.push({
            Subject: "Case opened",
            TextBody: null,
            MessageDate: this.viewingCase.OpenedDate
          });
          this.isLoading = false;
          this.isLoadingTimeline = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
          this.isLoadingTimeline = false;
        });
      this.isLoading = true;
    },
    getCaseTimeline(parentId) {
      this.getRelatedCaseEmailMessages(parentId);
      let c = this.caseEmailMessages;
      let openedDate;
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
          this.getRelatedCaseEmailMessages(createEmailMessageForm.parentId);
          this.onResetEmailMessageForm();
          // this.getCaseDetail(this.caseObjectId);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },
    onResetEmailMessageForm() {
      this.createEmailMessageForm.textBody = null;
    },
    scrollBackToTop() {
      this.$refs.timelineScrollArea.setScrollPosition(0, 300);
      // this.position = Math.floor(Math.random() * 1001) * 20
    }
  },
  mounted() {
    this.accountId = this.$route.params.accountId;
    this.getCases();
    this.getRelatedCases(this.accountId);
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
  },
  computed: {
    layout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    }
  },
  filters: {
    niceDate(value) {
      // value = parseInt(value);
      return date.formatDate(value, "HH:mm, DD/MM/YYYY");
    },
    excerpt(value) {
      let str = value.toString();
      if (str.length < 15) {
        return value;
      } else {
        let cutStr = str.replace(/^(.{15}[^\s]*).*/, "$1");
        return cutStr + "...";
      }
      //   let str = value.toString().replace(/^(.{15}[^\s]*).*/, "$1");
      //   return str;
    }
  }
};
</script>

<style></style>
