<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col">
        <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
      </div>
      <div class="col">
        <img
          alt="Vue logo"
          style="max-width: 200px"
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Salesforce_logo.svg/1200px-Salesforce_logo.svg.png"
        />
      </div>
      <div class="col">
        <q-card>
          <q-card-section>
            Testing details used
          </q-card-section>
          <q-separator spaced />
          <q-card-section>
            <ul>
              <li>Account ID: 0014K000004X8MNQA0 (Testing)</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex"
};
</script>
