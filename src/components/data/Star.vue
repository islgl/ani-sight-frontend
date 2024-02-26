<template>
    <el-container class="root">
        <el-header>
            <el-row>
                <el-col :span="2">
                    <el-image style="width: 100px; margin-top: 15px;"
                        src="https://oss.lewisliugl.cn/assets/logo-title.svg" />
                </el-col>
                <el-col :span="19">
                    <el-menu mode="horizontal" active-text-color="#20a0ff" default-active="3" router>
                        <el-menu-item index="1" route="/home">首页</el-menu-item>
                        <el-menu-item index="2" route="/history">历史记录</el-menu-item>
                        <el-menu-item index="3" route="/star">我的收藏</el-menu-item>
                        <el-menu-item index="4" route="/about">关于</el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="3">
                    <el-container class="avatar-container">
                        <el-avatar size="medium" :src="avatarUrl" />
                        <el-menu mode="horizontal" :ellipsis="false" style="border-bottom: none" @select="index => {
                            if (index === '5-2') {
                                this.logout();
                            }
                        }" router>
                            <el-sub-menu>
                                <template #title>{{ username }}</template>
                                <el-menu-item index="5-1" route="/profile">个人资料</el-menu-item>
                                <el-menu-item index="5-2">退出</el-menu-item>
                            </el-sub-menu>
                        </el-menu>
                    </el-container>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <h3>这是我的收藏的测试页面</h3>
        </el-main>
    </el-container>
</template>

<script>
import { logout } from "@/utils/utils.js";

export default {
    data() {
        return {
            mainUrl: 'https://oss.lewisliugl.cn/assets/banner.svg',
            avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
            username: '用户',
        }
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.avatarUrl = user.avatar;
            this.username = user.username;
        }
    },
    methods: {
        logout,
    }
}
</script>

<style scoped>
* {
    overflow: hidden;
}

.root {
    height: 100vh;
    width: 100vw;
}

.el-main {
    display: flex;
    justify-content: center;
    align-items: center;

}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>