<template>
  <div class="footer-root">
    <p class="footer-root_text">Powered by the UNDP Data Futures Platform</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-root {
  width: 100%;
  background: #e0e1e9;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 90px 28px -50px #5f5c8721;
}
.footer-root_text {
  margin: 0;
  color: #868686;
}
</style>
