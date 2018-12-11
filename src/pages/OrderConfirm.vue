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
              <li>
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img >
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">item.productName</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">salePrice</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×productNum</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">item.salePrice*item.productNum</div>
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
                <span>subTotal</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>shipping</span>
              </li>
              <li>
                <span>Discount:</span>
                <span>discount</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>tax</span>
              </li>
              <li class="order-total-price">
                <span>Order total:</span>
                <span>orderTotal</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">Previous</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red">Proceed to payment</button>
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
import Modal from '@/components/Modal'
import axios from 'axios'
export default {
  // name: 'OrderConfirm',
  data () {
    return {

    }
  },
  components: {
    CommonHeader,
    CommonFooter,
    NavBread,
    Modal
  }
}
</script>
