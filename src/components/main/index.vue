<template>
  <div>
    <div class="nav">
      <div style="width:25px" class="navBack" @click="navBack"></div>
      <div>
        <div class="item">聊天室</div>
        <div class="item">当前在线人数:{{count}}</div>
      </div>
    </div>
    <div class="center" ref="center">
      <div v-if="list.length>0" ref="list">
        <div v-for="(item,index) in list" :key="index">
          <div v-if="item.name == name" class="right">
            <div class="user">
              <div class="content-wrap">
                <div style="text-align:right">{{item.name}}</div>
                <div class="content">{{item.msg}}</div>
                <div class="content-date" style="text-align:right">{{formateDate(item.createdAt)}}</div>
              </div>
              <div>
                <img :src="avatarList[item.avatar]" alt class="avatar" />
              </div>
            </div>
          </div>
          <div v-else class="left">
            <div class="user">
              <div>
                <img :src="avatarList[item.avatar]" alt class="avatar" />
              </div>
              <div class="content-wrap">
                <div>{{item.name}}</div>
                <div class="content">{{item.msg}}</div>
                <div class="content-date">{{formateDate(item.createdAt)}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else ref="list"></div>
      <div v-if="isLoading">---只显示最近50条记录---</div>
    </div>

    <div class="input">
      <div class="ipt-wrap">
        <input type="text" class="ipt" placeholder="输入内容" v-model="msg" />
      </div>
      <div class="btn" @click="sendmsg">发送</div>
    </div>
  </div>
</template>

<script>
import { format } from "../../utils/format.js";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      websock: null,
      name: "",
      list: [],
      msg: "",
      count: 0,
      newuser: [],
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
      connect: false,
      url: "wss://www.zhengbeining.com/wss/",
      // url: "ws://localhost:5002/",
      isLoading: false,
      isclose: false, //是否掉线
    };
  },
  mounted() {
    this.createWebSocket(this.url);
  },
  destroyed() {
    // 离开路由之后断开websocket连接
    this.isclose = true;
    this.ws.close();
    // }
  },
  computed: {
    formateDate(x) {
      return (x) => format(x);
    },
  },
  methods: {
    // 新建WebSocket
    createWebSocket(url) {
      try {
        if ("WebSocket" in window) {
          this.ws = new WebSocket(url);
        }
        this.initWebSocket();
      } catch (e) {
        this.reconnect(url);
      }
    },
    initWebSocket() {
      this.ws.onopen = async () => {
        console.log("连接成功");
        // var list = await axios.get("/ppp/webchat/chat/msg/list");
        var list = await axios.get("/webchat/chat/msg/list");
        this.list = list.data.rows;
        this.isLoading = true;
        this.$nextTick(() => {
          this.$refs.center.scrollTop = this.$refs.center.scrollHeight;
        });
        this.name = this.$route.query.name;
        this.avatarindex = this.$route.query.avatar;
        this.ws.send(
          JSON.stringify({
            connect: true,
            name: this.name,
            avatar: this.avatarindex,
          })
        );
        this.onmessage();
      };
      this.ws.onclose = (e) => {
        if (this.isclose != true) {
          this.ws.close();
          alert("您已掉线");
          this.$router.push({ path: "/", params: { onclose: true } });
        }
      };
      this.ws.onerror = () => {
        console.log("连接错误，开始重连");
        this.reconnect(this.url);
      };
      // this.onmessage();
    },
    // 重连
    reconnect(url) {
      var connect = this.connect;
      if (connect) return;
      connect = true;
      setTimeout(() => {
        this.createWebSocket(this.url);
        connect = false;
      }, 1000);
    },
    // 退出聊天
    navBack() {
      this.$router.push({ path: "/login" });
    },
    // 发送消息
    sendmsg() {
      if (this.msg.length != 0) {
        const ws = this.ws;
        ws.send(
          JSON.stringify({
            name: this.name,
            avatar: this.avatarindex,
            msg: this.msg,
          })
        );
        this.msg = "";
        this.onmessage();
      } else {
        alert("不能发送空字符串");
      }
    },
    // 接收消息
    onmessage() {
      this.ws.onmessage = (e) => {
        e = JSON.parse(e.data);

        if (e.connect == true) {
          this.count = e.count;
          var list = this.$refs.list;
          // 创建一个新的元素
          var ele1 = document.createElement("div");
          var ele2 = document.createElement("div");
          var ele3 = document.createElement("div");

          var dateEle = document.createElement("div");

          // 创建一个新的文本节点
          var welcomeText = document.createTextNode(
            "欢迎 " + e.name + " 加入群聊"
          );
          var dateText = document.createTextNode(format(new Date()));

          // 将文本节点添加到元素中
          ele1.appendChild(dateText);
          ele2.appendChild(welcomeText);
          ele1.style.textAlign = "center";
          ele2.classList.add("newuser");

          // 在一个已存在的元素的末尾添加元素
          ele3.appendChild(ele1);
          ele3.appendChild(ele2);
          list.appendChild(ele3);

          this.$nextTick(() => {
            this.$refs.center.scrollTop = this.$refs.center.scrollHeight;
          });
        } else if (e.connect == false) {
          console.log(e);
          this.count = e.count;
          var list = this.$refs.list;
          // 创建一个新的元素
          var ele1 = document.createElement("div");
          var ele2 = document.createElement("div");
          var ele3 = document.createElement("div");

          var dateEle = document.createElement("div");

          // 创建一个新的文本节点
          var welcomeText = document.createTextNode(e.name + " 退出了群聊");
          var dateText = document.createTextNode(format(new Date()));

          // 将文本节点添加到元素中
          ele1.appendChild(dateText);
          ele2.appendChild(welcomeText);
          ele1.style.textAlign = "center";
          ele2.classList.add("newuser");

          // 在一个已存在的元素的末尾添加元素
          ele3.appendChild(ele1);
          ele3.appendChild(ele2);
          // 在一个已存在的元素的末尾添加元素
          list.appendChild(ele3);

          this.$nextTick(() => {
            this.$refs.center.scrollTop = this.$refs.center.scrollHeight;
          });
        } else {
          var item = {};
          item.name = e.name;
          item.avatar = e.avatar;
          item.msg = e.msg;
          item.createdAt = format(new Date());
          this.list.push(item);

          this.$nextTick(() => {
            this.$refs.center.scrollTop = this.$refs.center.scrollHeight;
          });
        }
        if (this.isLoading) {
          // 创建一个新的元素
          var ele1 = document.createElement("div");
          // 创建一个新的文本节点
          var text = document.createTextNode("---只显示最近50条记录---");

          // 将文本节点添加到元素中
          ele1.appendChild(text);

          ele1.style.textAlign = "center";

          var list = this.$refs.list;
          list.appendChild(ele1);
          this.isLoading = false;
        }
      };
    },
  },
};
</script>

<style>
.content-date {
  font-size: 10px;
}
.newuser {
  width: 50%;
  margin: 5px auto 5px;
  background-color: #dadada;
  text-align: center;
  font-size: 12px;
  color: white;
}
</style>
<style scoped>
.nav {
  height: 40px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: #62c2c2;
  text-align: center;
  display: flex;
  color: white;
  z-index: 999;
}
.center {
  margin-top: 40px;
  height: calc(100vh - 85px);
  overflow-y: scroll;
}
.navBack::before {
  position: absolute;
  content: "";
  top: 20px;
  left: 15px;
  width: 10px;
  height: 10px;
  border-style: solid;
  border-width: 2px 2px 0px 0px;
  border-color: #fafafa #fafafa transparent transparent;
  transform: translateX(-50%) translateY(-50%) rotate(220deg);
}
.nav div:nth-child(2) {
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 13px;
}
.nav .item:nth-child(2) {
  width: 100%;
  font-size: 10px;
}
.user {
  display: flex;
  max-width: 80%;
}
body {
  margin: 0;
  padding: 0;
}
.right {
  margin: 10px 10px 0 0;
  display: flex;
  justify-content: flex-end;
}
.left {
  display: flex;
  margin: 10px 0 0 10px;
}
.content-wrap {
  /* word-break: break-word; */
  max-width: 80%;
}
.right .content-wrap {
  margin-right: 10px;
}
.left .content-wrap {
  margin-left: 10px;
}
.left .content::before {
  content: "";
  display: block;
  position: absolute;
  top: 7px;
  left: -6px;
  border-style: solid;
  border-width: 7px 7px 7px 0px;
  border-color: transparent #98e165 transparent transparent;
  /* transform: translateX(-50%) translateY(-50%) rotate(45deg); */
}
.right .content::before {
  content: "";
  display: block;
  position: absolute;
  top: 7px;
  right: -6px;
  border-style: solid;
  border-width: 7px 0px 7px 7px;
  border-color: transparent transparent transparent #98e165;
  /* transform: translateX(-50%) translateY(-50%) rotate(45deg); */
}
.content {
  position: relative;
  min-height: 28px;
  line-height: 28px;
  padding: 0 10px;
  background-color: #98e165;
  word-break: break-word;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.input {
  width: 90%;
  /* display: flex; */
  position: fixed;
  bottom: 3px;
  left: 5%;
  justify-content: space-between;
  height: 40px;
  border-radius: 8px;
  background-color: #f4f4f4;
}
.ipt-wrap {
  position: absolute;
  left: 0;
  right: 70px;
}
.ipt {
  margin: 12px 0 0 12px;
  outline: none;
  font-size: 14px;
  width: 100%;
  border: 0;
  /* background-color: transparent; */
  background-color: white;
}
.btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
  height: 20px;
  font-size: 14px;
  padding: 5px;
  border-radius: 10px;
  background-color: #c3c3c3;
}
</style>

