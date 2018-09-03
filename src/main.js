// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/checkout.css'
import '@/assets/css/login.css'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: '/static/img/loading-svg/loading-bars.svg'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
