<template>
  <div class="list-todos">
    <!--菜单容器-->
    <a
      @click="goList(item.id)"
      class="list-todo list activeListClass"
      :class="{ active: item.id === todoId }"
      v-for="(item, index) in todoList"
      :key="index"
    >
      <span class="icon-lock" v-if="item.locked"></span>
      <span class="count-list" v-if="item.count > 0">{{ item.count }}</span>
      {{ item.title }}
    </a>
    <a class="link-list-new" @click="addTodoList">
      <!--新增菜单-->
      <span class="icon-plus"> </span>
      新增
    </a>
  </div>
</template>

<script>
import { addTodo } from '../utils/api.js'
export default {
  data: () => {
    return {
      todoId: '',
      items: [],
      todoNum: 0
    }
  },
  created () {
    console.log(this.$route)
    this.$store.dispatch('getTodo', this.$router.params).then(() => {
      // 调用vuex actions.js 里面的 getTodo函数
      this.$nextTick(() => {
        this.goList(this.todoList[0].id)
      })
    })
  },
  watch: {
    todoId: function (id) {
      console.log('change todoId')
      this.$router.push({ name: 'todo', params: { id: id } })
      console.log({ name: 'todo', params: { id: id } })
    }
  },
  computed: {
    todoList () {
      const number = this.$store.getters.getTodoList.length
      if (this.$store.getters.getTodoList.length < this.todoNum) {
        this.goList(this.$store.getters.getTodoList[0].id)
      }
      this.changeNum(number)
      return this.$store.getters.getTodoList // 返回vuex getters.js 定义的getTodoList数据
    }
  },
  methods: {
    goList (id) {
      // 点击菜单时候,替换选中id
      this.todoId = id
      console.log(`menus change to ${id}`)
    },
    changeNum (num) {
      this.todoNum = num
    },
    addTodoList () {
      // 点击新增按钮时候
      // 调用新增菜单的接口，在接口调用成功在请求数据
      addTodo({}).then((data) => {
        this.$store.dispatch('getTodo').then(() => {
          this.$nextTick(() => {
            setTimeout(() => {
              this.goList(this.todoList[this.todoList.length - 1].id)
            }, 100)
          })
        })
      })
    }
  }
}
</script>

<style lang="less">
@import "../assets/style/menu.less";
</style>
