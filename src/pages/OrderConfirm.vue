<template>
  <div>
    <common-header></common-header>
    <nav-bread>
      <span>Order Confirm</span>
    </nav-bread>
    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li><span>Make</span> payment</li>
            <li><span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>Order content</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in purchaseList" :key="item._id">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-lazy="'static/img/' + item.productImage" alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">x {{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.salePrice*item.productNum) | currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>Item subtotal:</span>
                <span>{{subTotal | currency}}</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>{{shipping | currency}}</span>
              </li>
              <li>
                <span>Discount:</span>
                <span>{{discount | currency}}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>{{tax | currency}}</span>
              </li>
              <li class="order-total-price">
                <span>Order total:</span>
                <span>{{orderTotal | currency}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">Previous</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="payment">Proceed to payment</button>
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
  name: 'OrderConfirm',
  data () {
    return {
      purchaseList: [],
      shipping: 15,
      discount: 30,
      tax: 50
    }
  },
  components: {
    CommonHeader,
    CommonFooter,
    NavBread
  },
  mounted () {
    this.getPurchaseList()
  },
  computed: {
    subTotal () {
      let a = 0
      this.purchaseList.forEach((item) => {
        a += (item.salePrice * item.productNum)
      })
      return a
    },
    orderTotal () {
      return this.subTotal + this.shipping - this.discount + this.tax
    }
  },
  methods: {
    getPurchaseList () {
      axios.post('/users/cartList').then((res) => {
        if (res && res.data) {
          if (res.data.result.length) {
            res.data.result.forEach((item) => {
              if (item.checked === '1') {
                this.purchaseList.push(item)
              }
            })
          }
        }
      }).catch((err) => {
        alert(err)
      })
    },
    payment () {
      let addressId = this.$route.query.addressId
      let params = {
        addressId: addressId,
        priceDetails: {
          shipping: this.shipping,
          discount: this.discount,
          tax: this.tax,
          subTotal: this.subtotal,
          orderTotal: this.orderTotal
        }
      }
      axios.post('/users/payMent', params).then((res) => {
        if (res && res.data) {
          if (res.data.result) {
            this.$router.push({
              path: '/orderSuccess?orderId=' + res.data.result.orderId
            })
          }
        } else {
          alert('errer')
        }
      }).catch((err) => {
        alert(err)
      })
    }
  }
}
</script>
