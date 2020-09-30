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
        <div class="row">
          <q-btn icon="o_brightness_2" @click="setDark" flat rounded />
          <q-btn
            v-if="!loggedIn"
            color="white"
            icon-right="o_account_circle"
            label="Auth"
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
            flat
            dense
            no-caps
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered mini>
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
      <q-separator spaced inset />
      <q-card class="my-card">
        <q-card-section>
          <!-- <q-list>
            <q-item v-for="(attr, index) in user" :key="index">
              <q-item-label header class="text-grey-8">
                {{ attr }}
              </q-item-label>
            </q-item>
          </q-list> -->
          <pre>{{ user }}</pre>
        </q-card-section>
      </q-card>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapState, mapActions, mapGetters } from "vuex";

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
      essentialLinks: linksData,
      layoutUser: {
        preferences: {
          darkMode: false
        }
      }
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "user"]),
    ...mapGetters("auth", ["user"]),
    preferences: {
      get() {
        if (this.user.profile.preferences.darkMode) {
          console.log(
            "darkMode as a computed property" +
              this.user.profile.preferences.darkMode
          );
        }
        return this.$q.dark.set(this.user.profile.preferences.darkMode);
      }
    }
  },
  methods: {
    ...mapActions("auth", ["logoutUser", "updateProfile"]),
    setDark() {
      this.$q.dark.toggle();
      console.log("Dark mode is active?: " + this.$q.dark.isActive);
      this.updateProfile({
        preferences: {
          darkMode: this.$q.dark.isActive
        }
      });
    }
  },
  mounted() {}
};
</script>
