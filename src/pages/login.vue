<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>穴位考题管理系统</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="登录名"
                    type="text"
                    v-model="loginName"
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="密码"
                    id="password"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :loading="loading" @click="login">登陆</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loading: false,
      drawer: null,
      loginName: 'Admin',
      password: '123456'
    }
  },
  mounted() {
    this.$store.commit('SignOut')
  },
  methods: {
    login() {
      this.loading = true
      this.$api.login({
        username: this.loginName,
        password: this.password,
        role: 'admin',
        path: ''
      }).then(res => {
        this.loading = false
        if (res.code === 100) {
          this.$store.commit('login', res.extend.userinfo)
          this.$router.push('/')
        } else {
          console.error(res.msg)
        }
      }).catch (err => {
        this.loading = false
        console.log(err)
      })
    }
  }
};
</script>

<style>
</style>
