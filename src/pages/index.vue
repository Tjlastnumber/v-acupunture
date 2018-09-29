<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-toolbar color="white">
        <img src="@/assets/m.jpg" height="48" alt="天堰">
      </v-toolbar>

        <v-list>
          <v-list-tile
            :value="navActive(item.path)"
            v-for="(item, i) in items"
            :key="i"
            @click="item.click(item.path)"
            ripple
          >
            <v-list-tile-action>
              <v-icon> {{ item.icon }} </v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title >{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
    </v-navigation-drawer>

    <v-toolbar app :clipped-left="clipped">
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>web</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn> -->
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>account_circle</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile
            v-for="(item, i) in userMenu"
            :key="i"
            @click="item.click"
            ripple
          >

            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <!-- <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->

    <!-- 提示弹出框 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" top>
      {{ snackbar.message }}
      <v-btn dark flat @click="snackbar.show = false">
        关闭
      </v-btn>
    </v-snackbar>
  </v-app>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "App",
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: "bubble_chart",
        path: '/singleChoice',
        title: "单选题管理",
        click: this.navClick
      }, {
        icon: 'local_dining',
        title: 'test',
        path: '/',
        click: this.navClick
      }],
      userMenu: [{
        icon: 'keyboard_return',
        title: '退出',
        path: '/',
        click: () => {
          this.$router.replace('/login')
        }
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "穴位考题后台管理系统"
    }
  },
  computed: mapState({
    snackbar: state => state.snackbar
  }),
  mounted() {
    this.$store.commit('successNotifation', '欢迎')
  },
  methods: {
    navClick(e) {
      this.$router.push(e)
    },
    navActive(path) {
      return this.$route.path === path
    }
  }
}
</script>
