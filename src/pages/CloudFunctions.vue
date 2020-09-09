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
            @click="postAuthedFunction"
            no-caps
            unelevated
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
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
      text: null
    };
  },
  methods: {
    postAuthedFunction() {
      // this.$axios
      //   .post("http://localhost:5001/lwd-db/europe-west2/authedFunction", {
      //     text: this.text
      //   })
      //   .then(response => {
      //     console.log(response);
      //     this.$q.notify({
      //       color: "green-4",
      //       textColor: "white",
      //       icon: "cloud_done",
      //       message: "Submitted"
      //     });
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      this.$axios({
        method: "post",
        url: "http://localhost:5001/lwd-db/europe-west2/authedFunction",
        data: {
          text: this.text
        }
      })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted"
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style></style>
