
<template>
  <div id="app">
    <div class="app-header">
      <button class="btn-white btn-modal-filter" @click="toggleModal()">필터</button>
      <selector-order @updateOrder="value=>{updateOrder(value)}"></selector-order>
      <modal-filter v-if="showModal" :category="cateList" :selected="pageParams.filter" @close="toggleModal()" @updateFilter="value=>{updateFilter(value)}"></modal-filter>
    </div>
     <div class="app-body">
        <ul class="contents">
          <li v-for="(item,index) in contents" :key="'contents_'+item.no">
            <content-main :category="transCateNoToName(item.category_no)" :content="item"></content-main>
          </li>
        </ul>
     </div>
  </div>
</template>

<script>
import axios from "axios";
import modalFilter from "./components/modal-filter";
import selectorOrder from "./components/selector-order";
import contentMain from "./components/content-main"
export default {
  components: { modalFilter, selectorOrder, contentMain },
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
          let _filter = []
          categories.forEach(category => {
            _filter.push(category.no);
          });
          this.pageParams.filter= _filter;
        })
        .then(() => {
          this.getContents().then(_contents => {
            this.contents = _contents;
          });
        });
    },

    //request methods
    getCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://comento.cafe24.com/category.php")
          .then(response => {
            this.cateList = response.data.list;
            resolve(this.cateList);
          })
          .catch(() => {
            console.log("Failed load category list");
          });
      });
    },
    getContents() {
      const url = "http://comento.cafe24.com/request.php";
  
      return new Promise((resolve, reject) => {
        axios({
          url: url,
          method: "get",
          params: {
            page: this.pageParams.page, 
            ord: this.pageParams.order, 
            category: this.pageParams.filter
            }
        })
          .then(response => {
            resolve(response.data.list);
          })
          .catch(() => {
            console.log("Failed load content list");
          });
      });
    },

    //component event handlers
    updateFilter(list){
      this.toggleModal();
      this.pageParams.filter = list;
      this.getContents().then(_contents => {
        this.contents = _contents;
      });
    },
    updateOrder(value){
      this.pageParams.order = value;
      this.getContents().then(_contents => {
        this.contents = _contents;
      });
    },

    //util methods
    toggleModal(){
      if(this.showModal)
        this.showModal = false;
      else 
        this.showModal = true;
    },
    transCateNoToName(cno){
      let ret;
      this.cateList.forEach(category => {
        if(category.no === cno)
          ret = category.name;
      });
      return ret;
    }
  }
};
</script>