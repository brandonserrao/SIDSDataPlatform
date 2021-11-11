<template>
  <header class="header">
  <video class="header_video" autoplay muted loop>
    <source src="@/assets/blue economy_1_3.mp4" type="video/mp4">
  </video>
    <div class="header-bar">
      <img
        class="header-bar_logo"
        src="https://data.undp.org/wp-content/uploads/2020/12/UNDP-COVID19-Data-Futures-Platform-Logo.svg"
        alt="UNDP COVID19 Data Futures Platform Logo">
    </div>
    <main role="main" class="header-text">
        <h1 class="header-text_header header-text_header-big">Data Visualization Platform</h1>
        <h2 class="header-text_header header-text_header-small">for the</h2>
        <h1 class="header-text_header header-text_header-big">SMALL ISLAND DEVELOPING STATES </h1>
        <hr class="header-text_divider">
        <p class="header-text_description">UNDP’s integrated approach supports Small Island Developing States to accelerate
          transformative
          development based on three pillars: Climate Action, Blue Economy, and Digital Transformation. </p>
    </main>
    <a class="header_button-down" href="#content">
      <img alt="Arrow Down Icon" src="https://raw.githubusercontent.com/solodev/scroll-down-anchor/master/images/arrow-down-1.png">
    </a>
  </header>
</template>

<script>
export default {
  name: 'RootHeader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 2em;
}
.header-bar {
  position: relative;
  z-index: 2;
  background: rgba(250, 250, 250, 0.89);
  padding: 15px 10px;
  margin-bottom: 4em;
}
.header_video {
  width: 100%;
  bottom: 0;
  right: 0;
  object-fit: fill;
  position: absolute
}
.header-text {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  filter: drop-shadow(1px 1px 0px black);
  margin-bottom: 2em;
}
.header-text_header {
  font-weight: 650;
  margin-top: -6px;
}
.header-text_header-big {
  font-size: 58px;
  -webkit-animation: fadein 2s;
  -moz-animation: fadein 2s;
  -ms-animation: fadein 2s;
  -o-animation: fadein 2s;
  animation: fadein 2s;
}
.header-text_header-small {
  font-size: 36px;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
}

.header-text_divider {
  width:70%;
  margin: auto;
  border-style:solid;
  border-width:1px;
  opacity:1;
  margin-bottom:20px;
}

.header-text_description {
  font-size: 20px;
  font-weight: 400;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
  max-width: 1000px;
  margin: 0 auto;
}
.header_button-down {
  margin: auto;
  position: relative;
  z-index: 3;
}
</style>
