
<template>
  <div id="app">
    <div class="app-header">
      <div class="header-wrapper">
        <h1>프론트엔드 1차 과제</h1>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    created() {
      if(!document.querySelector('meta[name="viewport"]')){
        let meta = document.createElement('meta');
        meta.name="viewport";
        meta.content="width=device-width, initial-scale=1, maximum-scale=1";
        document.querySelector('head').appendChild(meta);
      }
    }
  }
</script>