import Mock from 'mockjs'
const Todos = []
const COUNT = [1, 2, 3, 4, 5]
for (let i = 1; i <= COUNT.length; i++) {
  Todos.push(Mock.mock({
    id: Mock.Random.guid(),
    title: Mock.Random.first(),
    isDelete: false,
    locked: Mock.Random.boolean(),
    record: COUNT.map(() => {
      return {
        text: Mock.Random.cparagraph(2),
        isDelete: false,
        checked: Mock.Random.boolean()
      }
    })
  }))
}

export {
  Todos
}

// const temp = [...Mock.mock({ 'array|3': ['todos'] }).array]
// 可以这样用mock来生成数组
// console.log(temp)
