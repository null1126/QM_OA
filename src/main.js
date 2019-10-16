import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入第三方字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/globla.css'
import axios from 'axios'
axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
