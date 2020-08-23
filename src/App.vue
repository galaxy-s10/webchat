<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // this.ws.onopen = () => {
    //   console.log("连接成功");
    // };
  },
  mounted() {},
  methods: {},
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
