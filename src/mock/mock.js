import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Mock } from 'mockjs'
import {
  Todos
} from './data/todoList'

export default {
  /* mock start */
  start () { // 初始化函数
    console.log('mock start working')
    const mock = new MockAdapter(axios)// 创建MockAdapter实例
    // 获取todo列表
    mock.onGet('/todo/list').reply(config => { // config是前台传过来的数据
      console.log('/todo/list return data')
      const mockTodo = Todos.map(todo => { // 重组Todos数组
        return {
          id: todo.id,
          title: todo.title,
          count: todo.record.filter((data) => {
            if (data.checked === false) return true
            return false
          }).length, // 过滤到record里面 ‘checked’ 为true的数据，因为它们已经被完成了
          locked: todo.locked,
          isDelete: todo.isDelete
        }
      }).filter(todo => {
        if (todo.isDelete === true) return false
        return true
      })
      console.log(mockTodo)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            todos: mockTodo // 返回状态为200，并且返回todos数据
          }])
        }, 200)
      })
    })

    mock.onPost('/todo/addTodo').reply(config => {
      Todos.push({
        id: Mock.Random.guid(),
        title: 'newList',
        isDelete: false,
        locked: false,
        record: []
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200], 200)
        })
      })
    })

    mock.onGet('/todo/listId').reply(config => {
      console.log('/todo/listId return data')
      console.log(config)
      const {
        id
      } = config.params
      console.log(id)
      // id是传进来的值
      // todo 是根据id和现有的Todos数据匹配，找出id相等的数据，再返回
      const todo = Todos.find(todo => {
        console.log(id, todo.id)
        return id && todo.id === id
      })
      console.log('Mock.js:todo:' + todo)
      // todo.count(等待完成数目)等于todo.record（待办事项）列表下面未被选择的数据
      todo.count = todo.record.filter((data) => {
        return data.checked === false
      }).length

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            todo: todo
          }])
        }, 200)
      })
    })

    mock.onPost('/todo/addRecord').reply(config => {
      const {
        id,
        text
      } = JSON.parse(config.data)
      // id是传进来的值唯一代办项的id
      // text 是用户新增的输入数据
      Todos.some((t, index) => {
        if (t.id === id) {
          t.record.push({
            text: text,
            isDelete: false,
            checked: false
          })
          return true
        }
      })

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200])
        }, 200)
      })
    })

    mock.onPost('/todo/editTodo').reply(config => {
      const {
        todo
      } = JSON.parse(config.data)
      Todos.some((t, index) => {
        if (t.id === todo.id) {
          t.title = todo.title
          t.locked = todo.locked
          t.isDelete = todo.isDelete
          return true
        }
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200])
        }, 200)
      })
    })
    // 修改标题
    mock.onPost('/todo/editRecord').reply(config => {
      const {
        id,
        record,
        index
      } = JSON.parse(config.data)
      Todos.some((t) => {
        if (t.id === id) {
          t.record[index] = record
          return true
        }
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200])
        }, 200)
      })
    })
  }
}
