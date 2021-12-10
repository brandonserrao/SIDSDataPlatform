<template>
  <div class="goal-data">
    <div :id="`${goalNumber}bars`">
      GOAL {{goalNumber}}
    </div>
    <div class="goal-data_icon">
      <img :src="`https://sids-dashboard.github.io/SIDSDataPlatform/icons/SDG%20Icons%202019_WEB/E-WEB-Goal-${goalNumber}.png`">
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoalData',
  props:{
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    goalNumber: {
      type: String,
      default: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
