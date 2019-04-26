<template>
  <div class="selector-order">
    <button
      class="btn-text"
      :class="selected==='asc'? 'selected':''"
      @click="updateOrder('asc')"
    >오름차순</button>
    <button
      class="btn-text"
      :class="selected==='desc'? 'selected':''"
      @click="updateOrder('desc')"
    >내림차순</button>
  </div>
</template>
<script>
export default {
  props: ["selected"],
  methods: {
    updateOrder(order) {
      this.$emit("updateOrder", order);
    }
  }
};
</script>