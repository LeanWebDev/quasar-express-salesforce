<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-12 text-center text-h3">
        {{ account.name }} ({{ accountId }})
      </div>
      <div v-if="account.atlasEnabled" class="col-12 text-center text-h3">
        <q-btn color="blue" glossy rounded>Atlas Enabled</q-btn>
      </div>
    </div>

    <div class="row ">
      <div class="col-12 col-md-6 offset-md-3">
        <div class="row q-mb-md">
          <div class="column">
            <q-space />
            <div class="text-weight-regular" style="font-size: 25px">
              Account
            </div>
            <!-- <div class="text-subtitle1">View your account details</div> -->
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <q-btn
              @click="getAccountDetails(accountId)"
              class="q-mt-lg"
              color="primary"
              icon="autorenew"
              size="12px"
              flat
              round
            />
          </div>
        </div>
        <q-card class="col-12 q-mb-md" flat bordered>
          <q-card-section class="q-pl-lg">
            <q-badge
              color="grey"
              size="lg"
              v-if="account.accountNumber"
              :label="account.accountNumber"
            />
            <q-badge color="grey" size="lg" v-else label="-------" />
            <div class="text-weight-regular" style="font-size: 35px">
              {{ account.name }}
            </div>
          </q-card-section>
          <q-separator inset />
          <q-form @submit.prevent="onSubmitAccountFormUpdate">
            <q-card-section>
              <div class="row">
                <div class="col q-gutter-md">
                  <div class="row">
                    <div class="col-9 q-gutter-md">
                      <q-input
                        v-model="account.website"
                        type="text"
                        label="Website"
                        outlined
                        disable
                        readonly
                        dense
                      />
                      <q-input
                        v-model="account.phone"
                        type="tel"
                        label="Phone"
                        outlined
                        disable
                        readonly
                        dense
                      />
                      <q-input
                        v-model="account.industry"
                        type="text"
                        label="Industry"
                        outlined
                        disable
                        readonly
                        dense
                      />
                      <q-input
                        v-model="account.numberOfEmployees"
                        type="text"
                        label="Number of employees"
                        outlined
                        readonly
                        disable
                        dense
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col">
                  <q-btn
                    class="float-right"
                    type="submit"
                    :loading="isLoading.accountDetails"
                    color="primary"
                    disable
                    unelevated
                    no-caps
                    >Save</q-btn
                  >
                </div>
              </div>
            </q-card-section>
          </q-form>
          <q-inner-loading :showing="isLoading.accountDetails">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>

        <div class="row q-mb-md">
          <div class="column">
            <q-space />
            <div class="text-weight-regular" style="font-size: 25px">
              Addresses
            </div>
            <!-- <div class="text-subtitle1">View your account details</div> -->
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <q-btn
              @click="getAccountAddresses(accountId)"
              class="q-mt-lg"
              color="primary"
              icon="autorenew"
              size="12px"
              flat
              round
            />
          </div>
        </div>

        <q-card class="col-12 q-mb-md" flat bordered>
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
              <div class="row">
                <div class="col-12 col-md-9 q-gutter-y-md">
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
                  <q-select
                    v-model="shippingAddress.country"
                    type="text"
                    label="Country"
                    transition-show="jump-up"
                    transition-hide="jump-up"
                    :options="addressCountries"
                    :loading="isAddressCountriesLoading"
                    outlined
                    dense
                    behavior="dialog"
                    :options-dense="$q.screen.gt.md"
                  />
                  <q-input
                    v-model="shippingAddress.postalCode"
                    type="text"
                    label="Postal code"
                    outlined
                    dense
                  />
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col">
                  <q-btn
                    @click="onSubmitAccountFormUpdate"
                    class="float-right"
                    type="submit"
                    :loading="isLoading.accountAddressesSubmit"
                    color="primary"
                    unelevated
                    no-caps
                    >Save</q-btn
                  >
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="billing">
              <div class="row">
                <div class="col-12 col-md-9 q-gutter-y-md">
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
                  <q-select
                    v-model="billingAddress.country"
                    type="text"
                    label="Country"
                    transition-show="jump-up"
                    transition-hide="jump-up"
                    :options="addressCountries"
                    :loading="isAddressCountriesLoading"
                    behavior="dialog"
                    :options-dense="$q.screen.gt.md"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="billingAddress.postalCode"
                    type="text"
                    label="Postal code"
                    outlined
                    dense
                  />
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col">
                  <q-btn
                    @click="onSubmitAccountFormUpdate"
                    class="float-right"
                    type="submit"
                    :loading="isLoading.accountAddressesSubmit"
                    color="primary"
                    unelevated
                    no-caps
                    >Save</q-btn
                  >
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-inner-loading :showing="isLoading.accountAddresses">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>

        <div class="row q-mb-md">
          <div class="column">
            <q-space />
            <div class="text-weight-regular" style="font-size: 25px">
              Account Manager
            </div>
            <!-- <div class="text-subtitle1">View your account details</div> -->
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <q-btn
              @click="getAccountManager(accountManagerUserID)"
              class="q-mt-lg"
              color="primary"
              icon="autorenew"
              size="12px"
              flat
              round
            />
          </div>
        </div>
        <q-card class="col-12 q-mb-md" flat bordered>
          <q-card-section>
            <q-list class="rounded-borders" bordered separator>
              <q-item v-ripple>
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img :src="accountManager.FullPhotoUrl" />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-weight-medium">
                  {{ accountManager.Name }}
                  <!-- <q-item-label caption>
                    Name
                  </q-item-label> -->
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  {{ accountManager.Email }}
                  <q-item-label caption>
                    Email
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  {{ accountManager.Department }}
                  <q-item-label caption>
                    Department
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  {{ accountManager.Phone }}
                  <q-item-label caption>
                    Phone number
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <!-- <div class="row">
              <div class="col q-gutter-md">
                {{ accountManager.FullPhotoUrl }}
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
            </div> -->
          </q-card-section>

          <q-inner-loading :showing="isLoading.accountManager">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>

        <!-- <account-manager v-if="account.OwnerId" :ownerId="account.OwnerId" /> -->
      </div>
    </div>
    <!-- <pre>{{ account }}</pre> -->
    <!-- <q-inner-loading :showing="isLoading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading> -->
  </q-page>
</template>

<script>
export default {
  components: {
    // "account-manager": require("components/AccountManager.vue").default
  },
  data() {
    return {
      isLoading: {
        accountDetails: false,
        accountAddresses: false,
        accountAddressesSubmit: false,
        accountManager: false
      },
      isAddressCountriesLoading: false,
      addressTab: "shipping",
      accountId: "",
      accountManagerUserID: null,
      addressCountries: [],
      account: {
        name: null,
        accountNumber: null,
        website: null,
        phone: null,
        industry: null,
        numberOfEmployees: null,
        photoUrl: null,
        atlasEnabled: null
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
      this.isLoading.accountDetails = true;
      this.isLoading.accountAddresses = true;
      this.isLoading.accountManager = true;
      this.$axios
        .get("http://localhost:3000/account/" + accountId)
        .then(response => {
          this.account.name = response.data.Name;
          this.account.accountNumber = response.data.AccountNumber;
          this.account.website = response.data.Website;
          this.account.phone = response.data.Phone;
          this.account.industry = response.data.Industry;
          this.account.numberOfEmployees = response.data.NumberOfEmployees;
          this.account.photoUrl = response.data.PhotoUrl;
          this.account.atlasEnabled = response.data.Atlas__c;
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
          // Account manager
          this.accountManagerUserID = response.data.OwnerId;
          this.getAccountManager(this.accountManagerUserID);
          this.getAddressCountries();
          this.isLoading.accountDetails = false;
          this.isLoading.accountAddresses = false;
          this.isLoading.accountManager = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading.accountDetails = false;
          this.isLoading.accountAddresses = false;
          this.isLoading.accountManager = false;
        });
    },
    getAccountDetails(accountId) {
      this.isLoading.accountDetails = true;
      this.$axios
        .get("http://localhost:3000/account/" + accountId)
        .then(response => {
          this.account.name = response.data.Name;
          this.account.accountNumber = response.data.AccountNumber;
          this.account.website = response.data.Website;
          this.account.phone = response.data.Phone;
          this.account.industry = response.data.Industry;
          this.account.numberOfEmployees = response.data.NumberOfEmployees;
          this.account.photoUrl = response.data.PhotoUrl;
          this.account.atlasEnabled = response.data.Atlas__c;
          this.isLoading.accountDetails = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading.accountDetails = false;
        });
    },
    getAccountAddresses(accountId) {
      this.isLoading.accountAddresses = true;
      this.$axios
        .get("http://localhost:3000/account/" + accountId)
        .then(response => {
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
          this.getAddressCountries();
          this.isLoading.accountAddresses = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading.accountAddresses = false;
        });
    },
    getAccountManager(accountManagerUserId) {
      this.isLoading.accountManager = true;
      this.$axios
        .get(`http://localhost:3000/user/${accountManagerUserId}`)
        .then(response => {
          this.accountManager = response.data;
          this.isLoading.accountManager = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading.accountManager = false;
        });
    },
    onSubmitAccountFormUpdate() {
      this.isLoading.accountAddressesSubmit = true;
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
          this.isLoading.accountAddressesSubmit = false;
          this.getAccountDetail(this.accountId);
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "cloud_done",
            message: "An error has occured"
          });
          this.isLoading.accountAddressesSubmit = false;
          this.getAccountDetail(this.accountId);
        });
    },
    getAddressCountries() {
      let latestCountries = [];
      this.isAddressCountriesLoading = true;
      this.$axios
        .get("https://restcountries.eu/rest/v2/all")
        .then(response => {
          // this.addressCountries = response.data;
          for (let i = 0; i < response.data.length; i++) {
            latestCountries.push(response.data[i].name);
          }
          this.addressCountries = latestCountries;
          this.isAddressCountriesLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.isAddressCountriesLoading = false;
        });
    }
  },
  mounted() {
    this.accountId = this.$route.params.accountId;
    this.getAccountDetail(this.accountId);
    this.getAccountDetails(this.accountId);
    this.getAccountAddresses(this.accountId);
  }
};
</script>

<style></style>
