<template>
<div class="article-wrapper">
    <div class="article-header">
        <h2>{{article.title}}</h2>
        <div>
            <span class="sp_email">{{article.email}}</span>
            <span class="bar pc-only"></span>
            <span class="sp_regdate">{{article.updated_at}}</span>
        </div>
    </div>
    <div class="article-body" v-html="article.contents"></div>
</div>   
</template>
<script>
    export default{
        props: ["article"]
    }
</script>