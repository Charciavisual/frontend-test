<template>
    <div class="replies" v-if="replies.length > 0">
        <h3 class="replies-label">댓글 - {{replies.length}}</h3>
        <ul>
            <li v-for="item in replies" :key="'reply_'+item.no">
                <div class="reply-wrapper">
                    <div class="reply-header">
                        <span class="reply-email">{{item.email}}</span>
                        <span class="reply-regdate">{{item.updated_at}}</span>
                    </div>
                    <div class="reply-body" v-html="item.contents"></div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        props: ["replies"]
    }
</script>