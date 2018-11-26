<template>
  <div>
    <common-header></common-header>
    <nav-bread>
      <span>goods</span> /
      <span>goods2</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up': !sortFlag}">
              <use xlink:href="static/svg.svg#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showPriceFilter">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class='{"filterby-show": filterBy}'>
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd >
                <a href="javascript:void(0)"
                @click='setPriceFilter("all")'
                :class="{'cur': priceChecked=='all'}">All</a>
              </dd>
              <dd v-for='(price, index) in priceFilter'
                  :key='index'>
                <a href="javascript:void(0)"
                @click='setPriceFilter(index)'
                :class="{'cur': priceChecked==index}">
                  {{price.startPrice}} - {{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul class="clearfix">
                <li v-for='item in goodsList' :key='item.productId'>
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/img/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" style="text-align: center">
                <img src="static/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-footer></common-footer>

    <!-- 模态弹框-是否登陆 -->
    <modal :mdShow="mdShow" @close="modalClose">
      <p slot="message" style="font-size:20px;color:red;"> 请先登录，否则无法加入到购物车！ </p>
      <div slot="btnGroup">
        <a href="javascript:void(0);" class="mybtn btn-login" @click="mdShow=false">关闭</a>
      </div>
    </modal>

    <!-- 模态弹框-加入购物车成功后 -->
    <modal :mdShow="mdShowCart" @close="modalClose">
      <p slot="message" style="font-size:20px;color:red;">
        <svg class="icon icon-status-ok">
          <use xlink:href="../../static/svg.svg#icon-status-ok"></use>
        </svg>
        加入购物车成功！
      </p>
      <div slot="btnGroup">
        <a href="javascript:void(0);" class="mybtn btn-blue" @click="mdShowCart=false">继续购物</a>
        <router-link href="javascript:void(0);" class="mybtn btn-success" to="/cart">查看购物车</router-link>
      </div>
    </modal>

  </div>
</template>
<script>
import CommonHeader from '@/components/Header'
import CommonFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import Modal from '@/components/Modal'
import axios from 'axios'
export default{
  name: 'GoodsList',
  data () {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false,
      priceFilter: [
        {
          startPrice: '0',
          endPrice: '500'
        },
        {
          startPrice: '500',
          endPrice: '1000'
        },
        {
          startPrice: '1000',
          endPrice: '1500'
        },
        {
          startPrice: '1500',
          endPrice: '2000'
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overlayFlag: false
    }
  },
  components: {
    CommonHeader,
    NavBread,
    CommonFooter,
    Modal
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList (scrollFalg) {
      this.loading = true
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      axios.get('/goods', {params: param}).then((res) => {
        var data = res.data
        if (data.status === '0') {
          if (scrollFalg) {
            this.loading = false
            this.goodsList = this.goodsList.concat(data.result.list)
            if (data.result.count < this.pageSize) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = data.result.list
            this.busy = false
          }
        } else {
          this.goodsList = []
        }
      })
    },
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    showPriceFilter () {
      this.filterBy = true
      this.overlayFlag = true
    },
    handleClickOverlay () {
      this.filterBy = false
      this.overlayFlag = false
    },
    setPriceFilter (index) {
      this.priceChecked = index
      this.filterBy = false
      this.overlayFlag = false
      this.page = 1
      this.getGoodsList()
    },
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    addCart (productId) {
      axios.post('/users/addCart', {
        productId: productId
      }).then((res) => {
        if (res.data.status === '0') {
          this.mdShowCart = true
        } else {
          this.mdShow = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    modalClose () {
      this.mdShow = false
      this.mdShowCart = false
    }
  }
}
</script>
<style scope>
  .icon-arrow-short {
    transition: all .3s ease-out;
  }
  .sort-up {
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
</style>
