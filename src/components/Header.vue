<template>
  <el-header class="header">
    <div class="left">
      <el-image :src="logo" class="logo"/>
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        width="200"
        trigger="click"
        :title="versionTitle"
        :content="versionInfo"
      >
        <template #reference>
          <div class="badges">
            <button class="blue">{{ version }}</button>
          </div>
        </template>
      </el-popover>
      <el-text class="username">{{ username }}</el-text>
      <el-avatar :src="avatar" class="avatar"/>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      logo: "https://oss.lewisliugl.cn/assets/logo-title.svg",
      version:'v1.7.6',
      versionTitle:'v 1.7.6 更新内容',
      versionInfo:'👋 添加边缘计算页面 🎉'
    }
  },
  props:{
    username: {
      type: String,
      default: '用户'
    },
    avatar: {
      type: String,
      default: 'https://oss.lewisliugl.cn/avatar/default.svg'
    }
  }

}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  flex: 1;
}

.right {
  display: flex;
  align-items: center;
  margin-right: 3vw;
}

.logo {
  width: 100px;
  margin-top: 20px;
}

.username {
  margin-right: 20px;
}

.badges {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-right: 1vw;
}

.badges > button {
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
  padding: 2px .5rem; /* 8px*/
  cursor: pointer;
  border: none;
  border-radius: 0.375rem; /* 6px */
  outline: none;
}

.badges .blue {
  background-color: rgba(59, 130, 246, 0.10);
  color: rgb(59 130 246);
  border: 1px rgb(59 130 246) solid;
}

</style>
