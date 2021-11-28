<template>
  <el-container class="platform_page">
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup></script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.platform_page {
  height: 100%;
  .el-header {
    // height: 60px !important;
    background: $themeColor;
  }
  .el-container {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    .el-aside,
    .el-main {
      height: 100%;
      overflow: hidden;
    }
    .el-main {
      background: $bgColor;
      padding: 10px;
      flex: 1;
    }
  }
}
</style>