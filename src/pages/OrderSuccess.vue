<template>
  <div>
    <common-header></common-header>
    <nav-bread>
      <span>Order Success</span>
    </nav-bread>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/img/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal | currency}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <a href="javascript:;" class="btn btn--m">Cart List</a>
            </div>
            <div class="btn-r-wrap">
              <a href="javascript:;" class="btn btn--m">Goods List</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>
<script>
import CommonHeader from '@/components/Header'
import CommonFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import axios from 'axios'
export default {
  name: 'OrderSuccess',
  data () {
    return {
      orderId: '',
      orderTotal: 0
    }
  },
  components: {
    CommonHeader,
    CommonFooter,
    NavBread
  },
  mounted () {
    var orderId = this.$route.query.orderId
    if (!orderId) {
      return
    }
    axios.get('/users/orderDefault', {
      params: {orderId: orderId}
    }).then((res) => {
      let data = res.data
      if (data.status === '0') {
        this.orderId = res.data.result.orderId
        this.orderTotal = res.data.result.orderTotal
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>
