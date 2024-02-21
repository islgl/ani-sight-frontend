<template>
  <el-container class="root">
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">历史记录</el-menu-item>
        <el-menu-item index="3">我的收藏</el-menu-item>
        <el-menu-item index="4">关于</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="5" style="width: 100vw">
          <el-card style="width: 99%;height: 100%">
            <el-container direction="vertical">
              <el-container class="thumb-container" direction="vertical">
                <el-image src="https://cdn.jsdelivr.net/gh/islgl/img-hosting/imgs/202311161708036.jpg">
                </el-image>
                <p>图像分割结果</p>
              </el-container>
              <el-container class="thumb-container" direction="vertical">
                <el-image src="https://cdn.jsdelivr.net/gh/islgl/img-hosting/imgs/202311240050065.png"/>
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
            <el-image
                style="width: 765px; height: 450px"
                :src="url"
                :fit="fit"></el-image>
            <el-container>
              <el-upload>
                <el-button type="primary" class="upload-det-btn">上传图片</el-button>
              </el-upload>
              <el-container style="margin-top: 30px;margin-left: 50px">
                <el-form :inline="true">
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="fontColor"/>
                  </el-form-item>
                  <el-form-item label="标注框颜色">
                    <el-color-picker v-model="boxColor"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="width: 150px">AI 识别</el-button>
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
              <el-card class="caption" style="margin-bottom: 20px;height: 50vh">Lorem ipsum</el-card>
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
export default {
  data() {
    return {
      url: 'https://cdn.jsdelivr.net/gh/islgl/img-hosting/imgs/202311240050080.png',
      fit: 'fill',
      fontColor: '#DF7878',
      boxColor: '#68C768'
    }
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

</style>