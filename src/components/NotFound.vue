<script setup>

import Footer from "@/components/Footer.vue";
</script>

<template>
  <div class="root">
    <el-empty description="404 Page Not Found" :image-size="300"/>
    <el-footer>
      <Footer/>
    </el-footer>
  </div>
</template>

<style scoped>
  .root{
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-empty{
    width: 80%;
  }
  .el-footer{
    position: absolute;
    bottom: 0;
    width: 80%;
  }
</style>