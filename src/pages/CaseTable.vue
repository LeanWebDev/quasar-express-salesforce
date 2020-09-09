<template>
  <div class="row q-pt-xl">
    <div class="col-6 offset-3">
      <div id="section-cases">
        <div class="row q-mb-md">
          <div class="column">
            <div class="col">
              <div class="text-h5">
                Cases <span class="text-subtitle2">({{ accountId }})</span>
              </div>
              <div class="text-subtitle1">
                Manage your cases
              </div>
            </div>
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <q-btn
              color="primary"
              label="New Case"
              @click="showCreateCase = true"
              class="q-mb-xs"
              no-caps
              unelevated
            />
          </div>
        </div>
        <!-- <q-separator spaced /> -->
        <q-card class="q-mb-md section-card" flat bordered>
          <q-table
            :dense="$q.screen.lt.md"
            :data="cases"
            :columns="columns"
            row-key="Subject"
            color="primary"
            :loading="isLoading"
            title="(Account Name)"
            no-data-label="No cases found for this account."
            style="min-height: 230px"
          >
            <template v-slot:top>
              <q-dialog v-model="showViewCase" v-if="!maximized">
                <q-card style="width: 70vw">
                  <div class="row">
                    <div class="col">
                      <q-card-section>
                        <div class="text-h6">{{ updateCaseForm.Subject }}</div>
                      </q-card-section>
                      <q-separator inset />
                      <q-card-section>
                        <div class="row q-col-gutter-md q-mb-md">
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
                        </div>
                        <div class="row q-mb-md">
                          <q-input
                            v-model="updateCaseForm.Description"
                            type="textarea"
                            class="col"
                            label="Description"
                            outlined
                            dense
                          ></q-input>
                        </div>
                      </q-card-section>
                      <q-card-actions align="right">
                        <!-- <a
                          href="mailto:hello@john.cpm"
                          class="btn"
                          v-close-popup
                          >Send EmailMessage</a
                        > -->
                        <q-btn
                          type="a"
                          href="mailto:hello@john.cpm"
                          label="Send EmailMessage"
                          color="grey"
                          v-close-popup
                          no-caps
                          unelevated
                        ></q-btn>
                        <!-- <q-btn
                          @click="onSubmitUpdateCaseForm"
                          label="Confirm"
                          color="primary"
                          v-close-popup
                          no-caps
                          unelevated
                        ></q-btn> -->
                      </q-card-actions>
                    </div>
                    <q-separator spaced vertical />
                    <div class="col">
                      <q-scroll-area style="height: 100%">
                        <case-timeline :activity="emailMessages" />
                      </q-scroll-area>
                    </div>
                  </div>
                </q-card>
              </q-dialog>
              <q-dialog v-model="showViewCase" maximized v-if="maximized">
                <q-card>
                  <div class="row">
                    <div class="col-12">
                      <q-card-section>
                        <div class="row">
                          <div class="col">
                            <div class="text-h6">
                              {{ updateCaseForm.Subject }}
                            </div>
                          </div>
                          <q-space />
                          <div class="col">
                            <q-btn
                              label="Close"
                              color="primary"
                              class="float-right"
                              v-close-popup
                              no-caps
                              unelevated
                            ></q-btn>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset />
                      <q-card-section>
                        <div class="row q-col-gutter-md q-mb-md">
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
                        </div>
                        <div class="row q-mb-md">
                          <q-input
                            v-model="updateCaseForm.Description"
                            type="textarea"
                            class="col"
                            label="Description"
                            outlined
                            dense
                          ></q-input>
                        </div>
                      </q-card-section>
                      <q-card-actions align="right">
                        <!-- <a
                          href="mailto:hello@john.cpm"
                          class="btn"
                          v-close-popup
                          >Send EmailMessage</a
                        > -->
                        <q-btn
                          type="a"
                          href="mailto:hello@john.cpm"
                          label="Send EmailMessage"
                          color="grey"
                          v-close-popup
                          no-caps
                          unelevated
                        ></q-btn>
                      </q-card-actions>
                    </div>
                    <div class="col-12">
                      <q-scroll-area style="height: 500px">
                        <case-timeline :activity="emailMessages" />
                      </q-scroll-area>
                    </div>
                  </div>
                </q-card>
              </q-dialog>
            </template>
            <template v-slot:top-right> </template>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
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
                <q-td key="Subject" :props="props">{{
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
                <q-td key="Reason" :props="props">{{ props.row.Reason }}</q-td>
                <q-td key="CreatedDate" :props="props">{{
                  props.row.CreatedDate | niceDate
                }}</q-td>
                <q-td key="ClosedDate" :props="props">{{
                  props.row.ClosedDate | niceDate
                }}</q-td>
              </q-tr>
            </template>
          </q-table>
          <q-inner-loading :showing="isLoading">
            <q-spinner-tail size="40px" color="primary" />
          </q-inner-loading>
        </q-card>
        <!-- <skeleton-table v-if="isLoading" /> -->
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
            @submit="onSubmitCreateCaseForm"
            @reset="onResetCreateCaseForm"
            class="q-gutter-md"
          >
            <q-input v-model="createCaseForm.accountId" class="hidden" />
            <q-input
              v-model="createCaseForm.Subject"
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
              v-model="createCaseForm.Reason"
              :options="createCaseFormReasonOptions"
              label="Reason"
              outlined
              dense
              emit-value
            />
            <q-select
              v-model="createCaseForm.Type"
              :options="createCaseFormTypeOptions"
              label="Type"
              outlined
              dense
              emit-value
            />
            <q-input
              v-model="createCaseForm.Description"
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
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  components: {
    // "skeleton-table": require("../components/common/SkeletonTable.vue").default,
    "case-timeline": require("components/CaseEmailTimeline.vue").default
  },
  data() {
    return {
      accountId: "0014K000004X8MNQA0",
      maximized: false,
      isLoading: false,
      cases: [],
      emailMessages: [],
      errored: false,
      showCreateCase: false,
      showViewCase: false,
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
      createCaseFormReasonOptions: ["Reason1", "Reason2", "Reason3"],
      createCaseFormTypeOptions: ["Type1", "Type2", "Type3"],
      updateCaseForm: {
        Subject: null,
        Description: null,
        Status: null,
        Type: null,
        Reason: null,
        CreatedDate: Date.now(),
        ClosedDate: null
      },
      caseTypes: ["Hardware", "Network", "WiFi", "Software", "Voice"],
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
        .get("http://localhost:3000/case/all")
        .then(response => {
          this.cases = response.data;
          console.log(this.cases);
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
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
    viewCase(item) {
      console.log(item);
      this.getEmailMessages(item.Id);
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
      this.updateCaseForm.Subject = null;
      this.updateCaseForm.Reason = null;
      this.updateCaseForm.Type = null;
      this.updateCaseForm.Description = null;
    },
    onSubmitCreateCaseForm() {
      this.$axios
        .post("http://localhost:3000/case/new", {
          accountId: this.createCaseForm.accountId,
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
            icon: "cloud_done",
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
            icon: "warning",
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
    this.getCases();
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
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
