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
            <el-table-column type="index" label="记录编号" width="180"></el-table-column>
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
            <el-table-column prop="archive" label="是否归档">
              <template #default="scope">
                <el-switch v-model="scope.row.archived" @change="archiveChange(scope.row.id,scope.row.archived)"/>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除记录">
              <template #default="scope">
                <el-button type="danger" @click="deleteHistory(scope.row.id)">删除</el-button>
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

import Footer from "@/components/Footer.vue";
import {instance} from "@/utils/request.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {View} from "@element-plus/icons";
import {formatTimestamp} from "@/utils/utils.js";

export default {
  name: "History",
  components: {View, Footer},
  data() {
    return {
      uid: 0,
      username: "用户",
      avatarUrl: "https://oss.lewisliugl.cn/avatar/default.svg",
      histories: [],
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
    }).catch(error => {
      loadingInstance.close();
      console.log(error);
    });
  },
  methods: {
    archiveChange(id, archived) {
      // 归档记录
      if (archived) {
        const loadingInstance = this.$loading({
          lock: true,
          text: '正在归档，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        instance.put('/histories/' + id + '?star=1').then(response => {
          loadingInstance.close();
          ElMessage.success('归档成功');
        }).catch(error => {
          loadingInstance.close();
          console.log(error);
          ElMessage.error('归档失败，请重试');
        })
      } else {
        // 取消归档
        const loadingInstance = this.$loading({
          lock: true,
          text: '正在取消归档，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        instance.put('/histories/' + id + '?star=0').then(response => {
          loadingInstance.close();
          ElMessage.success('已取消归档');
        }).catch(error => {
          loadingInstance.close();
          console.log(error);
          ElMessage.error('取消归档失败，请重试');
        });
      }
    },
    deleteHistory(id) {
      ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance = this.$loading({
          lock: true,
          text: '正在删除记录，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        instance.delete('/histories/' + id).then(response => {
          loadingInstance.close();
          ElMessage.success('删除成功');
          this.histories = this.histories.filter(item => item.id !== id);
        }).catch(error => {
          loadingInstance.close();
          console.log(error);
          ElMessage.error('删除失败，请重试');
        })
      });
    }
  }
}
</script>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}
</style>