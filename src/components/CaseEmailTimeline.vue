<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline>
      <q-timeline-entry
        v-for="(entry, index) in activity"
        :key="index"
        :title="entry.Subject"
        :subtitle="entry.MessageDate"
        side="left"
      >
        <template slot="subtitle">
          {{ entry.MessageDate | niceDate }}
        </template>
        <div>
          {{ entry.TextBody }}
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "CaseActivity",
  props: ["activity"],
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  computed: {
    layout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    }
  },
  filters: {
    niceDate(value) {
      // value = parseInt(value);
      return date.formatDate(value, "HH:mm, DD/MM/YYYY");
    }
  }
};
</script>

<style></style>
