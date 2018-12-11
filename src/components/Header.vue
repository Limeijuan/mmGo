<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="static/img/logo.png"></a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <span class="navbar-link"></span>
          <div v-if="!nickName">
            <a href="javascript:void(0)" class="navbar-link" @click="loginModelFlag =true">Login</a>
            <a href="javascript:void(0)" class="navbar-link">Register</a>
          </div>
          <div v-if="nickName">
            <span v-text="nickName"></span>
            <a href="javascript:void(0)" class="navbar-link" @click="loginOut" >Login Out</a>
          </div>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count"></span>
            <a class="navbar-link navbar-cart-link" href="/#/cart">
              <svg class="navbar-cart-logo">
                <use xlink:href="../../static/svg.svg#icon-cart"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show': loginModelFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="loginModelFlag = false; errorTip = false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname" @keyup.enter="login">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2"  name="password" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" v-model="userPwd" @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="mybtn btn-login" @click="login">登  录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="loginModelFlag" @click="loginModelFlag = false; errorTip = false"></div>
  </header>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      userName: '',
      userPwd: '',
      errorTip: false,
      loginModelFlag: false,
      nickName: ''
    }
  },
  inject: ['reload'],
  methods: {
    login () {
      if (!this.userName || !this.userPwd) {
        this.errorTip = true
      }
      axios.post('/users/login', {
        userName: this.userName,
        userPwd: this.userPwd
      }).then((res) => {
        if (res.data.status === '0') {
          this.errorTip = false
          this.loginModelFlag = false
          this.nickName = res.data.result.userName
          this.reload()
        } else {
          this.errorTip = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    loginOut () {
      axios.post('/users/loginOut').then((res) => {
        if (res.data.status === '0') {
          this.nickName = ''
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
