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
              <v-flex
                row
                xs12
                sm10
                md10
              >
                <v-text-field
                  flat
                  solo
                  prepend-icon="search"
                  placeholder="题目"
                  v-model="search"
                  hide-details
                ></v-text-field>
              </v-flex>
              <v-flex
                row
                xs12
                sm2
                md2
              >
                <v-select
                  :items="stateOptions"
                  item-text="label"
                  item-value="key"
                  v-model="stateSelected"
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
                :headers="table.headers"
                :search="search"
                :items="data.lists"
                :pagination.sync="pagination"
                :total-items="data.totalCount"
                :loading="loading"
                item-key="name"
                no-data-text="无"
                hide-actions
                must-sort
              >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.title }}</td>
                  <td>
                    <v-checkbox readonly hide-details v-model="props.item.ispicture" />
                  </td>
                  <td v-qs-options="props.item.answer"></td>
                  <td v-dateformat="props.item.createdate"></td>
                  <td>
                    <v-switch
                      :disabled="enableRowId === props.item.id"
                      hide-details
                      v-model="props.item.isrelease"
                      @change="setRelease(props.item)"
                    />
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
                      @click.native="edit(props.item)"
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
                      @click.native="deleteItem(props.item)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
                <template slot="footer">
                  <td colspan="100%">
                    <v-layout row wrap align-center>
                      <v-flex xs10 class="text-xs-right mt-2">每页行数:</v-flex>
                      <v-flex xs2 sm2 md2>
                        <v-toolbar class="elevation-0" color="white">
                          <v-spacer />
                          <v-select
                            class="shrink"
                            :items="[5,10,25,50,{text:'所有','value':-1}]"
                            v-model="pagination.rowsPerPage"
                            menu-props="auto"
                            hide-details
                            single-line
                          ></v-select>
                        </v-toolbar>
                      </v-flex>
                    </v-layout>
                  </td>
                </template>
              </v-data-table>
              <div class="text-xs-center pt-2 pb-3">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="10"></v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 编辑弹出页 -->
    <edit-dialog :data="editItem" />

    <!-- 提示弹出框 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <v-btn dark flat @click="snackbar.show = false">
        关闭
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import editDialog from './edit'
import { mapState } from 'vuex'
import * as types from '../../store/moduls/singleChoice-types'

export default {
  components: {
    editDialog
  },
  data() {
    return {
      search: "",
      stateSelected: 2,
      stateOptions: [
        { label: '全部', key: 2 },
        { label: '已发布', key: 1 },
        { label: '未发布', key: 0 },
      ],
      table: {
        headers: [{
            text: '题目',
            align: 'left',
            value: 'Title',
            width: '500px'
          },
          {
            text: '图片题 (是/否)',
            sortable: false,
            value: 'ispicture'
          },
          {
            text: '正确选项',
            value: 'Answer'
          },
          {
            text: '操作时间',
            value: 'CreateDate'
          }, {
            text: '发布',
            value: 'IsRelease'
          }, {
            text: '操作',
            align: 'center',
            sortable: false,
            value: ''
          }
        ]
      },
      pagination: {},
      loading: true,
      editItem: {},

      enableRowId: '',
      snackbar: {
        message: '',
        color: 'success',
        show: false
      }
    }
  },

  mounted() {
    this.pagination.sortBy = 'CreateDate'
    this.pagination.rowsPerPage = 10
  },

  computed: mapState({
    pages() {
      if (this.pagination.rowsPerPage == null ||
        this.data.totalCount == null
      ) return 0

      return Math.ceil(this.data.totalCount / this.pagination.rowsPerPage)
    },
    data: state => state.singleChoice.data
  }),

  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    stateSelected(val) {
      this.getDataFromApi()
    }
  },

  methods: {
    setRelease(e) {
      this.enableRowId = e.id
      this.$store.dispatch(types.NAMESPACED + types.RELEASE, e)
      .then( res => {
          this.snackbar.color = 'success'
          this.snackbar.message = '发布成功'
          this.snackbar.show = true
          this.enableRowId = ''
      }).catch(err => {
          this.snackbar.color = 'error'
          this.snackbar.message = '发布失败'
          this.snackbar.show = true
          this.enableRowId = ''
      })
    },
    deleteItem(e) {
      this.$store.dispatch(types.NAMESPACED + types.DELETE_ITEM, e)
      .then( res => {
        console.log(res)
      }).catch(err => {
        console.error(err)
      })
    },
    edit(item) {
      this.editItem = item
      this.$store.commit(types.NAMESPACED + types.START_EDIT)
    },
    getDataFromApi() {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination

      let query = {
        pn: page,
        pnsize: rowsPerPage,
        title: this.search,
        isrelease: this.stateSelected,
        sorttype: sortBy || 'CreateDate',
        ascordesc: descending ? '1' : '0'
      }

      this.$store.dispatch(types.NAMESPACED + types.GET_PAGES, query)
        .then(() => {
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>
