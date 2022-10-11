import axios from 'axios'
import router from '@/router'

// 创建axios 实例
const service = axios.create({
  timeout: 50000,
  loading: true
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.data = {
        unused: 0
      } // 这个是关键点，加入这行就可以解决get请求添加不上Content-Type
    }
    config.headers['Content-type'] = 'application/json;charset=UTF-8'
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use((response) => {
  console.log(response)
  if (response.data.code === '0000') {
    return Promise.resolve(response)
  } else {
    if (response.data.code === '0001') {
      console.log('您还没有登陆噢~')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      return Promise.resolve(response)
    }
  }
})

export default service
