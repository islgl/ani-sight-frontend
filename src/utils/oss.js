import { instance } from "@/utils/request.js";
import OSS from 'ali-oss';
import axios from "axios";

const headers = {
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'private',
    // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'false',
};

const getStsCredential = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
        console.error("No valid user information found in localStorage");
        return null;
    }
    const uid = JSON.parse(user).uid;
    try {
        const response = await instance.get('/images/sts-credentials', {
            params: {
                uid: uid
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get STS credential from server', error);
        return null;
    }
}

const getClient = async () => {
    const credential = await getStsCredential();
    const client = new OSS({
        // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        // region: 'oss-cn-beijing',
        endpoint: 'https://oss.lewisliugl.cn',
        cname: true,
        // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
        accessKeyId: credential.accessKeyId,
        accessKeySecret: credential.accessKeySecret,
        stsToken: credential.securityToken,
        // 填写Bucket名称。
        // bucket: 'ani-sight',
    });
    return client;
}


export async function upload(filename, dir, file) {
    try {
        const client = await getClient();
        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        if (!dir.endsWith('/')) {
            dir += '/';
        }
        const filepath = dir + filename
        let url = client.signatureUrl(filepath, { expires: 300, method: 'PUT' });
        const parsedUrl = new URL(url);
        url = parsedUrl.origin + parsedUrl.pathname + '?Signature=' + parsedUrl.searchParams.get('Signature');
        
        const result = await axios.put(url, file, { headers });

        // const result = await client.put(filepath, file, { headers });

        // 获取带签名的 URL，5min有效
        // const url = client.signatureUrl(filepath, { expires: 300 });
        return {
            url: url,
            result: result
        }
    } catch (e) {
        console.error("Failed to upload file to OSS", e)
        return null;
    }
}

export async function getOssUrl(filename, dir) {
    try {
        const client = await getClient();
        if (!dir.endsWith('/')) {
            dir += '/';
        }
        const filepath = dir + filename
        // const url = client.signatureUrl(filepath, { expires: 300 });
        let url = client.signatureUrl(filepath, { expires: 300, responseContentDisposition: 'attachment' });
        const parsedUrl = new URL(url);
        url = parsedUrl.origin + parsedUrl.pathname + '?Signature=' + parsedUrl.searchParams.get('Signature') + '&Expires=' + parsedUrl.searchParams.get('Expires');
        console.log(url);
        return url;
    }
    catch (e) {
        console.error("Failed to get OSS URL", e);
        return null;
    }
}

