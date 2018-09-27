<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="500px">
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
            <v-layout>
                <v-checkbox v-model="option" label="A" value="A" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="form.contentA" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
            <v-layout>
                <v-checkbox v-model="option" label="B" value="B" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="form.contentB" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
            <v-layout>
                <v-checkbox v-model="option" label="C" value="C" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="form.contentC" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
            <v-layout>
                <v-checkbox v-model="option" label="D" value="D" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="form.contentD" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
            <v-layout>
                <v-checkbox v-model="option" label="E" value="E" hide-details class="shrink mr-5"/> 
                <v-text-field v-model="form.contentE" label="内容" :rules="rules.noEmpty" required ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="close" :disabled="loading">关闭</v-btn>
          <v-spacer></v-spacer>
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
export default {
  data() {
    return {
      loading: false,
      option: 'A',
      form: {
        title: '',
        contentA: '',
        contentB: '',
        contentC: '',
        contentD: '',
        contentE: '',
      },
      rules: {
        noEmpty: [val => (val || '').length > 0 || '选项内容必须填写']
      }
    }
  },
  computed: {
    show() {
      console.log(this.$store)
      return this.$store.state.singleChoice.editState
    },
    formIsValid() {
      return (
        this.form.title &&
        this.form.contentA &&
        this.form.contentB &&
        this.form.contentC &&
        this.form.contentD &&
        this.form.contentE 
      )
    }
  },
  methods: {
    close() {
      this.$store.commit('endEdit')
    },

    save() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$store.commit('endEdit')
      }, 10000);
    }
  }
}
</script>

<style>

</style>
