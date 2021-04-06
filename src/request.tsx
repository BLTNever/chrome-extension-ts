import axios from 'axios'
import $cookie from 'js-cookie'

interface AnyKey {
    [propName: string]: any
}
interface OptionConfig {
    [propName: string]: any
}

let axiosObejct = axios.create({
    timeout: 4900,
    responseType: 'json',
    withCredentials: false,
    validateStatus: function (status: number) {
        return status >= 100 && status < 600
    },
})
axiosObejct.interceptors.request.use((config: any) => {
    config.headers = Object.assign(config.headers ? config.headers : {}, {
        'app-id': 'zhongtai',
        'app-platform': 'web',
    })
    return config
})
axiosObejct.interceptors.response.use(
    (response: any) => {
        return response
    },
    (error: Error) => {
        return Promise.reject(error) // reject这个错误信息 让下流catch到 /
    }
)
function createParams(params: OptionConfig): OptionConfig {
    let requestParams = {
        api: params.apiUrl,
        params: { ...params.data },
        ...params.restData,
    }
    return requestParams
}
async function omsRequest(
    apiName: string,
    data: object = {},
    env: string,
    restData: object = {}
): Promise<object> {

    const objParams: OptionConfig = { apiUrl: apiName, data: { ...data }, restData }

    const params = createParams(objParams) 
    let result: AnyKey = {}
    try {
        let res: AnyKey = await new Promise((resolve) => {
            axiosObejct({
                method: 'POST',
                url: '',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                data: params,
            })
                .then((res: any) => {
                    const { data }: any = res
                    const { result, success, error, message, code } = data
                    if (success) {
                        resolve(result)
                    } else {
                        resolve(result)
                    }
                })
                .catch((error: Error) => {
                    resolve(result)
                })
        })
        result = res
    } catch (error) {
        result = { success: false, result: {}, code: -1001, message: '系统异常' }
    }
    if (!result.success) {

    }
    return result
}

omsRequest.NODE_API = function (
    apiName: string,
    data: object = {},
    env: string,
    restData: object = {}
): Promise<[any, any]> {
    return new Promise(async (resolve) => {
        const res: any = await omsRequest(apiName, data, env, restData)
        const { success, result, message } = res // 通用的
        if (!success) {
            resolve([res, message])
        } else {
            const { success, code, message, data } = result // code:0
            if (!success) {
                resolve([res, message])
            } else {
                resolve([null, data])
            }
        }
    })
}

export default omsRequest
