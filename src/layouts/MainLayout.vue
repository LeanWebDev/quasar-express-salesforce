<template>
  <q-layout view="hHH Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar x Express x Salesforce
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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

const linksData = [
  {
    title: "Home",
    caption: "/",
    icon: "school",
    link: "/"
  },
  {
    title: "Account",
    caption: "/account",
    icon: "code",
    link: "/account"
  },
  {
    title: "Contact",
    caption: "/contact",
    icon: "chat",
    link: "/contact"
  },
  {
    title: "Case",
    caption: "/case",
    icon: "record_voice_over",
    link: "/case"
  },
  {
    title: "EmailMessage",
    caption: "/email-message",
    icon: "rss_feed",
    link: "/email-message"
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
  }
};
</script>
