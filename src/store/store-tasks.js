import Vue from 'vue'
import { uid } from 'quasar'

const state = {
  tasks: {
    ID1: {
      name: 'Go to shop',
      dueDate: '2020/09/02',
      dueTime: '10:30',
      completed: false
    },
    ID2: {
      name: 'Buy bananas',
      dueDate: '2020/09/01',
      dueTime: '12:30',
      completed: false
    },
    ID3: {
      name: 'Buy apples',
      dueDate: '2020/09/04',
      dueTime: '18:30',
      completed: false
    }
  },
  search: '',
  sort: 'name'
}

const mutations = {
  updateTask(state, payload) {
    Object.assign(state.tasks[payload.id], payload.updates)
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id)
  },
  addTask(state, payload) {
    Vue.set(state.tasks, payload.id, payload.task)
  },
  setSearch(state, value) {
    state.search = value
  }
}

const actions = {
  updateTask: ({ commit }, payload) => {
    commit('updateTask', payload)
  },
  deleteTask: ({ commit }, id) => {
    commit('deleteTask', id)
  },
  addTask: ({ commit }, task) => {
    let taskId = uid()
    let payload = {
      id: taskId,
      task: task
    }
    commit('addTask', payload)
  },
  setSearch({ commit }, value) {
    commit('setSearch', value)
  }
}

const getters = {
  tasksSorted: state => {
    let tasksSorted = {}
    let keysSorted = Object.keys(state.tasks)
    keysSorted.sort((a, b) => {
      return state.tasks[a][state.sort].toLowerCase() >
        state.tasks[b][state.sort].toLowerCase()
        ? 1
        : -1
    })
    keysSorted.forEach(key => {
      tasksSorted[key] = state.tasks[key]
    })
    return tasksSorted
  },
  tasksFiltered: (state, getters) => {
    let tasksSorted = getters.tasksSorted
    let tasksFiltered = {}
    if (state.search) {
      Object.keys(tasksSorted).forEach(key => {
        let task = tasksSorted[key]
        if (task.name.toLowerCase().includes(state.search.toLowerCase())) {
          tasksFiltered[key] = task
        }
      })
      return tasksFiltered
    }
    return tasksSorted
  },
  tasksTodo: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered
    let tasks = {}
    Object.keys(tasksFiltered).forEach(key => {
      let task = tasksFiltered[key]
      if (!task.completed) {
        tasks[key] = task
      }
    })
    return tasks
  },
  tasksCompleted: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered
    let tasks = {}
    Object.keys(tasksFiltered).forEach(key => {
      let task = tasksFiltered[key]
      if (task.completed) {
        tasks[key] = task
      }
    })
    return tasks
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}