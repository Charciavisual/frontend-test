<template>
  <transition name="modal">
    <div class="modal-mask" @click.self="closeModal()">
      <div class="modal-container">
        <div class="modal-header">
          <h4>필터</h4>
          <button type="button" class="close" @click="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <span class="item-filter" v-for="item in category" :key="'filter_'+item.no">
            <input :id="'filter_'+item.no" type="checkbox" :value="item.no" v-model="selected">
            <label :for="'filter_'+item.no">{{item.name}}</label>
          </span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-positive" @click="saveFilter()">저장</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["category", "filter"],
  data() {
    return {
      selected: []
    };
  },
  created() {
    this.selected = this.filter;
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveFilter() {
      if (this.selected.length == 0) {
        alert("하나 이상의 카테고리를 선택해주세요.");
        return;
      }

      this.$emit("updateFilter", this.selected);
    }
  }
};
</script>