<template>
  <!-- <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="800px">
      
    </v-dialog>

    <edit-image />
  </v-layout> -->
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
        <v-btn flat @click.native="editImage" :disabled="loading" v-show="data.ispicture !== 0">图片题</v-btn>
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
import { mapState,map } from 'vuex'
import * as types from '../../store/moduls/singleChoice-types'
import editImage from './editImage'


export default {
  components: {
    editImage
  },

  data() {
    return {
      form: {
        answer: 1,
        title: '',
        options: [{
          name: 'optiona',
          option: 'A',
          value: 1,
          content: '',
        }, {
          name: 'optionb',
          option: 'B',
          value: 2,
          content: ''
        }, {
          name: 'optionc',
          option: 'C',
          value: 3, 
          content: ''
        }, {
          name: 'optiond',
          option: 'D',
          value: 4,
          content: ''
        }, {
          name: 'optione',
          option: 'E',
          value: 5,
          content: ''
        }]
      },
      rules: {
        noEmpty: [val => (val || '').length > 0 || '选项内容必须填写']
      },
      data: {}
    }
  },

  beforeRouteUpdate (to, from, next) {
      let val = this.data = this.$store.getters[types.NAMESPACED + types.GET_QUESTION_BY_ID](to.params.id)
      this.form.id = val.id
      this.form.title = val.title
      this.form.answer = val.answer
      let {optiona, optionb, optionc, optiond, optione} = val
      new Array(optiona, optionb, optionc, optiond, optione).forEach((o, index) => {
        this.form.options[index].content = o
      })
      next()
  },

  watch: {
  },

  computed: {
    formIsValid() {
      return (
        this.form.title && this.form.options.every(o => o.content) && this.form.answer
      )
    },
    ...mapState({
      show: state => state.singleChoice.editState,
      loading: state => state.singleChoice.loading,
    })
  },

  methods: {
    close() {
      this.$store.commit(types.NAMESPACED + types.END_EDIT)
    },

    save() {
      let newData = {
          id: this.data.id,
          ispicture: this.data.ispicture,
          isrelease: this.data.isrelease,
          title: this.form.title,
          answer: this.form.answer,
      }

      this.form.options.forEach(option => {
        newData[option.name] = option.content
      })

      if (this.data.id) {
        this.$store.dispatch(types.NAMESPACED + types.UPDATE, newData)
        .then(() => {
          this.$store.commit(types.NAMESPACED + types.END_EDIT)
        }).catch(err => {
          this.$store.commit('errorNotifation', 'update: ' + err.msg)
        })
      } else {
        this.$store.dispatch(types.NAMESPACED + types.ADD, newData)
        .then(() => {
          this.$store.dispatch(types.NAMESPACED + types.RELOAD)
          this.$store.commit(types.NAMESPACED + types.END_EDIT)
        }).catch(err => {
          this.$store.commit('errorNotifation', 'add: ' + err.msg)
        })
      }
    },

    editImage() {
      this.$router.push({ name: 'EditImageQuestion' })
    }
  }
}
</script>

<style>
</style>
