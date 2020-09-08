<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-12 text-center text-h3">
        {{ account.name }} ({{ accountId }})
      </div>
      <div v-if="account.Atlas__c" class="col-12 text-center text-h3">
        <q-btn color="blue" glossy rounded>Atlas Enabled</q-btn>
      </div>
    </div>
    <div class="row ">
      <div class="col-6 offset-3">
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Account Profile
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col q-gutter-md">
                <q-form
                  @submit.prevent="onSubmitAccountFormUpdate"
                  class="q-gutter-md"
                >
                  <q-input
                    v-model="account.website"
                    type="text"
                    label="Website"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="account.phone"
                    type="tel"
                    label="Phone"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="account.industry"
                    type="text"
                    label="Industry"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="account.numberOfEmployees"
                    type="text"
                    label="Number of employees"
                    outlined
                    dense
                  />
                  <q-btn
                    type="submit"
                    :loading="isLoading"
                    class="float-right"
                    color="primary"
                    unelevated
                    no-caps
                    >Save</q-btn
                  >
                </q-form>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Shipping Address
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col q-gutter-md">
                <q-input
                  :value="shippingAddress.street"
                  type="text"
                  label="Street"
                  outlined
                  dense
                />
                <q-input
                  :value="shippingAddress.city"
                  type="text"
                  label="City"
                  outlined
                  dense
                />
                <q-input
                  :value="shippingAddress.state"
                  type="text"
                  label="State"
                  outlined
                  dense
                />
                <q-input
                  :value="shippingAddress.country"
                  type="text"
                  label="Country"
                  outlined
                  dense
                />
                <q-input
                  :value="shippingAddress.postalCode"
                  type="text"
                  label="Street"
                  outlined
                  dense
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Billing Address
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col q-gutter-md">
                <q-input
                  :value="billingAddress.street"
                  type="text"
                  label="Street"
                  outlined
                  dense
                />
                <q-input
                  :value="billingAddress.city"
                  type="text"
                  label="City"
                  outlined
                  dense
                />
                <q-input
                  :value="billingAddress.state"
                  type="text"
                  label="State"
                  outlined
                  dense
                />
                <q-input
                  :value="billingAddress.country"
                  type="text"
                  label="Country"
                  outlined
                  dense
                />
                <q-input
                  :value="billingAddress.postalCode"
                  type="text"
                  label="Street"
                  outlined
                  dense
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Account Manager
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col q-gutter-md">
                <div class="text-h6">
                  {{ accountManager.Name }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <pre>{{ accountManager }}</pre>
          </q-card-section>
          <q-inner-loading :showing="isLoading">
            <q-spinner-ball size="50px" color="primary" />
          </q-inner-loading>
        </q-card>

        <!-- <account-manager v-if="account.OwnerId" :ownerId="account.OwnerId" /> -->
      </div>
    </div>
    <!-- <pre>{{ account }}</pre> -->
    <q-inner-loading :showing="isLoading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  components: {
    // "account-manager": require("components/AccountManager.vue").default
  },
  data() {
    return {
      isLoading: false,
      accountId: "",
      account: {
        name: null,
        website: null,
        phone: null,
        industry: null,
        numberOfEmployees: null
      },
      accountManager: {},
      shippingAddress: {},
      billingAddress: {}

      //   accountDetail: {
      //     type: "",
      //     description: "",
      //     website: "",
      //     industry: "",
      //     accountNumber: "",
      //     phone: "",
      //     annualRevenue: "",
      //     numberOfEmployees: "",
      //     rating: "",
      //     shipping: {
      //       street: "",
      //       city: "",
      //       state: "",
      //       postalCode: "",
      //       country: "",
      //       latitude: "",
      //       longitude: "",
      //       address: {
      //         city: "",
      //         country: "",
      //         latitude: "",
      //         longitude: "",
      //         postalCode: "",
      //         state: "",
      //         street: ""
      //       }
      //     }
      //   }
    };
  },
  methods: {
    getAccountDetail(accountId) {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/account/" + accountId)
        .then(response => {
          this.account.name = response.data.Name;
          this.account.website = response.data.Website;
          this.account.phone = response.data.Phone;
          this.account.industry = response.data.Industry;
          this.account.numberOfEmployees = response.data.NumberOfEmployees;
          this.billingAddress = response.data.BillingAddress;
          this.shippingAddress = response.data.ShippingAddress;
          this.getAccountManager(response.data.OwnerId);
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
      this.isLoading = true;
    },
    getAccountManager(userId) {
      this.isLoading = true;
      this.$axios
        .get(`http://localhost:3000/user/${userId}`)
        .then(response => {
          this.accountManager = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    },
    onSubmitAccountFormUpdate() {
      this.isLoading = true;
      this.$axios
        .post("http://localhost:3000/account/update", {
          accountId: this.accountId,
          website: this.account.website,
          phone: this.account.phone,
          industry: this.account.industry,
          numberOfEmployees: this.numberOfEmployees
        })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Account has been updated"
          });
          this.isLoading = false;
          this.getAccountDetail(this.accountId);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },
  mounted() {
    this.accountId = this.$route.params.accountId;
    this.getAccountDetail(this.accountId);
  }
};
</script>

<style></style>
