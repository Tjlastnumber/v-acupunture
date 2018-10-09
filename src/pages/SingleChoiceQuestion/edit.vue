<template>
    <v-card>
      <v-card-title>
        <span class="headline">单选题</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-textarea name="title" v-model="form.title" outline label="题目" :rules="rules.noEmpty" required></v-textarea>
            </v-flex>
          </v-layout>
          <v-subheader>正确项</v-subheader>
          <v-layout :key="item.value" v-for="item in form.options">
              <v-checkbox n v-model="form.answer" :label="item.option" :value="item.value" :readonly="form.answer === item.value" hide-details class="shrink mr-5"/> 
              <v-text-field v-model="item.content" label="内容" :rules="rules.noEmpty" required ></v-text-field>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click.native="editImage" :disabled="loading" v-show="showToggle">图片题</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="close" :disabled="loading">关闭</v-btn>
        <v-btn
          color="primary"
          :disabled="!formIsValid"
          :loading="loading"
          flat
          @click.native="save"
        >保存</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import { mapState, map } from "vuex"
import * as types from "@/store/moduls/single-choice/singleChoice-types"
import editImage from "./EditImage"

export default {
  components: {
    editImage
  },

  data() {
    return {
      form: {
        answer: 1,
        title: "",
        options: [
          {
            name: "optiona",
            option: "A",
            value: 1,
            content: ""
          },
          {
            name: "optionb",
            option: "B",
            value: 2,
            content: ""
          },
          {
            name: "optionc",
            option: "C",
            value: 3,
            content: ""
          },
          {
            name: "optiond",
            option: "D",
            value: 4,
            content: ""
          },
          {
            name: "optione",
            option: "E",
            value: 5,
            content: ""
          }
        ]
      },
      rules: {
        noEmpty: [val => (val || "").length > 0 || "内容必须填写"]
      },
      data: {}
    };
  },

  /**
   * 首次导航到组件时会触发
   */
  created() {
    console.log("第一次导航到组件");
    this.getById();
  },

  /**
   * 在页面内容修改后离开页面时处理
   */
  beforeRouteLeave(to, from, next) {
    next()
  },

  /**
   *
   * 导航守卫只有在路由改变但是组件被服用时触发
   * watch $route 和 beforeRouteUpdate 触发条件相同
   * https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB
   *
   */
  watch: {
    $route: "getById"
  },

  computed: {
    formIsValid() {
      return (
        this.form.title &&
        this.form.options.every(o => o.content) &&
        this.form.answer
      );
    },
    showToggle() {
      return this.data.ispicture === undefined || this.data.ispicture !== 0
    },
    ...mapState({
      show: state => state.singleChoice.editState,
      loading: state => state.singleChoice.loading
    })
  },

  methods: {
    close() {
      this.$store.commit(types.NAMESPACED + types.END_EDIT);
    },

    save() {
      let newData = {
        id: this.data.id,
        ispicture: this.data.ispicture,
        isrelease: this.data.isrelease,
        title: this.form.title,
        answer: this.form.answer
      };

      this.form.options.forEach(option => {
        newData[option.name] = option.content;
      });

      if (this.data.id) {
        this.$store
          .dispatch(types.NAMESPACED + types.UPDATE, newData)
          .then(() => {
            this.$store.commit(types.NAMESPACED + types.END_EDIT);
          })
          .catch(err => {
            this.$store.commit("errorNotifation", "update: " + err.msg);
          });
      } else {
        this.$store
          .dispatch(types.NAMESPACED + types.ADD, newData)
          .then(() => {
            this.$store.dispatch(types.NAMESPACED + types.RELOAD);
            this.$store.commit(types.NAMESPACED + types.END_EDIT);
          })
          .catch(err => {
            this.$store.commit("errorNotifation", "add: " + err.msg);
          });
      }
    },

    editImage() {
      this.$router.push({ name: "EditImageQuestion" });
    },

    getById() {
      let val = (this.data = this.$store.getters[types.NAMESPACED + types.GET_QUESTION_BY_ID](this.$route.params.id));
      this.form.id = val.id
      this.form.title = val.title
      this.form.answer = val.answer
      let { optiona, optionb, optionc, optiond, optione } = val
      new Array(optiona, optionb, optionc, optiond, optione).forEach(
        (o, index) => {
          this.form.options[index].content = o;
        }
      )
    }
  }
}
</script>

<style>
</style>
