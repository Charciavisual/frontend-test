
<template>
  <div class="contentlist">
    <div class="contentlist-header">
      <div class="flex-container">
        <button class="btn-white btn-modal-filter" @click="toggleModal()">필터</button>
        <div class="search">
          <input
            type="text"
            placeholder="Search..."
            :value="pageParams.keyword"
            @input="updateKeyword($event)"
          >
        </div>
      </div>
      <div class="dp-filters">
        <span
          v-for="(item,index) in pageParams.filter"
          :key="'selected-filter_'+item"
        >{{(index === 0) ? '"' : ', '}}{{transCateNoToName(item)}}</span>" 의 게시글
      </div>
      <modal-filter
        v-if="showModal"
        :category="cateList"
        :filter="pageParams.filter"
        @close="toggleModal()"
        @updateFilter="value=>{updateFilterHandler(value)}"
      ></modal-filter>
    </div>
    <div class="contentlist-body">
      <selector-order
        :selected="pageParams.order"
        @updateOrder="value=>{updateOrderHandler(value)}"
      ></selector-order>
      <ul class="contents">
        <li v-for="(item,index) in replacedContents" :key="'contents_'+item.no" :data-no="item.no">
          <content-main
            :category="transCateNoToName(item.category_no)"
            :content="item"
            @click="goDetailPage(item.no)"
          ></content-main>
          <content-ad v-if="isAdContent(index) && ads.length > 0" :ad="curAdContent(index)"></content-ad>
        </li>
        <li v-if="replacedContents.length == 0">
          <div class="none-contents-wrapper">일치하는 결과가 없습니다.</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import modalFilter from "./components/modal-filter";
import selectorOrder from "./components/selector-order";
import contentMain from "./components/content-main";
import contentAd from "./components/content-ad";

export default {
  components: { modalFilter, selectorOrder, contentMain, contentAd },
  data() {
    return {
      cateList: [],
      contents: [],
      ads: [],
      showModal: false,
      scrollMode: false,
      pageParams: {
        page: 0,
        order: "asc",
        filter: [],
        keyword: "",
        isNext: true
      },
      adsParams: {
        page: 0,
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
    this.initContents();
  },
  computed: {
    /*
     * 제목 또는 본문에 검색어를 포함하는 글 리스트를 리턴
     * 입력된 검색어가 없다면 원래 글 리스트를 리턴
     */
    replacedContents() {
      if (this.pageParams.keyword !== "") {
        let retList = [];
        this.contents.forEach(item => {
          if (
            item.title
              .toLowerCase()
              .includes(this.pageParams.keyword.toLowerCase()) ||
            item.contents
              .toLowerCase()
              .includes(this.pageParams.keyword.toLowerCase())
          ) {
            retList.push(item);
          }
        });
        return retList;
      }
      return this.contents;
    }
  },
  watch: {
    scrollMode() {
      if (this.scrollMode)
        window.addEventListener("scroll", this.scrollHandler);
      else window.removeEventListener("scroll", this.scrollHandler);
    }
  },
  methods: {
    //init methods
    initApplication() {
      if (localStorage.lastOrder)
        //localStorage에 마지막으로 사용한 정렬값이 저장되어 있는지 검사
        this.pageParams.order = localStorage.lastOrder;

      this.getCategories().then(categories => {
        if (localStorage.lastFilter)
          //localStorage에 마지막으로 사용한 필터값이 저장되어 있는지 검사
          this.pageParams.filter = JSON.parse(localStorage.lastFilter);
        else {
          let _filter = [];
          categories.forEach(category => {
            _filter.push(category.no);
          });
          this.pageParams.filter = _filter;
        }
      });
    },
    initContents() {
      this.getAds()
        .then(_ads => {
          //광고목록 초기화
          this.ads = _ads;
        })
        .then(() => {
          //디테일 페이지로 이동하기 전 저장한 페이지 정보가 있다면 불러온다.
          if (sessionStorage.lastPageInfo) {
            const pInfo = JSON.parse(sessionStorage.lastPageInfo);
            const scrollTo = pInfo.params.lastScroll;
            this.contents = JSON.parse(pInfo.list);
            this.pageParams.page = pInfo.params.lastPage;
            this.pageParams.keyword = pInfo.params.lastKeyword;
            return scrollTo;
          } else {
            //없다면 새로 리스트를 불러온다.
            this.getContents().then(_contents => {
              this.contents = _contents;
            });
          }
        })
        .then(scroll => {
          //페이지 이동 전 저장한 스크롤 위치로 복귀
          sessionStorage.removeItem("lastPageInfo");
          window.scrollTo(0, scroll);
        })
        .then(() => {
          this.toggleScrollMode(); //스크롤이벤트 on
        });
    },

    initPageParams() {
      this.pageParams.page = 0;
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

      if (!this.pageParams.isNext) return;

      this.pageParams.page += 1;

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
            if (response.data.per === 0) this.pageParams.isNext = false; //다음 페이지가 없으면 스크롤에 의한 요청을 막는다.
            resolve(response.data.list);
          })
          .catch(() => {
            console.log("Failed load content list");
          });
      });
    },
    getAds() {
      const url = "http://comento.cafe24.com/ads.php";

      if (!this.adsParams.isNext) return;

      this.adsParams.page += 1;

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
            if (response.data.per === 0) this.adsParams.isNext = false;
            resolve(response.data.list);
          })
          .catch(() => {
            console.log("Failed load ad list");
          });
      });
    },

    //component event handlers
    updateFilterHandler(list) {
      this.toggleModal();
      if (this.pageParams.filter === list) return;
      this.initPageParams();
      this.pageParams.filter = list;
      localStorage.lastFilter = JSON.stringify(list);
      this.getContents().then(_contents => {
        this.contents = _contents;
      });
    },
    updateOrderHandler(value) {
      if (this.pageParams.order === value) return;
      this.initPageParams();
      this.pageParams.order = value;
      localStorage.lastOrder = value;
      this.getContents().then(_contents => {
        this.contents = _contents;
      });
    },
    updateKeyword(event) {
      this.pageParams.keyword = event.target.value;
    },

    //util methods
    toggleModal() {
      if (this.showModal) this.showModal = false;
      else this.showModal = true;
    },
    transCateNoToName(cno) {
      let ret;
      this.cateList.forEach(category => {
        if (category.no === cno) ret = category.name;
      });
      return ret;
    },
    scrollHandler() {
      //참고자료 : https://javascript.info/size-and-scroll-window
      //스크롤의 최대 Height
      let scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );

      //현재 스크롤된 페이지의 bottom(현재 ScrollTop의 값 + 브라우저 창의 높이)가 스크롤의 최대값과 같은지 검사
      if (window.pageYOffset + window.innerHeight === scrollHeight) {
        /* 
          홀수번째로 게시글을 불러올때 5개의 광고를 추가적으로 불러온다.
          홀수번째 req + 짝수번째 req => 게시글 20개가 추가되고 필요한 광고의 개수는 5개
          더이상 불러올 광고가 없다면 지금까지 불러온 광고를 로테이션하여 사용
        */

        if (this.pageParams.page % 2 == 1) {
          this.getAds().then(_ads => {
            this.ads = this.ads.concat(_ads);
          });
        }

        this.getContents().then(_contents => {
          this.contents = this.contents.concat(_contents);
        });
      }
    },

    //현재 게시글이 광고가 붙을 게시글인지 검사
    isAdContent(curContentIdx) {
      return (curContentIdx + 1) % this.adsParams.perContent == 0;
    },

    //현재 게시글에 붙일 광고를 리턴
    curAdContent(curContentIdx) {
      if (this.ads.length === 0) return;
      let _idx =
        parseInt(curContentIdx / this.adsParams.perContent) % this.ads.length;
      return this.ads[_idx];
    },
    goDetailPage(articleNo) {
      this.toggleScrollMode().then(() => {
        const lastScroll = window.pageYOffset;
        const lastPageInfo = {
          params: {
            lastScroll: lastScroll,
            lastPage: this.pageParams.page,
            lastKeyword: this.pageParams.keyword
          },
          list: JSON.stringify(this.contents)
        };
        sessionStorage.lastPageInfo = JSON.stringify(lastPageInfo);
        this.$router.push("/detail/" + articleNo);
      });
    },
    toggleScrollMode() {
      return new Promise(resolve => {
        if (this.scrollMode) this.scrollMode = false;
        else this.scrollMode = true;
        resolve();
      });
    }
  }
};
</script>