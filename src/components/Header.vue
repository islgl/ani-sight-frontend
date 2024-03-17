<template>
    <el-header class="header">
        <div class="left">
            <el-image :src="logo" class="logo" />
        </div>
        <div class="right">
            <el-text class="username">{{ username }}</el-text>
            <el-avatar :src="avatar" class="avatar" />
        </div>
    </el-header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            logo: "https://oss.lewisliugl.cn/assets/logo-title.svg",
            avatar: "https://oss.lewisliugl.cn/avatar/default.svg",
            username: "演绎法"
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
}

.logo {
    width: 100px;
    margin-top: 20px;
}

.username {
    margin-right: 20px;
}
</style>
