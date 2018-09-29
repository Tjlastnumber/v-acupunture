<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="800px">
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
            <v-subheader>正确项</v-subheader>
            <v-layout :key="item.value" v-for="item in form.options">
              <v-checkbox
                v-model="form.answer"
                :label="item.option"
                :value="item.value"
                :readonly="form.answer === item.value"
                hide-details
                class="shrink mr-5"
              />
              <v-text-field
                v-model="item.content"
                label="内容"
                :rules="rules.noEmpty"
                required
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
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
    </v-dialog>
  </v-layout>
</template>

<script>
import {
  mapState
} from "vuex";

export default {
  data() {
    return {
      form: {
        answer: 1,
        title: "",
        options: [{
            option: "A",
            value: 1,
            content: ""
          },
          {
            option: "B",
            value: 2,
            content: ""
          },
          {
            option: "C",
            value: 3,
            content: ""
          },
          {
            option: "D",
            value: 4,
            content: ""
          },
          {
            option: "E",
            value: 5,
            content: ""
          }
        ]
      },
      rules: {
        noEmpty: [val => (val || "").length > 0 || "选项内容必须填写"]
      }
    };
  },
  computed: {
    formIsValid() {
      return (
        this.form.title && this.form.options.every(o => o.content) && this.form.answer
      )
    },
    ...mapState({
    show: state => state.singleChoice.editImageState,
    loading: state => state.singleChoice.loading
  })
  }
};
</script>
