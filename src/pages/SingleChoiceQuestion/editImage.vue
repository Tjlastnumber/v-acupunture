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
          <v-upload v-model="item.file" :src="item.src" />
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.native="editText" :disabled="loading"> 文字题 </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="close" :disabled="loading">关闭</v-btn>
      <v-btn
        color="primary"
        :loading="loading"
        flat
        @click.native="save"
      >保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  mapState
} from "vuex";
import * as types from '../../store/moduls/singleChoice-types'
import vUpload from '@/components/UpLoad'

export default {
  components: {
    vUpload
  },
  data() {
    return {
      form: {
        answer: 1,
        title: "",
        titleSrc: '',
        titlePicture: {},
        options: [{
            option: "A",
            name: 'picturepatha',
            value: 1,
            src: '',
            file: {}
          },
          {
            option: "B",
            name: 'picturepathb',
            value: 2,
            src: '',
            file: {}
          },
          {
            option: "C",
            name: 'picturepathc',
            value: 3,
            src: '',
            file: {}
          },
          {
            option: "D",
            name: 'picturepathd',
            value: 4,
            src: '',
            file: {}
          },
          {
            option: "E",
            name: 'picturepathe',
            value: 5,
            src: '',
            file: {}
          }
        ]
      },
      rules: {
        noEmpty: [val => (val || "").length > 0 || "选项内容必须填写"]
      },
      data: {}
    }
  },
  computed: {
    formIsValid() {
      return (
        this.form.title &&
        this.form.options.every(o => o.content) &&
        this.form.answer
      );
    },
    ...mapState({
      show: state => state.singleChoice.editImageState,
      loading: state => state.singleChoice.loading
    })
  },
  created() {
    this.getById()
  },
  watch: {
    '$route': 'getById'
  },
  methods: {
    editText() {
      this.$router.push({
        name: 'EditText'
      })
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
        titleimagepath: this.form.titlePicture
      }

      this.form.options.forEach(option => {
        data[option.name] = option.file
      })

      this.$store.dispatch(types.NAMESPACED + types.ADDIMAGE, data)
        .then(res => {
          console.log(res)
        }).catch(err => console.error(err))
    },
    getById() {
      let val = this.data = this.$store.getters[types.NAMESPACED + types.GET_QUESTION_BY_ID](to.params.id)
      this.form.id = val.id
      this.form.title = val.title
      this.form.answer = val.answer
      let {optiona, optionb, optionc, optiond, optione} = val
      new Array(optiona, optionb, optionc, optiond, optione).forEach((o, index) => {
      })
    }
  },
};
</script>
