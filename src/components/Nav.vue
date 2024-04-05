<template>
  <el-menu
      :default-active="this.activeIndex"
      :collapse="isCollapse"
      :collapse-transition="true"
      @select="index => {
        if(index==='logout') {
          this.logout()
        }
      }"
      router
  >
    <el-menu-item index="home" route>
      <el-icon>
        <HomeFilled/>
      </el-icon>
      首页
    </el-menu-item>
    <el-menu-item index="history" route>
      <el-icon>
        <Management/>
      </el-icon>
      历史
    </el-menu-item>
    <el-menu-item index="archive" route>
      <el-icon>
        <MessageBox/>
      </el-icon>
      归档
    </el-menu-item>
    <el-menu-item index="setting" route>
      <el-icon>
        <Tools/>
      </el-icon>
      设置
    </el-menu-item>
    <el-menu-item index="logout" class="logout">
      <el-icon>
        <SwitchButton/>
      </el-icon>
      退出
    </el-menu-item>
  </el-menu>
</template>

<script>
import {MessageBox, Management, HomeFilled, Tools, InfoFilled, SwitchButton} from "@element-plus/icons";
import {logout} from "@/utils/utils.js";
export default {
  name: "Nav",
  components: {MessageBox, Management, HomeFilled, Tools, InfoFilled, SwitchButton},
  props: {
    activeIndex: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      isCollapse: false,
    }
  },
  methods: {
    logout,
  }
}
</script>

<style>
.logout {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.el-menu {
  height: 100%;
}

.el-icon {
  margin-right: 3px;
}
</style>