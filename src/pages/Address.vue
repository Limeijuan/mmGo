<template>
  <div>
    <common-header></common-header>
    <nav-bread>
      <span>goods</span> /
      <span>goods2</span>
    </nav-bread>
    <div class="container">
      <div class="checkout-addr">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li><span>View your</span> order</li>
            <li><span>Make</span> payment</li>
            <li><span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- address list -->
        <div class="page-title-normal checkout-title">
          <h2><span>Shipping address</span></h2>
        </div>
        <div class="addr-list-wrap">
          <div class="addr-list">
            <ul>
              <li v-for="(item, index) in dataListFilter" :key="item.addressId" :class="{'check': checkedIndex == index}" @click="checkedIndex = index;selectAddressId = item.addressId">
                <dl>
                  <dt>{{item.userName}}</dt>
                  <dd class="address">{{item.streetName}}</dd>
                  <dd class="tel">{{item.tel}}</dd>
                </dl>
                <div class="addr-opration addr-del">
                  <a href="javascript:;" class="addr-del-btn" @click="removeAddressModal(item.addressId)">
                    <svg class="icon icon-del"><use xlink:href="/static/svg.svg#icon-del"></use></svg>
                  </a>
                </div>
                <div class="addr-opration addr-set-default" >
                  <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>Set default</i></a>
                </div>
                <div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
              </li>
              <li class="addr-new">
                <div class="add-new-inner">
                  <i class="icon-add">
                    <svg class="icon icon-add"><use xlink:href="/static/svg.svg#icon-add"></use></svg>
                  </i>
                  <p>Add new address</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="shipping-addr-more">
            <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expand" :class="{'open': this.limit > 3}">
              more
              <i class="i-up-down">
                <i class="i-up-down-l"></i>
                <i class="i-up-down-r"></i>
              </i>
            </a>
          </div>
        </div>

        <!-- shipping method-->
        <div class="page-title-normal checkout-title">
          <h2><span>Shipping method</span></h2>
        </div>
        <div class="shipping-method-wrap">
          <div class="shipping-method">
            <ul>
              <li class="check">
                <div class="name">Standard shipping</div>
                <div class="price">Free</div>
                <div class="shipping-tips">
                  <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="next-btn-wrap">
          <router-link class="btn btn--m btn--red" :to="{ path: 'orderConfirm', query: {addressId: selectAddressId }}">Next</router-link>
        </div>
      </div>
    </div>
    <common-footer></common-footer>
    <Modal :mdShow="isDel" @close="toCloseModal">
      <p slot="message">
        您确定要删除此地址？
      </p>
      <div slot="btnGroup">
        <a href="javascript:void(0)" class="mybtn btn-danger" @click="isSureDel">确定</a>
        <a href="javascript:void(0)" class="mybtn btn-blue" @click="isDel=false">取消</a>
      </div>
    </Modal>
  </div>
</template>
<script>
import CommonHeader from '@/components/Header'
import CommonFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import Modal from '@/components/Modal'
import axios from 'axios'
export default{
  name: 'Address',
  data () {
    return {
      limit: 3,
      dataList: [],
      checkedIndex: 0,
      isDel: false,
      addressId: '',
      selectAddressId: ''
    }
  },
  computed: {
    dataListFilter () {
      return this.dataList.slice(0, this.limit)
    }
  },
  components: {
    CommonHeader,
    CommonFooter,
    NavBread,
    Modal
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      axios.get('/users/addressList').then((res) => {
        if (res && res.data) {
          this.dataList = res.data.result
          this.dataList.forEach((item, i) => {
            if (item.isDefault) {
              this.checkedIndex = i
              this.selectAddressId = item.addressId
            }
          })
        }
      })
    },
    expand () {
      if (this.limit === 3) {
        this.limit = this.dataList.length
      } else {
        this.limit = 3
      }
    },
    setDefault (addressId) {
      axios.post('/users/setDefault', {addressId: addressId}).then((res) => {
        this.init()
      }).catch((err) => {
        alert(err)
      })
    },
    removeAddressModal (addressId) {
      this.addressId = addressId
      this.isDel = true
    },
    toCloseModal () {
      this.isDel = false
    },
    isSureDel () {
      axios.post('/users/delAddress', {addressId: this.addressId}).then((res) => {
        this.isDel = false
        this.init()
      }).catch((err) => {
        alert(err)
      })
    }
  }
}
</script>
<style scope></style>
