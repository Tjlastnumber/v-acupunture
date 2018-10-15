<template>
  <v-card>
    <v-card-title>
      <span class="headline">图片题</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm12 md12>
            <v-textarea
              v-model="form.title"
              outline
              label="题目"
              :rules="rules.noEmpty"
              required
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-subheader>题目图片</v-subheader>
        <v-layout>
          <v-spacer />
          <v-upload
            max-height="60px"
            max-width="60px"
            v-model="form.titlePicture"
            :src="form.titleSrc"
          />
          <v-spacer />
        </v-layout>
        <v-subheader>正确项</v-subheader>
        <v-layout :key="item.value" v-for="item in form.options" class="pl-5 pr-5 mb-3">
          <v-checkbox
            v-model="form.answer"
            :label="item.option"
            :value="item.value"
            :readonly="form.answer === item.value"
            hide-details
            class="shrink mr-5"
          />
          <v-spacer />
          <v-upload v-model="item.file" accept="image/png,image/gif,image/jpeg" :src="item.src" />
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.native="editText" :disabled="loading" v-show="showToggle"> 文字题 </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="close" :disabled="loading">关闭</v-btn>
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!formIsValid"
        flat
        @click.native="save"
      >保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import * as types from '../../store/moduls/single-choice/singleChoice-types'
import vUpload from "@/components/UpLoad";
import { deepFreeze } from "../../utils/util";

export default {
  components: {
    vUpload
  },
  data() {
    const defaultForm = Object.freeze({
      answer: 1,
      title: "",
      titlePicture: "",
      options: [
        {
          option: "A",
          name: "picturepatha",
          value: 1,
          src: "",
          file: null
        },
        {
          option: "B",
          name: "picturepathb",
          value: 2,
          src: "",
          file: null
        },
        {
          option: "C",
          name: "picturepathc",
          value: 3,
          src: "",
          file: null
        },
        {
          option: "D",
          name: "picturepathd",
          value: 4,
          src: "",
          file: null
        },
        {
          option: "E",
          name: "picturepathe",
          value: 5,
          src: "",
          file: null
        }
      ]
    })
    return {
      form: Object.assign({}, defaultForm),
      defaultForm,
      rules: {
        noEmpty: [val => (val || "").length > 0 || "内容必须填写"]
      },
      data: {}
    };
  },
  created() {
    this.getById();
  },
  watch: {
    $route: "getById"
  },
  computed: {
    formIsValid() {
      return (
        this.form.title &&
        this.form.options.every(o => o.file !== "") &&
        this.form.answer &&
        this.form.titlePicture !== ""
      )
    },
    showToggle() {
      return this.data.ispicture === undefined || this.data.ispicture === 0
    },
    ...mapState({
      resourcePath: state => state.resourcePath,
      show: state => state.singleChoice.editImageState,
      loading: state => state.singleChoice.loading
    })
  },
  methods: {
    editText() {
      this.$router.push({
        name: "EditText"
      });
    },
    close() {
      this.$store.commit(types.NAMESPACED + types.END_EDIT)
    },
    save() {
      let data = {
        title: this.form.title,
        ispicture: 1,
        answer: this.form.answer,
        isrelease: 0,
        files: []
      };

      if (typeof this.form.titlePicture === 'string') {
        data.files.push(new File([], 'files'))
      } else {
        data.files.push(this.form.titlePicture)
      }

      this.form.options.forEach(option => {
        if (typeof option.file === 'string') {
          data.files.push(new File([], 'files'))
        } else {
          data.files.push(option.file)
        }
      });

      if (this.data.id) {
        // 修改
        this.$store.dispatch(types.NAMESPACED + types.UPDATE_IMAGE, { id: this.data.id, data: data })
        .then(res => {
          this.$store.dispatch(types.NAMESPACED + types.RELOAD)
          this.$store.commit(types.NAMESPACED + types.END_EDIT)
        }).catch(err=>console.error(err))
      } else {
        // 添加
        this.$store
          .dispatch(types.NAMESPACED + types.ADDIMAGE, data)
          .then(res => {
            this.$store.dispatch(types.NAMESPACED + types.RELOAD)
            this.$store.commit(types.NAMESPACED + types.END_EDIT)
          })
          .catch(err => console.error(err))
      }
    },
    getById() {
      let val = (this.data = this.$store.getters[
        types.NAMESPACED + types.GET_QUESTION_BY_ID
      ](this.$route.params.id));
      this.form.id = val.id;
      this.form.title = val.title;
      this.form.answer = val.answer;
      if (val.titleimagepath)
        this.form.titlePicture = this.resourcePath + val.titleimagepath;
      let { picturepatha, picturepathb, picturepathc, picturepathd, picturepathe } = val;
      new Array( picturepatha, picturepathb, picturepathc, picturepathd, picturepathe).forEach((o, index) => {
        if (o) {
          this.form.options[index].file = this.resourcePath + o
        } else {
          this.form.options[index].file = ''
        }
      });
    }
  }
};
</script>
