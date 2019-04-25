<template>
<div class="article-wrapper">
    <div class="article-header">
        <h2>{{article.title}}</h2>
        <div>
            <span>{{article.email}}</span>
            <span class="bar"></span>
            <span>{{article.updated_at}}</span>
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