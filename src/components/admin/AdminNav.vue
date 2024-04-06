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
    <el-menu-item index="users" route>
      <el-icon>
        <UserFilled/>
      </el-icon>
      用户管理
    </el-menu-item>
    <el-menu-item index="images" route>
      <el-icon>
        <PictureFilled/>
      </el-icon>
      图像管理
    </el-menu-item>
    <el-menu-item index="records" route>
      <el-icon>
        <Coin/>
      </el-icon>
      记录管理
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
import {
  MessageBox,
  Management,
  HomeFilled,
  Tools,
  InfoFilled,
  SwitchButton,
  UserFilled,
  Coin, PictureFilled
} from "@element-plus/icons";
import {logout} from "@/utils/utils.js";
export default {
  name: "AdminNav",
  components: {PictureFilled, Coin, MessageBox, Management, UserFilled, Tools, InfoFilled, SwitchButton},
  props: {
    activeIndex: {
      type: String,
      default: 'users'
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