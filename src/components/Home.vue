<template>
  <el-container class="root">
    <el-header>
      <Header style="height: 8vh" :username="username" :avatar="avatarUrl"></Header>
    </el-header>
    <el-container style="height: 92vh">
      <el-aside style="width: 10vw">
        <Nav active-index="home"></Nav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          <el-card shadow="always" class="welcome">
            <div class="greeting-container">
              <div class="title">
                <i class="iconfont icon-bell"/>
                <h1 class="greeting">
                  Hi，{{ username }}！欢迎使用AniSight。
                </h1>
              </div>
              <div class="title">
                <i class="iconfont icon-rili"/>
                <h1 class="greeting">
                  {{ currentDate }}
                </h1>
              </div>
            </div>
            <el-text type="info" size="large" style="margin-left: 20px">
              AniSight 是一款基于深度大模型的野生动物识别系统，支持目标检测、图像分割、文本描述等功能。
            </el-text>

          </el-card>
          <el-container class="overview">
            <el-card shadow="always" class="content history">
              <div class="title">
                <i class="icon iconfont icon-lishijilu"/>
                <h2>历史记录总数</h2>
              </div>
            </el-card>
            <el-card shadow="always" class="content star">
              <div class="title">
                <i class="icon iconfont icon-shoucang"/>
                <h2>我的归档总数</h2>
              </div>
            </el-card>
            <el-card shadow="always" class="content most">
              <div class="title">
                <i class="icon iconfont icon-xiongmaobaohu"/>
                <h2>识别最多物种</h2>
              </div>
            </el-card>
          </el-container>
          <el-container class="function">
            <el-card shadow="always" class="content inference">
              <div class="image-container">
                <template v-if="!oriUrl">
                  <el-empty description="请先上传图片" class="image"/>
                </template>
                <template v-else>
                  <el-image :src="oriUrl" fit="scale-down" :previewSrcList="[oriUrl]"
                            class="image" :hide-on-click-modal="true"/>
                </template>
              </div>
              <el-divider border-style="dashed"/>
              <el-container class="buttons">
                <el-upload :http-request="uploadImage" :multiple="false" :auto-upload="true"
                           :before-upload="beforeImageUpload" :on-exceed="onExceed" :show-file-list="false"
                           class="button">
                  <el-button type="primary" class="button">
                    <el-icon>
                      <UploadFilled/>
                    </el-icon>
                    上传图片
                  </el-button>
                </el-upload>
                <el-button type="primary" class="button" @click="inference">
                  <el-icon>
                    <Aim/>
                  </el-icon>
                  AI 识别
                </el-button>
                <el-text class="text">标注框颜色</el-text>
                <el-color-picker v-model="boxColor"/>
                <el-text class="text">字体颜色</el-text>
                <el-color-picker v-model="fontColor"/>
              </el-container>
            </el-card>
            <el-card shadow="always" class="content result">
              <el-container class="image-results">
                <template v-if="!detUrl">
                  <el-empty description="上传图片并识别以获取结果" class="image"/>
                </template>
                <template v-else>
                  <el-image :src="detUrl" class="image"
                            fit="scale-down" :preview-src-list="[detUrl]" :hide-on-click-modal="true"/>
                </template>
                <el-divider direction="vertical" style="height: 100%"/>
                <template v-if="!segUrl">
                  <el-empty description="上传图片并识别以获取结果" class="image"/>
                </template>
                <template v-else>
                  <el-image :src="segUrl" class="image"
                            fit="scale-down" :preview-src-list="[segUrl]" :hide-on-click-modal="true"/>
                </template>
              </el-container>
              <el-divider border-style="dotted"/>
              <el-input id="copy" type="textarea" placeholder="请上传图片并识别以获取文本描述" :rows="3"
                        :readonly="true"
                        resize='none'
                        v-model="caption"/>
              <el-divider border-style="dotted"/>
              <el-container class="buttons">
                <el-button type="primary" @click="downloadDetResult">
                  <el-icon>
                    <Download/>
                  </el-icon>
                  下载识别结果
                </el-button>
                <el-button type="primary" @click="downloadSegResult">
                  <el-icon>
                    <Download/>
                  </el-icon>
                  下载分割结果
                </el-button>
                <el-button type="primary" id="copyBtn" data-clipboard-target="#copy">
                  <el-icon>
                    <CopyDocument/>
                  </el-icon>
                  复制文本描述
                </el-button>
                <el-button type="primary" @click="archiveResult" disabled="true">
                  <el-icon>
                    <template v-if="starBtnVal === '归档成功'">
                      <StarFilled/>
                    </template>
                    <template v-else>
                      <Star/>
                    </template>
                  </el-icon>
                  {{ starBtnVal }}
                </el-button>
              </el-container>
            </el-card>
          </el-container>
        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {
  Aim,
  BellFilled,
  Comment,
  CopyDocument,
  Download,
  Edit,
  Star,
  StarFilled,
  UploadFilled
} from "@element-plus/icons";
import {ElMessage, ElMessageBox} from "element-plus";
import {logout} from "@/utils/utils.js";
import {instance} from "@/utils/request.js";
import {getOssUrl, upload} from "@/utils/oss.js";
import {beforeImageUpload, onExceed, renameImage, writeUploadRecord} from "@/utils/upload.js";
import Clipboard from "clipboard";

export default {
  name: 'Home',
  components: {StarFilled, Star, BellFilled, CopyDocument, Comment, Download, Aim, UploadFilled, Edit},
  data() {
    return {
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      currentDate: '',
      starBtnVal: '归档当前结果',

      oriUrl: '',
      detUrl: '',
      segUrl: '',
      caption: '',

      imageId: 0,
      imageName: '',
      fontColor: '#DF7878',
      boxColor: '#68C768',
    }
  },
  created() {
    this.currentDate = this.getCurrentDate();
  },
  methods: {
    getCurrentDate() {
      const now = new Date();
      return now.toLocaleDateString();
    },
    onExceed,
    beforeImageUpload,
    uploadImage(item) {
      const file = item.file;
      // 获取文件后缀
      const suffix = file.name.split('.').pop();
      const filename = renameImage() + '.' + suffix;
      const dir = 'images/';
      return upload(filename, dir, file).then((res) => {
        this.oriUrl = res.url;
        this.oriUrl = res.url;
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
      const detectUrl = 'https://fc.lewisliugl.cn/ai/detect';
      const captionUrl = 'https://image-caption-yapmqhwfps.cn-hongkong.fcapp.run'

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
        text: '识别中，请耐心等待...',
        background: 'rgba(0, 0, 0, 0.7)',
      });


      const detectData = {
        image_id: this.imageId,
        image_name: this.imageName,
        font_color: hex2rgb(this.fontColor),
        bbox_color: hex2rgb(this.boxColor),
      };

      instance.get(captionUrl, {
        // 获取文本描述
        params: {
          image_id: this.imageId,
          image_name: this.imageName
        }
      }).then((res) => {
        // 获取目标检测结果
        this.caption = res.data;
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
        ElMessage.success('识别成功');
        return getOssUrl(this.imageName, 'labels');
      }).then((res) => {
        this.detUrl = res;
        return Promise.resolve('Successfully detected');
      }).catch((error) => {
        loadingInstance.close();
        console.error(error);
        ElMessage.error('识别失败，请稍后重试');
        return Promise.reject(error);
      });
    },
    logout,
    downloadSegResult() {
      if (this.segUrl === 'https://oss.lewisliugl.cn/assets/placeholder.svg') {
        ElMessage.warning('请先上传图片并识别');
        return;
      }
      const downloadUrl = this.segUrl;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.click();
    },
    downloadDetResult() {
      if (this.oriUrl === 'https://oss.lewisliugl.cn/assets/placeholder.svg') {
        ElMessage.warning('请先上传图片并识别');
        return;
      }
      const downloadUrl = this.oriUrl;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.click();
    },
    archiveResult() {
      const placeholder = 'https://oss.lewisliugl.cn/assets/placeholder.svg'
      if (!this.caption && this.segUrl === placeholder && this.detUrl === placeholder) {
        ElMessage.info('请上传图片并识别以获取结果')
      } else if (!this.caption || this.segUrl === placeholder || this.detUrl === placeholder) {
        ElMessage.error('识别结果不完整，归档失败')
      }
      // TODO: write archive record to database

    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }
  }
}
const hex2rgb = hex => {
  const bgr = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const rgb = [bgr[2], bgr[1], bgr[0]];
  return `(${rgb.join(',')})`;
}

// TODO: write inference record to database
const writeInferenceRecord = () => {

}

const clipboard = new Clipboard('#copyBtn');
clipboard.on('success', function (e) {
  e.clearSelection();
  ElMessage.success('复制成功');
  this.copyBtnVal = "复制成功";
});
clipboard.on('error', function (e) {
  e.clearSelection();
  ElMessage.info('请上传图片并识别以获取文本描述');
});
</script>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}

.welcome {
  width: 95%;
  height: 15%;
  background-color: rgba(243, 246, 253, 0.7); /* 透明度设置为0.7 */
}

.welcome .greeting-container {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 在容器中平均分布子元素，使它们横向排列 */
}

.welcome .greeting-container .title {
  display: flex;
  align-items: center;
}

.welcome .greeting-container .greeting {
  font-size: 1.5rem;
  margin-bottom: 1%;
}

.welcome .greeting-container i {
  font-size: 1.8rem;
  margin-right: 20px;
}

.overview {
  width: 95%;
  height: 15%;
  margin-top: 1%;
}

.overview .title {
  display: flex;
  align-items: center;
}

.overview .icon {
  font-size: 3rem;
  margin-right: 15px;
}

.overview h2 {
  font-size: 1.5rem;
  font-family: fangyuan, sans-serif;
}

.overview .content {
  width: 33%;
  height: 100%;
  margin-right: 1%;
}

.overview .el-card {
  display: flex;
  align-items: center;
}

/* 修改后的样式 */
.overview .most {
  margin-right: 0;
  background-color: rgba(219, 246, 253, 0.7); /* #DBF6FD，透明度为0.7 */
}

.overview .history {
  background-color: rgba(254, 228, 203, 0.7); /* #FEE4CB，透明度为0.7 */
}

.overview .star {
  background-color: rgba(233, 231, 253, 0.7); /* #E9E7FD，透明度为0.7 */
}


.function {
  width: 95%;
  height: 65%;
  margin-top: 1%;
}

.function .content {
  width: 49%;
  margin-right: 2%;
}

.function .inference {
  display: flex;
  flex-direction: column;
}

.function .inference .image-container {
  height: 35vh;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2%;
}

.function .inference .image-container .image {
  height: 100%;
  width: 100%;
}

.function .result {
  margin-right: 0;
}


.function .inference .buttons {
  display: flex;
  justify-content: center;
}

.function .inference .buttons .button {
  width: 8vw;
  margin-right: 3%;
}

.function .inference .buttons .text {
  margin-left: 3%;
  margin-right: 1%;
  display: flex;
  align-items: center;
}

.function .result .image-results {
  display: flex;
  justify-content: space-between;
  height: 22vh;
}

.function .result .image-results .image {
  width: 49%;
  height: auto;
}

.function .result .buttons {
  display: flex;
  justify-content: center;
//margin-top: 4%;
}

.function .result .buttons .el-button {
  width: 8vw;
  margin-right: 2%;
}

.el-icon {
  margin-right: 3px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>