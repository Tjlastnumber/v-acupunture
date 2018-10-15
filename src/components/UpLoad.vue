<template>
  <v-img
    aspect-ratio="1"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :src="getSrc"
    class="grey lighten-2 upload-img"
    @click="upload()"
  >
    <v-layout
      slot="placeholder"
      fill-height
      align-center
      justify-center
      ma-0
    >
      <v-btn
        depressed
        icon
        fab
        dark
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <input
      ref="uploadInput"
      style="display: none"
      type="file"
      :accept="accept"
      @change="fileChange($event)"
    >
  </v-img>
</template>

<script>
export default {
  name: "vUpLoad",
  model: {
    prop: 'file',
    event: 'fileChanged'
  },
  props: {
    file: [String, File],
    accept: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: '50px'
    },
    maxHeight: {
      type: String,
      default: '50px'
    }
  },
  data() {
    return {
      img: ''
    }
  },
  computed: {
    getSrc() {
      return typeof this.file === 'string' ? this.file : this.img
    }
  },
  methods: {
    upload() {
      // document.getElementById('upload_file').click()
      // console.log(el)
      this.$refs.uploadInput.click()
    },
    fileChange(el) {
      if (!el.target.files[0]) return
      let file = el.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.img = reader.result
      }
      this.$emit('fileChanged', file)
    }
  }
}
</script>

<style>
.upload-img {
  cursor: pointer;
}
</style>
