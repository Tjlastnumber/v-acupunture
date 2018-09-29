<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">单选题</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-textarea v-model="form.title" outline label="题目" :rules="rules.noEmpty" required></v-textarea>
              </v-flex>
            </v-layout>
            <v-subheader>正确项</v-subheader>
            <v-layout :key="item.value" v-for="item in form.options">
                <v-checkbox v-model="form.answer" :label="item.option" :value="item.value" :readonly="form.answer === item.value" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="item.content" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="close" :disabled="loading">关闭</v-btn>
          <v-btn
            color="primary"
            :disabl="!formIsValid"
            :loading="loading"
            flat
            @click.native="save"
          >保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import * as types from '../../store/moduls/singleChoice-types'

export default {
  props: {
    data: {}
  },

  data() {
    return {
      loading: false,
      form: {
        answer: 1,
        title: '',
        options: [{
          option: 'A',
          value: 1,
          content: '',
        }, {
          option: 'B',
          value: 2,
          content: ''
        }, {
          option: 'C',
          value: 3, 
          content: ''
        }, {
          option: 'D',
          value: 4,
          content: ''
        }, {
          option: 'E',
          value: 5,
          content: ''
        }]
      },
      rules: {
        noEmpty: [val => (val || '').length > 0 || '选项内容必须填写']
      }
    }
  },

  watch: {
    data (val) {
      this.form.title = val.title
      this.form.answer = val.answer
      let {optiona, optionb, optionc, optiond, optione} = val
      let options = [optiona, optionb, optionc, optiond, optione]
      options.forEach((o,index) => {
        this.form.options[index].content = options[index]
      });
    }
  },

  computed: {
    // show() {
    //   return this.$store.state.singleChoice.editState
    // },
    formIsValid() {
      return (
        this.form.title && this.form.options.every(o => o.content)
      )
    },
    ...mapState({
      show: state => state.singleChoice.editState 
    })
  },
  methods: {
    close() {
      this.$store.commit(types.NAMESPACED + types.END_EDIT)
    },

    save() {
      this.loading = true
      this.$store.dispatch(types.NAMESPACED + types.UPDATE, {
        id: this.data.id,
        ispicture: this.data.ispicture,
        isrelease: this.data.isrelease,
        title: this.form.title,
        answer: this.form.answer,
        optiona: this.form.options[0].content,
        optionb: this.form.options[1].content,
        optionc: this.form.options[2].content,
        optiond: this.form.options[3].content,
        optione: this.form.options[4].content,
      })
      .then(res => {
        this.loading = false
        this.$store.commit(types.NAMESPACED + types.END_EDIT)
      }).catch(err => {
        this.loading = false
      })
    },
  }
}
</script>

<style>

</style>
