import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import './plugins/element.js'

// 导入字体图表
import './assets/fornts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
//  导入 axios
import axios from 'axios'
//  配置请求的根路径
// axios.defaults.baseURL = 'http://120.78.73.173:8080'
axios.defaults.baseURL = 'http://localhost:8080'
//  预处理api请求，必须带token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //  在最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
