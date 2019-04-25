<template>
<div class="content-wrapper">
    <div class="content-header">
        <span class="content-category">{{category}}</span>
        <span class="content-no">글번호-{{content.no}}</span>
    </div>
    <div class="content-body">
        <span class="content-email">{{content.email}}</span>
         <span class="bar"></span>
        <span class="content-regdate">{{content.updated_at}}</span>
        <h3 class="content-title">{{content.title}}</h3>
        <p class="content-text" v-html="content.contents"></p>
    </div>
</div>
</template>
<script>
export default {
    props: ["category", "content"]
}
</script>