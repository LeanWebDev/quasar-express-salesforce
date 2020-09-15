<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-12 text-center text-h3">Contact # ({{ contactId }})</div>
    </div>
    <div class="row ">
      <div class="col-6 offset-3">
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Contact Profile
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-9 q-gutter-md">
                <q-form
                  @submit.prevent="onSubmitContactFormUpdate"
                  class="q-gutter-md"
                >
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
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      contactId: "",
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
    getContactDetail(contactId) {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/contact/" + contactId)
        .then(response => {
          this.contact.firstName = response.data.FirstName;
          this.contact.lastName = response.data.LastName;
          this.contact.email = response.data.Email;
          this.contact.phone = response.data.Phone;
          this.contact.department = response.data.Department;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
      this.isLoading = true;
    },

    onSubmitContactFormUpdate() {
      this.isLoading = true;
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
            icon: "cloud_done",
            message: "Contact has been updated"
          });
          this.isLoading = false;
          this.getContactDetail(this.contactId);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },
  mounted() {
    this.contactId = this.$route.params.contactId;
    this.getContactDetail(this.contactId);
  }
};
</script>

<style></style>
