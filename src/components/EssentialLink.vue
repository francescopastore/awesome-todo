<template>
  <q-item clickable :to="link.link" exact>
    <q-item-section v-if="link.icon" avatar>
      <q-icon :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    link: {
      type: Object,
      required: true
    }
  }
}
</script>
