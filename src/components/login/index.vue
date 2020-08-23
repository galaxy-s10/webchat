<template>
  <div>
    <div class="wrap">
      <div>点击头像可选</div>
      <div>
        <img :src="avatarList[avatarindex]" class="avatar-normal" @click="show = !show" />
      </div>

      <div style="width:100%;text-align:center;margin-bottom:10px">欢迎进入聊天室</div>
      <div style="width:100%;margin-bottom:10px">
        <!-- <div type="text" class="name" placeholder="输入用户名" v-model="name"></div> -->
        <input type="text" class="name" placeholder="输入用户名" v-model="name" />
      </div>
      <div class="btn" @click="login">加入</div>
    </div>
    <div class="avatar-wrap" v-if="show">
      <img
        :src="item"
        class="avatar"
        :class="{active: index == avatarindex}"
        v-for="(item,index) in avatarList"
        :key="index"
        alt
        @click="selectAvatar(index)"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      show: false,
      avatarindex: 0,
      avatarList: [
        "https://img.cdn.zhengbeining.com/1594718686852vue.png",
        "https://img.cdn.zhengbeining.com/1594408065308Billd.jpg",
        "https://img.cdn.zhengbeining.com/1588781712222hero.jpg",
        "https://img.cdn.zhengbeining.com/song1.jpg",
        "https://img.cdn.zhengbeining.com/song2.jpg",
        "https://img.cdn.zhengbeining.com/song3.jpg",
        "https://img.cdn.zhengbeining.com/song4.jpg",
        "https://img.cdn.zhengbeining.com/song5.jpg",
        "https://img.cdn.zhengbeining.com/song6.jpg",
      ],
    };
  },
  mounted() {
    // if (this.$router.params) {
    //   if (this.$router.params.onclose) {
    //     console.log("掉线");
    //   }
    // }
    // var list = await axios.get("/ppp/chat/msg/list");
    // var list = await axios.get("/chat/msg/list");
    // var list = await axios.get("/webchat/chat/msg/list");
    // console.log(list);
    // fetch("/api/api/article")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
  },
  methods: {
    selectAvatar(e) {
      this.avatarindex = e;
      this.show = !this.show;
    },
    login() {
      if (this.name.length >= 3 && this.name.length <= 10) {
        localStorage.setItem("name", this.name);
        this.$router.push({
          path: "/main",
          query: { name: this.name, avatar: this.avatarindex },
        });
      } else {
        alert("请输入3-10个字符昵称");
      }
    },
  },
};
</script>

<style scoped>
.active {
  border: 3px solid pink;
}
.avatar-normal {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-position: 50% 50%;
  background-size: cover;
}
.avatar-wrap {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 0;
  background-color: #fafafa;
}
.avatar {
  display: inline-block;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  padding: 2px;
  margin: 5%;
  border-radius: 25%;
}
.wrap {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.name {
  /* width: 100%; */
  text-align: center;
  /* direction: rtl; */
  outline: none;
  font-size: 14px;
  padding: 7px 10px;
  border: 0;
  border-radius: 5px;
  background-color: #f0f0f2;
}
.btn {
  display: inline-block;
  margin: 10px auto 0;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 50%;
  color: white;
  background-color: #ff7836;
}
</style>