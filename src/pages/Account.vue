<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The Account Object</div>
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
              v-for="(account, index) in accounts"
              :key="index"
            >
              <q-card
                @click="toAccountDetail(account.Id)"
                class="cursor-pointer"
              >
                <q-card-section>
                  <div class="text-h6">{{ account.Name }}</div>
                  <div class="text-subtitle2">{{ account.Id }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-gutter-sm">
                  <q-badge
                    v-if="account.Industry"
                    color="secondary"
                    :label="account.Industry"
                  />
                  <q-badge
                    v-if="account.Type"
                    color="accent"
                    :label="account.Type"
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
      accounts: [],
      errored: false
    };
  },
  methods: {
    getAccounts() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/account/all")
        .then(response => {
          this.accounts = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    },
    getSingleAccount(accountId, accountName) {
      this.accountId = accountId;
      this.accountName = accountName;
      this.$bvModal.show("modal-1");
      this.getSingleAccountDetail(accountId);
    },
    getSingleAccountDetail(accountId) {
      this.$axios
        .get("http://localhost:3000/account/" + accountId)
        .then(response => {
          (this.accountDetail.type = response.data.Type),
            (this.accountDetail.description = response.data.Description),
            (this.accountDetail.website = response.data.Website),
            (this.accountDetail.industry = response.data.Industry),
            (this.accountDetail.accountNumber = response.data.AccountNumber),
            (this.accountDetail.phone = response.data.Phone),
            (this.accountDetail.annualRevenue = response.data.AnnualRevenue),
            (this.accountDetail.numberOfEmployees =
              response.data.NumberOfEmployees),
            (this.accountDetail.rating = response.data.Rating);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },
    toAccountDetail(accountId) {
      this.$router.push({ path: `/account/${accountId}` });
    }
  },
  mounted() {
    this.getAccounts();
  }
};
</script>

<style></style>
