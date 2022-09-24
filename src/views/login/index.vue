<template>
  <div class="login-container">
    <!-- el-form组件：elementUI插件里面的一个组件，经常展示表单元素 model：用于收集表单数据  rules：表单验证规则 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">帐户登录</h3>
      </div>
      <!-- 用户名 -->
      <!--         :rules="[{ required: true, message: '用户名不能为空' }]" -->
      <el-form-item prop="username">
        <span class="svg-container">
          <!-- 图标 -->
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item
        prop="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
      >
        <span class="svg-container">
          <!-- 图标 -->
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        @click.native.prevent="handleLogin"
        >登&nbsp;&nbsp;&nbsp;录</el-button
      >
      <el-button @click="resetForm('loginForm')">重置</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    // 进行表单验证，验证用户名与密码操作
    // 进行表单验证，验证用户名与密码操作
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('密码不能少于6位'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录业务：发请求，带用户名与密码给服务器（成功或失败）
    handleLogin() {
      // 这里在验证表单元素（用户名与密码）是否符合规则,返回值是布尔值
      this.$refs.loginForm.validate((valid) => {
        // 如果符合验证规则
        if (valid) {
          // 按钮会有一个loading效果
          this.loading = true
          // 派发action：user/login    带着用户名与密码载荷  仓库采用了命名空间
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              // 登录成功进行路由跳转
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push('/')
              localStorage.setItem('username', this.loginForm.username)
              // loading效果结束
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    background: transparent;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    // color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #353434;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  // 设置背景图，路径前加~  尺寸100%
  background: url(~@/assets/1.png);
  background-size: 100% auto;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    // color: $dark_gray; // 修改图标的颜色
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
