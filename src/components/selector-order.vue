<template>
  <div class="selector-order">
    <button class="order-item" @click="updateOrder('asc')">오름차순</button>
    <button class="order-item" @click="updateOrder('desc')">내림차순</button>
  </div>
</template>
<script>
export default {
  methods: {
    updateOrder(order) {
      this.$emit("updateOrder", order);
    }
  }
};
</script>