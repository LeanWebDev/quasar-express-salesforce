<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-9 text-center text-h3">
        {{ account.name }} ({{ accountId }})
      </div>
      <div class="col-3">
        <q-btn
          color="primary"
          label="Switch to Opti"
          :to="'/opti-account/' + accountId"
          outline
        />
      </div>
      <div v-if="account.atlasEnabled" class="col-12 text-center text-h3">
        <q-btn color="blue" glossy rounded>Atlas Enabled</q-btn>
      </div>
      <div class="col-12 text-center text-h3">
        <q-btn color="purple-4" glossy rounded>Normal Account detail</q-btn>
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
              icon="o_autorenew"
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
                <div class="col">
                  <div class="row">
                    <div class="col-12 col-sm-9 q-gutter-y-md">
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
            <!-- <q-card-section>
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
            </q-card-section> -->
          </q-form>
          <q-inner-loading :showing="isLoading.accountDetails">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
        <div class="row q-mb-md">
          <div class="column">
            <q-space />
            <div class="text-weight-regular" style="font-size: 25px">
              Contact (coming soon)
            </div>
            <!-- <div class="text-subtitle1">View your account details</div> -->
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <!-- <q-btn
              @click="getContactDetail(contactId)"
              class="q-mt-lg"
              color="primary"
              icon="o_autorenew"
              size="12px"
              flat
              round
            /> -->
          </div>
        </div>
        <!-- <q-card class="col-12 q-mb-md" flat bordered>
          <q-form @submit.prevent="onSubmitContactFormUpdate">
            <q-card-section>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col-12 col-sm-9 q-gutter-y-md">
                      <q-input
                        v-model="contact.firstName"
                        type="text"
                        label="Forename"
                        outlined
                        dense
                      />
                      <q-input
                        v-model="contact.lastName"
                        type="text"
                        label="Surname"
                        outlined
                        dense
                      />
                      <q-input
                        v-model="contact.email"
                        type="email"
                        label="Email"
                        outlined
                        dense
                      />
                      <q-input
                        v-model="contact.phone"
                        type="tel"
                        label="Phone number"
                        outlined
                        dense
                      />
                      <q-input
                        v-model="contact.department"
                        type="text"
                        label="Department"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col">
                  <q-btn
                    type="submit"
                    :loading="isLoading.contactDetail"
                    class="float-right"
                    color="primary"
                    unelevated
                    no-caps
                    >Save</q-btn
                  >
                </div>
              </div>
            </q-card-section>
          </q-form>
          <q-inner-loading :showing="isLoading.contactDetail">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card> -->
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
              icon="o_autorenew"
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
            <q-tab name="billing" label="Billing" />
            <q-tab name="shipping" label="Shipping" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="addressTab" animated>
            <q-tab-panel name="billing">
              <div class="row">
                <div class="col-12 col-sm-9 q-gutter-y-md">
                  <q-input
                    v-model="billingAddress.street"
                    type="text"
                    label="Street address"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="billingAddress.city"
                    type="text"
                    label="Town/City"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="billingAddress.state"
                    type="text"
                    label="County"
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

            <q-tab-panel name="shipping">
              <div class="row">
                <div class="col-12 col-sm-9 q-gutter-y-md">
                  <q-input
                    v-model="shippingAddress.street"
                    type="text"
                    label="Street address"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="shippingAddress.city"
                    type="text"
                    label="Town/City"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="shippingAddress.state"
                    type="text"
                    label="County"
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
              icon="o_autorenew"
              size="12px"
              flat
              round
            />
          </div>
        </div>
        <q-card class="col-12 q-mb-md" flat bordered>
          <!-- <q-card-section> -->
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
          <!-- </q-card-section> -->

          <q-inner-loading :showing="isLoading.accountManager">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
        <!-- <account-manager v-if="account.OwnerId" :ownerId="account.OwnerId" /> -->

        <cases-table />

        <div class="row q-mb-md">
          <div class="column">
            <q-space />
            <div class="text-weight-regular" style="font-size: 25px">
              Contracts
            </div>
            <!-- <div class="text-subtitle1">View your account details</div> -->
          </div>
          <q-space />
          <div class="column justify-end">
            <q-space />
            <q-btn
              class="q-mt-lg"
              color="primary"
              icon="o_autorenew"
              size="12px"
              flat
              round
            />
          </div>
        </div>
        <q-card class="col-12 q-mb-md" flat bordered>
          <!-- <q-card-section> -->
          <q-list class="rounded-borders" bordered separator>
            <q-item v-for="i in 3" :key="i" v-ripple>
              <q-item-section>
                <!-- <q-item-label header>Contract product name</q-item-label> -->
                <q-item-label overline>#00000149</q-item-label>
                <q-linear-progress
                  rounded
                  size="lg"
                  :value="contractProgress1"
                  color="primary"
                  track-color="primary"
                  class="q-mt-sm"
                />
                <div class="row">
                  <q-item-label class="col q-mt-sm float-right" caption>
                    02/06/2019
                  </q-item-label>
                  <q-space />
                  <q-item-label class="col q-mt-sm text-right" caption>
                    02/06/2021
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section side top>36 months</q-item-section>
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
          <!-- </q-card-section> -->

          <q-inner-loading :showing="isLoading.accountManager">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
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
    "cases-table": require("pages/CaseTable.vue").default
  },
  data() {
    return {
      isLoading: {
        accountDetails: false,
        accountAddresses: false,
        accountAddressesSubmit: false,
        accountManager: false,
        contactDetail: false
      },
      isAddressCountriesLoading: false,
      addressTab: "billing",
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
      },
      contracts: [],
      contractProgress1: 0.637,
      contactId: "0034K000001tvJnQAI",
      contact: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        department: null
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
            icon: "o_cloud_done",
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
            icon: "o_cloud_done",
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
    },
    getContactDetail(contactId) {
      this.isLoading.contactDetail = true;
      this.$axios
        .get("http://localhost:3000/contact/" + contactId)
        .then(response => {
          this.contact.firstName = response.data.FirstName;
          this.contact.lastName = response.data.LastName;
          this.contact.email = response.data.Email;
          this.contact.phone = response.data.Phone;
          this.contact.department = response.data.Department;
          this.isLoading.contactDetail = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading.contactDetail = false;
        });
      this.isLoading.contactDetail = true;
    },
    onSubmitContactFormUpdate() {
      this.isLoading.contactDetail = true;
      this.$axios
        .post("http://localhost:3000/contact/update", {
          contactId: this.contactId,
          firstName: this.contact.firstName,
          lastName: this.contact.lastName,
          email: this.contact.email,
          phone: this.contact.phone,
          department: this.contact.department
        })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "o_cloud_done",
            message: "Contact has been updated"
          });
          this.isLoading.contactDetail = false;
          this.getContactDetail(this.contactId);
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
    this.getAccountDetails(this.accountId);
    this.getAccountAddresses(this.accountId);
    // this.getContactDetail(this.contactId);
  }
};
</script>

<style></style>
