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
              <v-btn ripple class="primary" round @click="add({})">
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
                <!-- <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear> -->
                <template slot="progress">
                  <div class="loading-mask">
                    <v-progress-circular
                      :size="70"
                      color="blue"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
                <template slot="items" slot-scope="props">
                  <transition name="slide-left">
                    <tr style="width: 100%">
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
                    </tr>
                  </transition>
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
    <v-layout>
      <v-dialog content-class="edit-dialog" v-model="show" persistent max-width="800px">
        <transition name="slide-left" mode="out-in">
          <router-view />
        </transition>
      </v-dialog>
    </v-layout>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as types from '../../store/moduls/single-choice/single-choice-types'

export default {
  name: 'SingleChoice',
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
      editItem: {},

      enableRowId: ''
    }
  },

  mounted() {
    this.pagination.sortBy = 'CreateDate'
    this.pagination.rowsPerPage = 10
  },

  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null ||
        this.data.totalCount == null
      ) return 0

      return Math.ceil(this.data.totalCount / this.pagination.rowsPerPage)
    },
    ...mapState({
      data: state => state.singleChoice.data,
      loading: state => state.singleChoice.loading,
      show: state => state.singleChoice.editState
    })
  },

  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    stateSelected() {
      this.getDataFromApi()
    }
  },

  methods: {
    setRelease(e) {
      this.enableRowId = e.id
      this.$store.dispatch(types.NAMESPACED + types.RELEASE, e)
      .then(() => {
          this.$store.commit('successNotifation', e.isrelease ? '发布成功' : '撤销成功')
          this.enableRowId = ''
      }).catch(() => {
          this.$store.commit('errorNotifation', e.isrelease ? '发布失败' : '撤销失败')
          this.enableRowId = ''
      })
    },
    deleteItem(e) {
      this.$store.dispatch(types.NAMESPACED + types.DELETE_ITEM, e)
      .then( 
        () => this.$store.commit('successNotifation', '删除成功')
      ).catch(
        () => this.$store.commit('errorNotifation', '删除失败')
      )
    },

    add () {
      this.$router.replace({ name: 'EditText', params: { id: '0' } })
      this.$store.commit(types.NAMESPACED + types.START_EDIT)
    },

    edit(item) {
      this.$router.replace({ name: item.ispicture === 0 ? 'EditText' : 'EditImageQuestion', params: { id: item.id }})
      this.$store.commit(types.NAMESPACED + types.START_EDIT)
    },
    getDataFromApi() {
      // this.loading = true
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
    }
  }
}
</script>

<style>
.slide-left-enter,
.slide-left-leave-active
{
  opacity: 0;
}

.slide-left-enter {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all .2s cubic-bezier(0.86, 0, 0.07, 1);
  -webkit-transition: all .2s cubic-bezier(0.86, 0, 0.07, 1);
}

.slide-left-leave-active {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}


.edit-dialog {
  overflow-x: hidden;
  background: white;
}

.loading-mask {
  position: absolute; 
  background: rgba(0, 0, 0, .3); 
  top: 0; 
  bottom: 0; 
  left: 0; 
  right: 0; 
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
