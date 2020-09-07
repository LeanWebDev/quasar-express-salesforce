<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The Contact Object</div>
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
              v-for="(contact, index) in contacts"
              :key="index"
            >
              <q-card
                @click="tocontactDetail(contact.Id)"
                class="cursor-pointer"
              >
                <q-card-section>
                  <div class="text-h6">{{ contact.Name }}</div>
                  <div class="text-subtitle2">{{ contact.Id }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-gutter-sm">
                  <!-- <q-badge
                    v-if="contact.Industry"
                    color="secondary"
                    :label="contact.Industry"
                  />
                  <q-badge
                    v-if="contact.Type"
                    color="accent"
                    :label="contact.Type"
                  /> -->
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
      contacts: [],
      errored: false
    };
  },
  methods: {
    getContacts() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/contact/all")
        .then(response => {
          this.contacts = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    },
    tocontactDetail(contactId) {
      this.$router.push({ path: `/contact/${contactId}` });
    }
  },
  mounted() {
    this.getContacts();
  }
};
</script>

<style></style>
