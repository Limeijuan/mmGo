<template>
<div>
  <common-header></common-header>
  <nav-bread>
    <span>goods</span>
  </nav-bread>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd ><a href="javascript:void(0)">All</a></dd>
            <dd v-for='(price, index) in priceFilter'
                :key='index'
                @click='handleClickChecked'
                :class="{cur: priceChecked}">
              <a href="javascript:void(0)">
                {{price.startPrice}} - {{price.endPrice}}
              </a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for='item in goodsList' :key='item.commodityId'>
                <div class="pic">
                  <a href="#"><img :src="'static/img/'+item.commodityImg" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.commodityName}}</div>
                  <div class="price">{{item.commodityPrice}}</div>
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
      priceChecked: false
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
      axios.get('/api').then((result) => {
        this.goodsList = result.data.result
      })
    },
    handleClickChecked (event) {
      console.log(event)
    }
  }
}
</script>
