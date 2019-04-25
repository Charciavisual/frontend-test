
<template>
  <div class="contentlist">
    <div class="contentlist-header">
      <button class="btn-white btn-modal-filter" @click="toggleModal()">필터</button>
      <selector-order :selected="pageParams.order" @updateOrder="value=>{updateOrder(value)}"></selector-order>
      <modal-filter v-if="showModal" :category="cateList" :filter="pageParams.filter" @close="toggleModal()" @updateFilter="value=>{updateFilter(value)}"></modal-filter>
    </div>
     <div class="contentlist-body">
        <ul class="contents">
          <li v-for="(item,index) in contents" :key="'contents_'+item.no" :data-no="item.no" @click="goDetailPage(item.no)">
            <content-main :category="transCateNoToName(item.category_no)" :content="item"></content-main>  
            <content-ad v-if="isAdContent(index)" :ad="curAdContent(index)"></content-ad>
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
import contentAd from "./components/content-ad"

export default {
  components: { modalFilter, selectorOrder, contentMain, contentAd },
  data() {
    return {
      cateList:  [],
      contents: [],
      ads: [],
      showModal: false,
      pageParams: {
        page: 1,
        order: "asc",
        filter: [],
        isNext: true
      },
      adsParams: {
        page: 1,
        limit: 5,
        perContent: 4,
        isNext: true
      }
    };
  },
  created() {
    this.initApplication();
  },
  mounted() {
    this.scrollCheck();
  },
  methods: {

    //init methods
     initApplication() {
      this.getCategories()
        .then(categories => {
          
          if(localStorage.lastFilter) //localStorage에 마지막으로 사용한 필터값이 저장되어 있는지 검사
            this.pageParams.filter = JSON.parse(localStorage.lastFilter);
          else {
            let _filter = []
            categories.forEach(category => {
              _filter.push(category.no);
            });
            this.pageParams.filter= _filter;
          }
        })
        .then(() => {
           this.getAds().then(_ads => {
             this.ads = _ads;
           });
        })
        .then(() => {
            if(localStorage.lastOrder) //localStorage에 마지막으로 사용한 정렬값이 저장되어 있는지 검사
              this.pageParams.order = localStorage.lastOrder;

            this.getContents().then(_contents => {
              this.contents = _contents;
            });
        });
    },
    initPageParams(){
      this.pageParams.page = 1;
      this.pageParams.isNext = true;
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
      
      if(!this.pageParams.isNext) return;
    
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
            if(response.data.per === 0 )
              this.pageParams.isNext = false; //다음 페이지가 없으면 스크롤에 의한 요청을 막는다.
            resolve(response.data.list);
          })
          .catch(() => {
            console.log("Failed load content list");
          });
      });
    },
    getAds() {
      const url = "http://comento.cafe24.com/ads.php";
      
      if(!this.adsParams.isNext) return;
      return new Promise((resolve, reject) => {
        axios({
          url: url,
          method: "get",
          params: {
            page: this.adsParams.page,
            limit: this.adsParams.limit
          }
        })
        .then(response => {
          if(response.data.per === 0)
            this.adsParams.isNext = false;
          resolve(response.data.list);
        })
        .catch(() => {
          console.log("Failed load ad list");
        });;
      });

    },
    
    //component event handlers
    updateFilter(list){
      this.toggleModal();
      if(this.pageParams.filter === list) return;
      this.initPageParams();
      this.pageParams.filter = list;
      localStorage.lastFilter = JSON.stringify(list);
      this.getContents().then(_contents => {
        this.contents = _contents;
      });
    },
    updateOrder(value){
      if(this.pageParams.order === value) return;
      this.initPageParams();
      this.pageParams.order = value;
      localStorage.lastOrder = value;
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
    },
    scrollCheck() {
      window.onscroll = () => {
        //참고자료 : https://javascript.info/size-and-scroll-window
        
        //스크롤의 최대 Height
        let scrollHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        
        //현재 스크롤된 페이지의 bottom(현재 ScrollTop의 값 + 브라우저 창의 높이)가 스크롤의 최대값과 같은지 검사
        if(window.pageYOffset + window.innerHeight === scrollHeight){
          this.pageParams.page += 1;

          /* 
            홀수번째로 게시글을 불러올때 5개의 광고를 추가적으로 불러온다.
            홀수번째 req + 짝수번째 req => 게시글 20개가 추가되고 필요한 광고의 개수는 5개
            더이상 불러올 광고가 없다면 지금까지 불러온 광고를 로테이션하여 사용
          */ 
          if (this.pageParams.page % 2 == 1){ 
            this.getAds().then(_ads => {
              this.ads = this.ads.concat(_ads);
              this.adsParams.page += 1;
            });
          }

          this.getContents().then(_contents => {
            this.contents = this.contents.concat(_contents);
          })
        }
      }
    },
    
    //현재 게시글이 광고가 붙을 게시글인지 검사
    isAdContent(curContentIdx){
      return (curContentIdx+1) % this.adsParams.perContent==0;
    },
    
    //현재 게시글에 붙일 광고를 리턴
    curAdContent(curContentIdx) {
      let _idx = parseInt(curContentIdx / this.adsParams.perContent) % this.ads.length;
      return this.ads[_idx];
    },
    goDetailPage(articleNo){
      this.$router.push('/detail/'+articleNo);
    }
  }
};
</script>