<template>
  <v-container fluid grid-list-md>
    <v-card>
      <v-toolbar flat color="white">
        <v-toolbar-title>文件管理</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          @click.native="upload"
        >上传文件</v-btn>
        <input
          name="file"
          ref="file"
          type="file"
          style="display: none;"
          @change="fileChange($event)"
        >
      </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-data-iterator
            :items="files"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex
              slot="item"
              slot-scope="props"
              xs12
              sm6
              md4
              lg3
            >
              <v-card>
                <v-card-title>
                  <h4>{{ props.item.fileName }}</h4>
                  <v-spacer />
                  <v-tooltip bottom>
                    <v-btn
                      slot="activator"
                      flat
                      icon
                      color="pink"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <span>删除文件</span>
                  </v-tooltip>
                </v-card-title>
                <v-divider></v-divider>
                <v-progress-linear :query="true" :active="props.item.downloading" v-model="props.item.progress"></v-progress-linear>
                <v-list dense>
                  <v-list-tile>
                    <v-list-tile-content>路径: </v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      {{ props.item.filePath }}
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Size : </v-list-tile-content>
                    <v-list-tile-content class="align-end">
                      {{ props.item.fileSize }}
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Date: </v-list-tile-content>
                    <v-list-tile-content class="align-end" v-dateformat:full="props.item.updateTime"></v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer />
                  <v-tooltip v-if="!props.item.downloading" bottom>
                    <v-btn
                      slot="activator"
                      key="download"
                      color="primary"
                      flat
                      @click="download(props.item)"
                    >
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                    <span>下载</span>
                  </v-tooltip>
                  <v-tooltip v-else bottom>
                    <v-btn
                      slot="activator"
                      key="cancel"
                      color="primary"
                      flat
                      @click="cancelRequest(props.item)"
                    >
                      <v-icon>cancel</v-icon>
                    </v-btn>
                    <span>取消</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {
  mapState
} from "vuex"
import vUpload from '@/components/UpLoad'
import * as types from '../../store/moduls/file-manager/file-manager-types'

export default {
  name: "FileManager",
  components: {
    vUpload
  },
  data() {
    return {
      dialog: false,
      rowsPerPageItems: [4, 8, 12],
      downloadFileName: '',
      uploadFile: null,
      pagination: {
        rowsPerPage: 4
      },
    };
  },
  created() {
    this.$store.dispatch(types.NAMESPACED + types.GET_FILE_LIST)
  },
  computed: {
    ...mapState({
      files: state => state.fileManager.files,
      resourcePath: state => state.resourcePath
    })
  },
  methods: {
    upload() {
      this.$refs['file'].click()
    },
    download(file) {
      let onDownloadProgress = this.onDownloadProgress
      this.downloadFileName = file.fileName

      this.$store.dispatch(types.NAMESPACED + types.DOWNLOAD, {
          file
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file.fileName)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }).catch(err => console.error(err))
    },
    fileChange(el) {
      if (!el.target.files[0]) return
      let file = el.target.files[0]
      this.$store.dispatch(types.NAMESPACED + types.UPLOAD, {
        file
      }).catch(err => {
        el.value = ''
        console.log(err)
      })
    },
    cancelRequest(file) {
      this.$store.dispatch(types.NAMESPACED + types.REQUEST_CANCEL, {
        file,
        message: '取消请求'
      })
    }
  }
}
</script>

<style>
.translate-fade-enter-active,
.translate-fade-leave-active {
  transition: all .3s;
}

.translate-fade-enter,
.translate-fade-leave-active {
  opacity: 0;
}

.translate-fade-enter {
  transform: translateY(100%);
}

.translate-fade-leave-active {
  transform: translateY(-100%)
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
