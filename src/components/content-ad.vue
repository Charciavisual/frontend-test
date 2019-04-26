<template>
  <div class="ad-wrapper">
    <div class="ad-label">Sponsored</div>
    <div class="ad-body">
      <div class="ad-image-wrapper">
        <img :src="'http://comento.cafe24.com/public/images/'+ad.img" alt="광고이미지">
      </div>
      <div class="ad-content-wrapper">
        <h3>{{ad.title}}</h3>
        <p v-html="ad.contents"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["ad"]
};
</script>