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

        <div class="col-12 q-mb-md">
          <q-card>
            <q-tabs
              v-model="addressTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              no-caps
            >
              <q-tab name="shipping" label="Shipping" />
              <q-tab name="billing" label="Billing" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="addressTab" animated>
              <q-tab-panel name="shipping">
                <div class="text-h6">Shipping address</div>
                <div class="row">
                  <div class="col q-gutter-md">
                    <q-input
                      v-model="shippingAddress.street"
                      type="text"
                      label="Street"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="shippingAddress.city"
                      type="text"
                      label="City"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="shippingAddress.state"
                      type="text"
                      label="State"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="shippingAddress.country"
                      type="text"
                      label="Country"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="shippingAddress.postalCode"
                      type="text"
                      label="Street"
                      outlined
                      dense
                    />
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="billing">
                <div class="text-h6">Billing address</div>
                <div class="row">
                  <div class="col q-gutter-md">
                    <q-input
                      v-model="billingAddress.street"
                      type="text"
                      label="Street"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="billingAddress.city"
                      type="text"
                      label="City"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="billingAddress.state"
                      type="text"
                      label="State"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="billingAddress.country"
                      type="text"
                      label="Country"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="billingAddress.postalCode"
                      type="text"
                      label="Street"
                      outlined
                      dense
                    />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <q-separator />
            <q-card-actions align="right">
              <q-btn
                color="primary"
                @click="onSubmitAccountFormUpdate"
                :loading="isLoading"
                no-caps
                unelevated
                >Save</q-btn
              >
            </q-card-actions>
          </q-card>
        </div>

        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Account Manager
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col q-gutter-md">
                <q-avatar size="60px" font-size="52px" rounded>
                  <q-img
                    :src="accountManager.FullPhotoUrl"
                    size="md"
                    spinner-color="primary"
                    spinner-size="82px"
                  />
                </q-avatar>
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
      addressTab: "shipping",
      accountId: "",
      account: {
        name: null,
        website: null,
        phone: null,
        industry: null,
        numberOfEmployees: null
      },
      accountManager: {},
      shippingAddress: {
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        latitude: null,
        longitude: null
      },
      billingAddress: {
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        latitude: null,
        longitude: null
      }
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
          // Billing
          this.billingAddress.street = response.data.BillingStreet;
          this.billingAddress.city = response.data.BillingCity;
          this.billingAddress.state = response.data.BillingState;
          this.billingAddress.postalCode = response.data.BillingPostalCode;
          this.billingAddress.country = response.data.BillingCountry;
          // Shipping
          this.shippingAddress.street = response.data.ShippingStreet;
          this.shippingAddress.city = response.data.ShippingCity;
          this.shippingAddress.state = response.data.ShippingState;
          this.shippingAddress.postalCode = response.data.ShippingPostalCode;
          this.shippingAddress.country = response.data.ShippingCountry;
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
          numberOfEmployees: this.numberOfEmployees,
          // Billing
          billingStreet: this.billingAddress.street,
          billingCity: this.billingAddress.city,
          billingstate: this.billingAddress.state,
          billingPostalCode: this.billingAddress.postalCode,
          billingCountry: this.billingAddress.country,
          // Shipping
          shippingStreet: this.shippingAddress.street,
          shippingCity: this.shippingAddress.city,
          shippingState: this.shippingAddress.state,
          shippingPostalCode: this.shippingAddress.postalCode,
          shippingCountry: this.shippingAddress.country
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
