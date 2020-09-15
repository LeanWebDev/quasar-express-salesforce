<template>
  <div>
    <!--  ----------------------------------------------------------------------  -->
    <!--  NOTE: Please add the following <META> element to your page <HEAD>.      -->
    <!--  If necessary, please modify the charset parameter to specify the        -->
    <!--  character set of your HTML page.                                        -->
    <!--  ----------------------------------------------------------------------  -->

    <!-- <meta HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8" /> -->

    <!--  ----------------------------------------------------------------------  -->
    <!--  NOTE: Please add the following <FORM> element to your page.             -->
    <!--  ----------------------------------------------------------------------  -->

    <!-- action="https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8"
      method="POST" -->
    <q-form @submit="createWebToCase" class="q-gutter-md">
      <q-input
        type="hidden"
        name="orgid"
        value="00D4K0000015TIc"
        class="hidden"
        outlined
        dense
      />
      <!-- <q-input type="hidden" name="retURL" value="http://localhost:8080" /> -->

      <!--  ----------------------------------------------------------------------  -->
      <!--  NOTE: These fields are optional debugging elements. Please uncomment    -->
      <!--  these lines if you wish to test in debug mode.                          -->
      <!--  <q-input type="hidden" name="debug" value=1>                              -->
      <!--  <q-input type="hidden" name="debugEmail"                                  -->
      <!--  value="jrenzel66@protonmail.com">                                       -->
      <!--  ----------------------------------------------------------------------  -->

      <q-input
        v-model="defaultContactName"
        id="name"
        maxlength="80"
        name="name"
        size="20"
        type="text"
        outlined
        dense
        label="Contact Name"
        class="hidden"
      />

      <!-- <q-input
        v-model="defaultContactId"
        id="name"
        maxlength="80"
        name="name"
        size="20"
        type="text"
        outlined
        dense
        label="Contact Name"
        class="hidden"
      /> -->

      <q-input
        v-model="defaultContactEmail"
        id="email"
        label="Email"
        maxlength="80"
        name="email"
        size="20"
        type="text"
        outlined
        dense
        class="hidden"
      />

      <q-input
        v-model="defaultContactPhone"
        id="phone"
        maxlength="40"
        name="phone"
        size="20"
        type="text"
        label="Phone"
        outlined
        dense
        class="hidden"
      />

      <q-input
        v-model="webToCaseForm.subject"
        id="subject"
        maxlength="80"
        :rules="[
          val =>
            (val && val.length < 100) ||
            'Please type something with up to 80 characters'
        ]"
        counter
        lazy-rules
        name="subject"
        size="20"
        type="text"
        label="Subject"
        outlined
        dense
      />

      <q-input
        v-model="webToCaseForm.description"
        label="description"
        type="textarea"
        name="description"
        outlined
        dense
        hint="Description for this case"
        lazy-rules
        :rules="[
          val =>
            (val && val.length < 800) ||
            'Please type something with up to 800 characters'
        ]"
        maxlength="800"
        counter
      ></q-input>

      <q-select
        v-model="webToCaseForm.reason"
        id="reason"
        name="reason"
        label="Case Reason"
        :options="createCaseFormReasonOptions"
        outlined
        dense
      />

      <q-select
        v-model="webToCaseForm.type"
        label="Type"
        id="type"
        name="type"
        :options="createCaseFormTypeOptions"
        outlined
        dense
      />

      <label for="company" class="hidden">Company</label
      ><q-input
        v-model="defaultContactCompany"
        id="company"
        maxlength="80"
        name="company"
        size="20"
        type="text"
        class="hidden"
        outlined
        dense
      />

      <q-select
        v-model="webToCaseForm.product"
        id="00N4K000001w7UX"
        name="00N4K000001w7UX"
        title="Product"
        label="Product"
        :options="createCaseFormProductOptions"
        dense
        outlined
      />

      <q-input
        type="hidden"
        id="external"
        name="external"
        value="1"
        outlined
        dense
        class="hidden"
      />

      <q-btn type="submit" label="Submit" color="primary" no-caps unelevated />
    </q-form>
  </div>
</template>

<script>
export default {
  name: "WebToCase",
  data() {
    return {
      webToCaseForm: {
        subject: null,
        description: null,
        type: null,
        reason: null,
        product: null
      },
      createCaseFormTypeOptions: [],
      createCaseFormReasonOptions: [],
      createCaseFormProductOptions: [
        "GC1040",
        "GC1060",
        "GC3020",
        "GC3040",
        "GC3060",
        "GC5020",
        "GC5040",
        "GC5060",
        "GC1020"
      ],
      defaultContactName: "Tester Tester",
      defaultContactCompany: "Testing",
      defaultContactEmail: "tester@testing.com",
      defaultContactPhone: "012101210121"
    };
  },
  methods: {
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
    createWebToCase() {
      let axiosWebToCaseConfig = {
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      };
      this.$axios
        .post(
          "https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8",
          this.webToCaseForm,
          axiosWebToCaseConfig
        )
        .then(res => {
          console.log("RESPONSE RECEIVED: ", res);
        })
        .catch(err => {
          console.log("AXIOS ERROR: ", err);
        });
    }
  },
  mounted() {
    this.getCreateCaseFormReasonOptions();
    this.getCreateCaseFormTypeOptions();
  }
};
</script>

<style></style>
