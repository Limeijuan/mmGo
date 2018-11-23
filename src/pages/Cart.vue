<template>
  <div>
    <common-header></common-header>
    <nav-bread>
      <span>goods</span> /
      <span>goods2</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartLists" :key="item._id">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" >
                      <svg class="icon icon-ok">
                        <use xlink:href="static/svg.svg#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="'static/img/'+item.productImage" :alt="item.productName">
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
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minus',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice*item.productNum}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="deletePro(item.productId)">
                      <svg class="icon icon-del">
                        <use xlink:href="static/svg.svg#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;">
                  <span class="checkbox-btn item-check-btn">
                      <a class="icon icon-ok"><use xlink:href="static/svg.svg#icon-ok"></use></a>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">hjk</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-footer></common-footer>

    <!-- 模态弹框 -->
    <Modal :mdShow="isDel" @close="handleClose">
      <p slot="message" style="font-size: 18px;line-height: 70px;">你确认要删除此商品吗?</p>
      <div slot="btnGroup">
        <a href="javascript:void(0)" class="mybtn btn-danger" @click="delConfirm">确认</a>
        <a href="javascript:void(0)" class="mybtn btn-blue" @click="isDel = false">取消</a>
      </div>
    </Modal>
  </div>
</template>
<script>
import '@/assets/css/checkout.css'
import CommonHeader from '@/components/Header'
import CommonFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import Modal from '@/components/Modal'
import axios from 'axios'
export default{
  name: 'CartList',
  data () {
    return {
      cartLists: [],
      isDel: false,
      productId: ''
    }
  },
  components: {
    CommonHeader,
    NavBread,
    CommonFooter,
    Modal
  },
  mounted () {
    this.getCartList()
  },
  methods: {
    getCartList () {
      axios.post('/users/cartList')
        .then((res) => {
          let data = res.data
          if (data) {
            this.cartLists = data.result
          }
        })
    },
    // 删除商品
    deletePro (productId) {
      this.productId = productId
      this.isDel = true
    },
    handleClose () {
      this.isDel = false
    },
    delConfirm () {
      axios.post('users/removePro', {productId: this.productId})
        .then((res) => {
          if (res.data.status === '0') {
            this.isDel = false
            this.getCartList()
          }
        })
    },
    editCart (flag,item) {
      if (flag === 'add') {
        item.productNum++
      }else {
        if (item.productNum <=1) {
          return;
        }
        item.productNum--
      }
    }
  }
}
</script>
<style scope>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
