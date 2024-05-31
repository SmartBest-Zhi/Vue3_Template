/**
 * @Description: 进行请求和响应的封装处理
 * @author Chongzhi.Yang
 * @date 4/9/2024
*/

import axios from "axios";

import {
    handleChangeRequestHeader,
    handleConfigureAuth,
    handleAuthError,
    handleGeneralError,
    handleNetworkError,
} from "./tool";

type Fn = (data: FcResponse<any>) => unknown;

interface IAnyObj {
    [index: string]: unknown;
}

interface FcResponse<T> {
    status: number;
    message: string;
    data: string;
}

axios.interceptors.request.use((config) => {
    config = handleChangeRequestHeader(config);
    config = handleConfigureAuth(config);
    return config;
});

axios.interceptors.response.use(
    (response) => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status !== 200 ) return Promise.reject(response.data);
        if (response.data.code !== 0){
            handleAuthError(response.data.code)
            handleGeneralError(response.data.code, response.data.message)
            return Promise.reject(response.data)
        }
        return response;
    },
    (err) => {
        console.info("🚀 ~ file:server method: line:43 -----", err)
        handleNetworkError(err.response.status)
        return Promise.reject(err.response);
    }
);

export const Get = <T,>(
    url: string,
    params: IAnyObj = {},
    clearFn?: Fn
): Promise<[any, FcResponse<T> | undefined]> =>
    new Promise((resolve) => {
        axios
            .get(url, { params })
            .then((result) => {
                let res: FcResponse<T>;
                if (clearFn !== undefined) {
                    res = clearFn(result.data) as unknown as FcResponse<T>;
                } else {
                    res = result.data as FcResponse<T>;
                }
                resolve([null, res as FcResponse<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });

export const Post = <T,>(
    url: string,
    data: IAnyObj,
    params: IAnyObj = {}
): Promise<[any, FcResponse<T> | undefined]> => {
    return new Promise((resolve,reject) => {
        axios
            .post(url, data, { params })
            .then((result) => {
                resolve([null, result.data as FcResponse<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });
};