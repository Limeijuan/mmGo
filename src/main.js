// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Global from '@/components/Global'
import {currency} from '@/util/currency'
import '@/assets/css/base.css'
import '@/assets/css/login.css'
import './assets/css/product.css'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: '/static/loading-svg/loading-bars.svg'
})
Vue.use(infiniteScroll)
// 全局过滤器
Vue.filter('currency', currency)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.prototype.GLOBAL = Global
