<template>
  <q-layout view="hHH Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="o_menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar x Express x Salesforce
        </q-toolbar-title>

        <q-btn
          v-if="!loggedIn"
          color="white"
          icon-right="o_account_circle"
          label="Auth"
          class="absolute-right"
          to="/auth"
          flat
          dense
          no-caps
        />
        <q-btn
          v-else
          @click="logoutUser"
          color="white"
          icon-right="o_grass"
          label="Logout"
          class="absolute-right"
          flat
          dense
          no-caps
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      mini
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Object Types
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapState, mapActions } from "vuex";

const linksData = [
  {
    title: "Home",
    caption: "/",
    icon: "o_school",
    link: "/"
  },
  {
    title: "Account",
    caption: "/account",
    icon: "o_code",
    link: "/account"
  },
  {
    title: "Contact",
    caption: "/contact",
    icon: "o_chat",
    link: "/contact"
  },
  {
    title: "Case",
    caption: "/case",
    icon: "o_record_voice_over",
    link: "/case"
  },
  {
    title: "Case Table",
    caption: "/case-table",
    icon: "o_list",
    link: "/case-table"
  },
  {
    title: "EmailMessage",
    caption: "/email-message",
    icon: "o_rss_feed",
    link: "/email-message"
  },
  {
    title: "Cloud Functions",
    caption: "/cloud-functions",
    icon: "o_whatshot",
    link: "/cloud-functions"
  },
  {
    title: "Product",
    caption: "/product",
    icon: "o_category",
    link: "/product"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"])
  },
  methods: {
    ...mapActions("auth", ["logoutUser"])
  }
};
</script>
