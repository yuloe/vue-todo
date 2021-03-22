<template>
  <section class="container" :class="{'menu-open' : menuOpen}"> <!--最外层容器-->
    <section class="menu"> <!--左边的容器-->
      <menus></menus>
    </section>
    <div class="content-overlay" @click="$store.dispatch('updateMenu')"></div>
    <section class="content-container"><!--右边的容器-->
      <router-view></router-view>
    </section>
  </section>
</template>

<script>
import menus from '../components/menus'
export default {
  components: {
    menus
  },
  computed: {
    menuOpen () {
      return this.$store.state.menuOpen
    }
  }
}
</script>

<style lang="less">
  @import '../assets/style/layouts.less';
</style>
