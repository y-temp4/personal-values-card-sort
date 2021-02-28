<template>
  <v-card
    :color="`${selected ? 'blue lighten-2' : 'grey lighten-3'}`"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-card-title class="font-weight-bold">
      {{ label || value.label }}
    </v-card-title>
    <v-card-text> {{ value.description }} </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<{ label: string; description: string }>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
})
</script>
