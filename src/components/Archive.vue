<template>
  <el-container class="root">
    <el-header>
      <Header style="height: 8vh" :username="username" :avatar="avatarUrl"></Header>
    </el-header>
    <el-container style="height: 92vh">
      <el-aside style="width: 10vw">
        <Nav active-index="archive"></Nav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          <el-table :data="filterArchived(histories)" style="width: 100%" stripe>
            <el-table-column prop="id" label="记录编号" width="180" sortable></el-table-column>
            <el-table-column prop="species" label="识别物种" width="180" sortable></el-table-column>
            <el-table-column prop="caption" label="文本描述"></el-table-column>
            <el-table-column prop="time" label="识别时间" sortable></el-table-column>
            <el-table-column prop="detection" label="识别结果">
              <template #default="scope">
                <el-image :src="scope.row.det" loading="lazy" style="height: 150px"/>
              </template>
            </el-table-column>
            <el-table-column prop="segmentation" label="分割结果">
              <template #default="scope">
                <el-image :src="scope.row.seg" loading="lazy" style="height: 150px"/>
              </template>
            </el-table-column>
            <el-table-column prop="archive" label="取消归档">
              <template #default="scope">
                <el-button type="primary" @click="cancelArchived(scope.row.id)">取消归档</el-button>
              </template>
            </el-table-column>
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
import {instance} from "@/utils/request.js";
import {ElMessage} from "element-plus";

export default {
  name: "Archive",
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      histories: [],
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }
    // 获取历史记录
    const url = '/histories?uid=' + this.uid
    const loadingInstance = this.$loading({
      lock: true,
      text: '正在加载历史记录，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    instance.get(url).then(response => {
      const data = response.data;
      for (const item of data) {
        this.histories.push({
          id: item.id,
          species: item.species,
          archived: item.star === 1,
          caption: item.caption,
          time: formatTimestamp(item.timestamp),
          det: 'https://oss.lewisliugl.cn/labels/' + item.imageName,
          seg: 'https://oss.lewisliugl.cn/masks/' + item.imageName.replace('.jpg', '.png'),
        });
      }
      loadingInstance.close();
      // 将历史记录写入localStorage
      localStorage.setItem('histories', JSON.stringify(this.histories));
    }).catch(error => {
      loadingInstance.close();
      console.log(error);
    });
  },
  methods: {
    filterArchived(histories) {
      return histories.filter(history => history.archived);
    },
    cancelArchived(id) {
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在取消归档，请稍候...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      instance.put('/histories/' + id + '?star=0').then(response => {
        loadingInstance.close();
        ElMessage.success('已取消归档');
        this.histories = this.histories.filter(item => item.id !== id);
      }).catch(error => {
        loadingInstance.close();
        console.log(error);
        ElMessage.error('取消归档失败，请重试');
      });
    }
  }
}
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}
</style>