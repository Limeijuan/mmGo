import Vue from 'vue'
import Router from 'vue-router'
// import GoodsList from '@/pages/GoodsList'
import CartList from '@/pages/Cart'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: (resolve) => {
        require(['@/pages/GoodsList'], resolve)
      }
    },
    {
      path: '/cart',
      name: 'CartList',
      // 需要登录才能进入的页面可以增加一个meta属性
      // meta: {
      //   requireAuth: true
      // },
      component: CartList
    },
    {
      path: '/address',
      name: 'Address',
      component: (resolve) => {
        require(['@/pages/Address'], resolve)
      }
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: (resolve) => {
        require(['@/pages/OrderConfirm'], resolve)
      }
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: (resolve) => {
        require(['@/pages/OrderSuccess'], resolve)
      }
    }
  ]
})
//  判断是否需要登录权限 以及是否登录
// router.beforeEach((to, from, next) => {
//   console.log(to.matched)
//   if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
//     if (document.cookie) { // 判断是否登录
//       next()
//     } else { // 没登录则跳转到登录界面
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }
//   } else {
//     next()
//   }
// })

export default router
