<template>
  <div class="message-box">
    <div class="info-box">
      <span class="info">{{messageInfo}}</span>
      <slot name="info-slot"></slot>
    </div>
    <div class="btns-box">
      <slot name="btns-slot"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    messageInfo: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.message-box {
  padding: 10px;
  border: 1px solid #dadada;
  background-color: #204969;
  color: #08ffc8;
  border-radius: 5px;
  position: absolute;
  top: 35%;
  left: 50%;
}

.btns-box {
  display: flex;
  margin-top: 20px;
}

.btns-box button {
  flex: 1;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
