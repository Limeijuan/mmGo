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
        <a href="javascript:void(0)" class="price">
          Price
          <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short"></use>
          </svg>
        </a>
        <a href="javascript:void(0)" class="filterby stopPop" @click='showPriceFilter'>Filter by</a>
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
            <ul>
              <li v-for='item in goodsList' :key='item.productId'>
                <div class="pic">
                  <a href="#"><img v-lazy="'static/img/'+item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class='md-overlay' v-show='overlayFlag' @click='handleClickOverlay'></div>
  <common-footer></common-footer>
</div>
</template>
<script>
import CommonHeader from '@/components/Header'
import CommonFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import axios from 'axios'
export default{
  name: 'GoodsList',
  data () {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '1500.00'
        },
        {
          startPrice: '1500.00',
          endPrice: '2000.00'
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
    CommonFooter
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      axios.get('/goods').then((res) => {
        var data = res.data
        if (data.status === '0') {
          this.goodsList = data.result.list
        } else {
          this.goodsList = []
        }
      })
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
    }
  }
}
</script>
