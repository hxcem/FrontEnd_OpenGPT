import axios from 'axios';

// 配置根域名
export const request = axios.create({
    baseURL: 'http://askapi.huaxincem.com',
    timeout: 1000000,
})

// 添加请求拦截器
request.interceptors.request.use(config => {
    return config;
}, (error) => {
    return Promise.reject(error);
})

// 添加响应拦截器
request.interceptors.response.use(response => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

export const restfulRequest = (text, history) => {
    const defaultHeaders = {
        'Authorization': 'T0y8ig9zBqZyI3FFrLTSxbPms3eFdOwU', // 替换为你的API Key
        'Content-Type': 'application/json',
    };

    return request.post('/chat', {
        text,
        history,
        source: 'wechatwork'
    }, {
        headers: defaultHeaders
    });
};