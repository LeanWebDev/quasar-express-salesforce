<template>
  <q-page padding>
    <div class="row q-mb-xl">
      <div class="col-12 text-center text-h3">Product # ({{ productId }})</div>
    </div>
    <div class="row ">
      <div class="col-6 offset-3">
        <q-card class="col-12 q-mb-md">
          <q-card-section class="text-h6">
            Product Profile
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-9 q-gutter-md">
                <q-form
                  @submit.prevent="onSubmitProductFormUpdate"
                  class="q-gutter-md"
                >
                  <q-input
                    v-model="product.name"
                    type="text"
                    label="Forename"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="product.description"
                    type="text"
                    label="Surname"
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
      productId: "",
      product: {
        name: null,
        description: null
      }
    };
  },
  methods: {
    getProductDetail(productId) {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/product/" + productId)
        .then(response => {
          this.product.name = response.data.Name;
          this.product.description = response.data.Description;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
      this.isLoading = true;
    },

    onSubmitProductFormUpdate() {
      this.isLoading = true;
      this.$axios
        .post("http://localhost:3000/product/update", {
          productId: this.productId,
          name: this.product.name,
          description: this.product.description
        })
        .then(response => {
          console.log(response);
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "o_cloud_done",
            message: "Product has been updated"
          });
          this.isLoading = false;
          this.getProductDetail(this.productId);
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },
  mounted() {
    this.productId = this.$route.params.productId;
    this.getProductDetail(this.productId);
  }
};
</script>

<style></style>
