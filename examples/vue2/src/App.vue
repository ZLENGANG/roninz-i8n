<template>
  <div id="app">
    <div>这是vue2-template 0.1.1</div>
    <div title="哈哈哈哈">这是span</div>
    <div>这个人叫做 {{ name }}</div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      name: "曾浪",
      age: 25,
    };
  },
  created() {
    console.log("提示");
    console.log(`你好，我是${this.name}，今年${this.age}岁`);
  },
};
</script>

<style></style>
