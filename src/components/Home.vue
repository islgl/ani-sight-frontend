<template>
  <el-container class="root">
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-image style="width: 100px; margin-top: 15px;" src="https://oss.lewisliugl.cn/assets/logo-title.svg" />
        </el-col>
        <el-col :span="19">
          <el-menu mode="horizontal" active-text-color="#20a0ff" default-active="1">
            <el-menu-item index="1" route="/home">首页</el-menu-item>
            <el-menu-item index="2" route="/login">历史记录</el-menu-item>
            <el-menu-item index="3" route="/register">我的收藏</el-menu-item>
            <el-menu-item index="4" route="/forget">关于</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="3">
          <el-container class="avatar-container">
            <el-avatar size="medium" :src="avatarUrl" />
            <el-menu mode="horizontal" @select="index => {
              if (index === '2') {
                this.logout();
              }
            }">
              <el-menu-item index="1" route="/home">个人资料</el-menu-item>
              <el-menu-item index="2">退出</el-menu-item>
            </el-menu>
          </el-container>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="5" style="width: 100vw">
          <el-card style="width: 99%;height: 100%">
            <el-container direction="vertical">
              <el-container class="thumb-container" direction="vertical">
                <el-image :src="segUrl">
                </el-image>
                <p>图像分割结果</p>
              </el-container>
              <el-container class="thumb-container" direction="vertical">
                <el-image :src="oriUrl" />
                <p>原始图像</p>
              </el-container>
              <el-container style="justify-content: center;margin-bottom: 20px">
                <el-button type="primary" style="width:200px">下载分割结果</el-button>
              </el-container>
              <el-container style="justify-content: center">
                <el-button type="primary" style="width:200px">下载原始图像</el-button>
              </el-container>
            </el-container>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-container class="image" direction="vertical">
            <el-image style="width: 765px; height: 450px" :src="mainUrl" fit="fill" />
            <el-container>
              <el-upload :http-request="uploadImage" :multiple="false" :limit="1" :auto-upload="true"
                :before-upload="beforeImageUpload" :on-exceed="onExceed">
                <el-button type="primary" class="upload-det-btn">上传图片</el-button>
              </el-upload>
              <el-container style="margin-top: 30px;margin-left: 50px">
                <el-form :inline="true">
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="fontColor" />
                  </el-form-item>
                  <el-form-item label="标注框颜色">
                    <el-color-picker v-model="boxColor" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="width: 150px" @click="inference">AI 识别</el-button>
                  </el-form-item>
                </el-form>
              </el-container>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="5">
          <el-card style="width: 90%;height: 100%">
            <el-container direction="vertical" style="justify-content: center">
              <el-container style="justify-content: center">
                <h3 style="margin-bottom: 20px">图像文本描述</h3>
              </el-container>
              <el-card class="caption" style="margin-bottom: 20px;height: 50vh">
                <p>{{ caption }}</p>
              </el-card>
              <el-container style="justify-content: center">
                <el-button type="primary" style="width:200px">复制到剪贴板</el-button>
              </el-container>
            </el-container>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

  </el-container>
</template>

<script>
import { writeUploadRecord, renameImage, beforeImageUpload, onExceed } from "@/utils/upload.js";
import router from "@/router";
import { ElMessage } from "element-plus";
import { upload, getOssUrl } from "@/utils/oss.js";
import { instance } from "@/utils/request";

export default {
  data() {
    return {
      mainUrl: 'https://oss.lewisliugl.cn/assets/banner.svg',
      segUrl: 'https://oss.lewisliugl.cn/assets/placeholder.svg',
      oriUrl: 'https://oss.lewisliugl.cn/assets/placeholder.svg',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      imageName: '',
      imageId: 0,
      base64: '',
      caption: 'Lorem ipsum',
      fontColor: '#DF7878',
      boxColor: '#68C768',
    }
  },
  methods: {
    onExceed,
    beforeImageUpload,
    uploadImage(item) {
      const file = item.file;
      // 获取文件后缀
      const suffix = file.name.split('.').pop();
      const filename = renameImage() + '.' + suffix;
      const dir = 'images/';
      return upload(filename, dir, file).then((res) => {
        this.mainUrl = res.url;
        this.oriUrl = res.url;
        return img2base64(file);
      }).then((res) => {
        // 去除base64头部
        this.base64 = res.split(',')[1];
        return writeUploadRecord(filename);
      })
        .then((res) => {
          this.imageName = res.filename;
          this.imageId = res.id;
          ElMessage.success('上传成功');
          return Promise.resolve('Successfully uploaded image');
        }).catch((error) => {
          console.error(error);
          ElMessage.error('上传失败，请稍后重试');
          return Promise.reject(error);
        });
    },
    inference() {
      const baseUrl = 'https://fc.lewisliugl.cn/ai';
      const detectUrl = baseUrl + '/detect';
      const captionUrl = baseUrl + '/caption';

      if (this.imageId === 0 || this.imageName === '') {
        ElMessage.warning('请先上传图片');
        return;
      }

      if (this.base64 === '') {
        ElMessage.error('识别失败');
        return;
      }

      const loadingInstance = this.$loading({
        lock: true,
        text: '识别中... 如果是首次识别可能需要较长时间，请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      const detectData = {
        image_id: this.imageId,
        image_name: this.imageName,
        font_color: hex2rgb(this.fontColor),
        bbox_color: hex2rgb(this.boxColor),
      };

      instance.post(captionUrl, this.base64).then((res) => {
        this.caption = res.data.caption;
        return instance.get(detectUrl, {
          params: detectData
        });
      }).then((res) => {
        loadingInstance.close();
        const bboxes = res.bboxes;
        // TODO: write inference record to database
        return getOssUrl(this.imageName.split('.')[0] + '.png', 'masks');
      }).then((res) => {
        this.segUrl = res;
        this.mainUrl = res;
        ElMessage.success('识别成功');
        return Promise.resolve('Successfully inferenced');
      })
        .catch((error) => {
          loadingInstance.close();
          console.error(error);
          ElMessage.error('识别失败，请稍后重试');
          return Promise.reject(error);
        });


    },
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('sts');
      router.push('/login');
    },
  }
}

const hex2rgb = hex => {
  const rgb = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  return `(${rgb.join(',')})`;
}

const img2base64 = file => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    let fileResult = ''
    reader.readAsDataURL(file) //开始转
    reader.onload = function () {
      fileResult = reader.result
    } //转 失败
    reader.onerror = function (error) {
      reject(error)
    } //转 结束  咱就 resolve 出去
    reader.onloadend = function () {
      resolve(fileResult)
    }
  })
}

// TODO: write inference record to database
const writeInferenceRecord = () => {

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

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-det-btn {
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  width: 150px;
}

.thumb-container {
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
}

.caption {
  height: 45vh;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>