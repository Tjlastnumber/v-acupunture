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
        items: [{
          "id": "da5ebc9a-af0c-11e7-a697-02004c4f4f50",
          "relevanceacupointname": "商阳",
          "title": "痄腮症见高热者在基本方的基础上加",
          "ispicture": 0,
          "answer": 4,
          "isrelease": 1,
          "createdate": new Date("2017-10-12T05:19:01.000+0000").toLocaleDateString(),
          "optiona": "太冲、曲泉",
          "optionb": "人中、十宣",
          "optionc": "内关、太冲",
          "optiond": "大椎、商阳",
          "optione": "曲泉、人中"
        }, {
          "id": "da5ebc9a-af0c-11e7-a697-02004c4f4f50",
          "relevanceacupointname": "商阳",
          "title": "痄腮症见高热者在基本方的基础上加",
          "ispicture": 0,
          "answer": 2,
          "isrelease": 1,
          "createdate": new Date("2017-10-12T05:19:01.000+0000").toLocaleDateString(),
          "optiona": "太冲、曲泉",
          "optionb": "人中、十宣",
          "optionc": "内关、太冲",
          "optiond": "大椎、商阳",
          "optione": "曲泉、人中"
        }, {
          "id": "da5ebc9a-af0c-11e7-a697-02004c4f4f50",
          "relevanceacupointname": "商阳",
          "title": "痄腮症见高热者在基本方的基础上加",
          "ispicture": 1,
          "answer": 1,
          "isrelease": 0,
          "createdate": new Date("2017-10-12T05:19:01.000+0000").toLocaleDateString(),
          "optiona": "太冲、曲泉",
          "optionb": "人中、十宣",
          "optionc": "内关、太冲",
          "optiond": "大椎、商阳",
          "optione": "曲泉、人中"
        }]
      },
      pagination: {},
      total: 0,
      loading: true
    }
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

<style>
.release-switch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.release-label {
  font-size: 13px;
}
</style>
