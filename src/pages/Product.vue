<template>
  <q-page padding>
    <div>
      <div class="row q-mb-xl">
        <div class="col text-center text-h3">The Product Object</div>
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
              v-for="(product, index) in products"
              :key="index"
            >
              <q-card
                class="cursor-pointer"
                @click="toProductDetail(product.ProductCode)"
              >
                <q-card-section>
                  <div class="text-h6">{{ product.Name }}</div>
                  <div class="text-subtitle2">{{ product.Description }}</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-gutter-sm">
                  <q-badge
                    v-if="product.ProductCode"
                    color="secondary"
                    :label="product.ProductCode"
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
      products: [],
      errored: false
    };
  },
  methods: {
    getProducts() {
      this.isLoading = true;
      this.$axios
        .get("http://localhost:3000/product/all")
        .then(response => {
          this.products = response.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
          this.isLoading = false;
        });
    },
    toProductDetail(productId) {
      this.$router.push({ path: `/product/${productId}` });
    }
  },
  mounted() {
    this.getProducts();
  }
};
</script>

<style></style>
