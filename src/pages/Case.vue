<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The Case Object</div>
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
      cases: [],
      errored: false
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
    }
  },
  mounted() {
    this.getCases();
  }
};
</script>

<style></style>
