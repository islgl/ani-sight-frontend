<template>
  <el-container class="root">
    <el-header>
      <Header style="height: 8vh" :username="username" :avatar="avatarUrl"></Header>
    </el-header>
    <el-container style="height: 92vh">
      <el-aside style="width: 10vw">
        <Nav active-index="history"></Nav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          <el-table :data="histories" style="width: 100%">
            <el-table-column prop="id" label="记录编号" width="180"></el-table-column>
            <el-table-column prop="archived" label="是否归档" width="180"></el-table-column>
            <el-table-column prop="species" label="识别结果" width="180"></el-table-column>
            <el-table-column prop="caption" label="文本描述"></el-table-column>
            <el-table-column prop="time" label="识别时间"></el-table-column>
            <el-table-column prop="detail" label="详情" width="180"></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import Footer from "@/components/Footer.vue";
import {instance} from "@/utils/request.js";

export default {
  name: "History",
  components: { Footer },
  data() {
    return {
      uid: 0,
      username: "用户",
      avatarUrl: "https://oss.lewisliugl.cn/avatar/default.svg",
      histories: []
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }

    // 获取历史记录
    const url='/histories?uid='+this.uid
    instance.get(url).then(response => {
      const data = response.data;
      for (const item of data) {
        this.histories.push({
          id: item.id,
          archived: item.star===1 ? '是' : '否',
          species: item.species,
          caption: item.caption,
          time: item.timestamp,
          detail: '详情'
        });
      }
      console.log(this.histories)
    }).catch(error => {
      console.log(error);
    });
  }
}
</script>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}
</style>