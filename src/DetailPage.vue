<template>
<div class="detail-wrapper">
    <article-detail :article="article"></article-detail>
     <div class="detail-footer">
        <button class="btn-white" @click="goListPage()">목록으로</button>
    </div>
    <reply-list :replies="replies"></reply-list>
   
</div>
</template>
<script>
import axios from "axios";
import articleDetail from "./components/article";
import replyList from "./components/replyList";
export default{
    components: {articleDetail, replyList},
    data() {
        return {
            article: {},
            replies: []
        }
    },
    created() {
        const req_no = this.$route.params.req_no;
        if (req_no === undefined) {
            this.$router.go(-1);
        }
        this.getContentDetail(req_no);
    },
    methods: {
        getContentDetail(_req_no){
            const url = "http://comento.cafe24.com/detail.php";
            axios({
                url: url,
                method: "GET",
                params: {
                    req_no : _req_no
                }
            }).then(response => {
                const detail = response.data.detail;
                this.article = detail.article;
                this.replies = detail.replies;
            }).catch(error => {
                console.log("Failed load detail data");
            })

        },
        goListPage() {
            this.$router.push('/');
        }
    }
}
</script>