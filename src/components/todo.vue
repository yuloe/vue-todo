<template>
  <div class="page lists-show" v-show="!todo.isDelete">
    <!-- 头部模块 -->
    <nav>
      <!-- 当用户浏览车窗口尺寸小于40em时候，显示手机端的菜单图标 -->
      <div class="form list-edit-form" v-show="isUpdate">
        <!-- 当用户点击标题进入修改状态，就显示当前内容可以修改 -->
        <input type="text" v-model="todo.title" @keyup.enter="updateTitle" :disabled="todo.locked">
        <div class="nav-group right">
          <a class="nav-item" @click="isUpdate = false">
            <span class="icon-close">
            </span>
          </a>
        </div>
      </div>
      <div class="nav-group" @click="$store.dispatch('updateMenu')" v-show="!isUpdate">
        <!-- 在菜单的图标下面添加updateMenu时间，他可以直接调用vuex actions.js里面的updateMenu方法 -->
        <a class="nav-item">
          <span class="icon-list-unordered">
          </span>
        </a>
      </div>
      <!-- 显示标题和数字模块 -->
      <h1 class="title-page" v-show="!isUpdate" @click="isUpdate = true">
        <span class="title-wrapper">{{todo.title}}</span>
        <!-- title:标题 绑定标题 -->
        <span class="count-list">{{todo.count || 0}}</span>
        <!-- count:数量 绑定代办单项熟练-->
      </h1>
      <!-- 右边显示删除图标和锁定图标的模块 -->
      <div class="nav-group right" v-show="!isUpdate">
        <div class="options-web">
          <a class=" nav-item" @click="onlock">
            <!-- icon-lock锁定的图标 icon-unlock：非锁定的图标-->
            <span class="icon-lock" v-if="todo.locked"></span>
            <span class="icon-unlock" v-else>
            </span>
          </a>
          <a class="nav-item">
            <span class="icon-trash" @click="onDelete"></span>
          </a>
        </div>
      </div>
      <!-- 用户新增代办事项的input模块 -->
      <div class=" form todo-new input-symbol">
        <!-- 绑定disabled值，当todo.locked为绑定的时候，禁止input输入,双向绑定text,和监听input的回车事件@keyup.enter -->
        <input type="text" v-model="text" placeholder='请输入' @keyup.enter="onAdd" :disabled="todo.locked" />
        <span class="icon-add"></span>
      </div>
    </nav>
    <!-- 列表主体模块 -->
    <div class="content-scrollable list-items">
      <div v-for="(item,index) in items" :key = "index">
        <item :item="item" :index="index" :id="todo.id" :init="init" :locked="todo.locked"></item>
      </div>
    </div>
  </div>
</template>

<script>
import item from './item'
import { getTodo, addRecord, editTodo } from '../utils/api.js'
export default {
  components: {
    item
  },
  data: () => {
    return {
      todo: {
        title: '星期一', // 标题
        count: 12, // 数量
        locked: false // 是否绑定
      },
      items: [
        // 代办单项列表
      ],
      text: '', // 新增的代办单项绑定值
      isUpdate: false
    }
  },
  watch: {
    '$route.params.id' () {
      this.init()
    }
  },
  created () {
    this.init()
    console.log('todoVue init function created successfully')
  },
  methods: {
    onAdd () {
      // 当用户输入文字，且按下回车时调用方法
      const ID = this.$route.params.id
      addRecord({ id: ID, text: this.text }).then((res) => {
        this.text = ''
        this.init()
      })
      console.log(`todo TITLE: ${this.todo.title} and its data:`)
      console.log(this.items)
    },
    init () {
      // 获取到$route下params的id，即在menus中传入的数据
      const ID = this.$route.params.id
      getTodo({ id: ID }).then((res) => {
        const { id, title, count, isDelete, locked, record } = res.data.todo
        // 请求成功，拿到res.data.todo；在record赋值到待办事项，其他数据赋值到todo
        this.items = record
        this.todo = {
          id: id,
          title: title,
          count: count,
          locked: locked,
          isDelete: isDelete
        }
      })
    },
    updateTodo () {
      const _this = this
      editTodo({
        todo: this.todo
      }).then(data => {
        // _this.init();
        _this.$store.dispatch('getTodo')
      })
    },
    updateTitle () {
      this.updateTodo()
      this.isUpdate = false
    },
    onDelete () {
      this.todo.isDelete = true
      console.log('delete')
      this.updateTodo()
    },
    onlock () {
      this.todo.locked = !this.todo.locked
      this.updateTodo()
    }
  }
}
</script>

<style lang = "less">
@import "../assets/style/nav.less";
@import "../assets/style/form.less";
@import "../assets/style/todo.less";
</style>
