<template>
  <el-menu
      :default-active="activeIndex"
      :collapse="isCollapse"
  >
    <el-menu-item index="1" route="/home">
      <el-icon><HomeFilled /></el-icon>首页</el-menu-item>
    <el-menu-item index="2" route="/home">
      <el-icon><Management /></el-icon>历史</el-menu-item>
    <el-menu-item index="3" route="/home">
      <el-icon><MessageBox /></el-icon>归档</el-menu-item>
    <el-menu-item index="4" route="/home">
      <el-icon><Tools /></el-icon>设置</el-menu-item>
    <el-menu-item index="5" route="/home">
      <el-icon><InfoFilled /></el-icon>关于</el-menu-item>
    <el-menu-item index="6" route="/home" class="logout">
      <el-icon><SwitchButton /></el-icon>退出</el-menu-item>
  </el-menu>
</template>

<script setup>
import {HomeFilled, InfoFilled, Management, MessageBox, StarFilled, SwitchButton, Tools} from "@element-plus/icons";
const activeIndex="1"
const isCollapse=false
</script>

<style>
  .logout{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .el-menu{
    height: 100%;
  }

  .el-icon{
    margin-right: 3px;
  }
</style>