
<template>
  <div>
    <button @click="pageParam.showModal=true">필터</button>
    <modal-filter v-if="pageParam.showModal" :category="cateList" @close="pageParam.showModal=false" @updateFilter="value=>{updateFilter(value)}"></modal-filter>
  </div>
</template>

<script>
import axios from "axios";
import modalFilter from "./components/modal-filter";
export default {
  components: { modalFilter },
  data() {
    return {
      cateList:  [],
      contents: [],
      pageParam: {
        showModal: false,
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
          let reqCate = [];
          categories.forEach(category => {
            reqCate.push(category.no);
          });

          return reqCate;
        })
        .then(category => {
          this.getContents(1, "asc", category);
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
            this.contents = response.data.list;
            console.log("Success load content list");
          })
          .catch(() => {
            console.log("Failed load content list");
          });
      });
    },
    updateFilter(list){
      this.pageParam.filter = list;
      this.closeModal();
    },
    closeModal(){
      this.pageParam.showModal = false;
    }
  }
};
</script>