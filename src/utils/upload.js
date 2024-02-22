import {upload} from "@/utils/oss.js";
import {ElMessage} from "element-plus";
import {instance} from "@/utils/request.js";

export const beforeImageUpload = (file) => {
    const suffix = file.name.split('.').pop();
    if (suffix !== 'jpg' && suffix !== 'jpeg' && suffix !== 'png') {
        console.error('Invalid image format')
        ElMessage.error('上传失败，请上传jpg/jpeg/png格式的图片');
        return false;
    }
    return true;
}

export const onExceed = (files, fileList) => {
    ElMessage.warning('最多只能上传一个文件');
    return false;
}

const renameImage = () => {
    let user = localStorage.getItem('user');
    if (!user) {
        console.warn("No valid user information found in localStorage");
        return;
    }
    const uid = JSON.parse(user).uid;
    const now = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return uid + '-' + now + '-' + random;
}

const writeRecord = filename => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.warn("No valid user information found in localStorage");
        return Promise.reject(new Error("No valid user information found"));
    }
    const uid = user.uid;
    const formData = new FormData();
    formData.append('uid', uid);
    formData.append('name', filename);
    return instance.post('/images', formData).then((res) => {
        return Promise.resolve('上传成功');
    }).catch((error) => {
        console.error('Failed to write image record: ', error);
        return Promise.reject('上传失败，请稍后重试');
    });
}


export const uploadImage = (item) => {
    const file = item.file;
    // 获取文件后缀
    const suffix = file.name.split('.').pop();
    const filename = renameImage() + '.' + suffix;
    const dir = 'images/';
    return upload(filename, dir, file).then((res) => {
        return writeRecord(filename);
    }).then((res) => {
        ElMessage.success('上传成功');
        return Promise.resolve('Successfully uploaded image');
    }).catch((error) => {
            console.error(error);
            ElMessage.error('上传失败，请稍后重试');
            return Promise.reject(error);
        });

}