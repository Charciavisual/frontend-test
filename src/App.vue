
<template>
  <div id="app">
    <div class="app-header">
      <button class="btn-white btn-modal-filter" @click="showModal=true">필터</button>
      <selector-order @updateOrder="value=>{pageParams.order = value}"></selector-order>
      <modal-filter v-if="showModal" :category="cateList" @close="showModal=false" @updateFilter="value=>{updateFilter(value)}"></modal-filter>
    </div>
     <div class="app-body">

     </div>
  </div>
</template>

<script>
import axios from "axios";
import modalFilter from "./components/modal-filter";
import selectorOrder from "./components/selector-order";
export default {
  components: { modalFilter, selectorOrder },
  data() {
    return {
      cateList:  [],
      contents: [],
      showModal: false,
      pageParams: {
        page: 1,
        order: "asc",
        filter: []
      }
    };
  },
  created() {
    this.initApplication();
  },
  methods: {
     initApplication() {
      this.getCategories()
        .then(categories => {
          categories.forEach(category => {
            let _filter = []
            _filter.push(category.no);
            this.pageParams.filter= _filter;
          });
        })
        .then(() => {
          this.getContents(this.pageParams.page, this.pageParams.order, this.pageParams.filter);
        });
    },
    getCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://comento.cafe24.com/category.php")
          .then(response => {
            this.cateList = response.data.list;
            console.log("Success load category list");
            resolve(this.cateList);
          })
          .catch(() => {
            console.log("Failed load category list");
          });
      });
    },
    getContents(_page, _ord, _category) {
      const url = "http://comento.cafe24.com/request.php";
      const params = {
        page: _page,
        ord: _ord,
        category: _category
      };
      return new Promise((resolve, reject) => {
        axios({
          url: url,
          method: "get",
          params: params
        })
          .then(response => {
            this.contents = this.contents.concat(response.data.list);
            console.log("Success load content list");
          })
          .catch(() => {
            console.log("Failed load content list");
          });
      });
    },
    updateFilter(list){
      this.pageParams.filter = list;
      this.closeModal();
    },
    closeModal(){
      this.showModal = false;
    }
  }
};
</script>