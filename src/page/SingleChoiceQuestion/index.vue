<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h3>单选题列表</h3>
        </v-flex>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="题目"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-flex xs2>
                <v-select
                  :items="['全部', '已发布', '未发布']"
                  v-model="state"
                  menu-props="auto"
                  hide-details
                  label="发布状态"
                  single-line
                ></v-select>
              </v-flex>
              <v-btn ripple class="primary" round>
                <v-icon>add</v-icon> 添加题目
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="questions.headers"
                :search="search"
                :items="questions.items"
                :rows-per-page-items="[5,10,25,50,{text:'All','value':-1}]"
                :pagination.sync="pagination"
                :total-items="total"
                :loading="loading"
                item-key="name"
                no-data-text="无"
                rows-per-page-text="每页显示数量："
                v-model="questions.selected"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.title }}</td>
                  <td>
                    <v-checkbox readonly hide-details v-model="props.item.ispicture" />
                  </td>
                  <td>{{ options[props.item.answer - 1] }}</td>
                  <td>{{ props.item.createdate }}</td>
                  <td>
                    <v-switch hide-details v-model="props.item.isrelease" @change="setRelease(props.item)" />
                  </td>
                  <td class="text-xs-center">
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="primary"
                      small
                      @click.native="edit"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="pink"
                      small
                      @click.native="deleteItem"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
              <div class="text-xs-center pb-3">
                <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  data() {
    return {
      search: "",
      state: '全部',
      options: ['A', 'B', 'C', 'D', 'E'],
      questions: {
        headers: [{
            text: '题目',
            align: 'left',
            value: 'title'
          },
          {
            text: '图片题 (是/否)',
            value: 'ispicture'
          },
          {
            text: '正确选项',
            value: 'answer'
          },
          {
            text: '操作时间',
            value: 'createdate'
          }, {
            text: '发布',
            value: 'isrelease'
          }, {
            text: '操作',
            align: 'center',
            sortable: false,
            value: ''
          }
        ],
        items: [] 
      },
      pagination: {},
      total: 0,
      loading: true
    }
  },

  mounted ()  {
    this.loading = true
    this.$axios({
      url: 'https://easy-mock.com/mock/5bab3f8c070cd35e02f8b898/example/api/singleChoiceDisplay',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({
        qn: 1,
        qnsize: 2
      })
    }).then(res => {
      try {
        const data = res.data
        this.questions.items = data.extend.singlechoice.lists
        this.loading = false
      } catch (err) {
        console.error(err)
      }
    }).catch(err => {
      this.loading = false
    })
  },

  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },

  methods: {
    setRelease(e) {
      console.log(e.id, e.isrelease)
    }
  }
}
</script>
