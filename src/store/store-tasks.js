import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
  tasks: {},
  search: '',
  sort: 'name',
  tasksDownloaded: false
}

const mutations = {
  updateTask(state, payload) {
    Object.assign(state.tasks[payload.id], payload.updates)
  },
  clearTasks(state) {
    state.tasks = {}
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id)
  },
  addTask(state, payload) {
    Vue.set(state.tasks, payload.id, payload.task)
  },
  setSearch(state, value) {
    state.search = value
  },
  setSort(state, value) {
    state.sort = value
  },
  setTasksDownloaded(state, value) {
    state.tasksDownloaded = value
  }
}

const actions = {
  updateTask: ({ dispatch }, payload) => {
    dispatch('firebaseUpdateTask', payload)
  },
  deleteTask: ({ dispatch }, id) => {
    dispatch('firebaseDeleteTask', id)
  },
  addTask: ({ dispatch }, task) => {
    let taskId = uid
    let payload = {
      id: taskId,
      task: task
    }
    dispatch('firebaseAddTask', payload)
  },
  setSearch({ commit }, value) {
    commit('setSearch', value)
  },
  setSort({ commit }, value) {
    commit('setSort', value)
  },
  firebaseReadData({ commit }) {
    let userId = firebaseAuth.currentUser.uid
    let userTasksRef = firebaseDb.ref('tasks/' + userId)
    // initial check for data event
    userTasksRef.once(
      'value',
      _ => {
        commit('setTasksDownloaded', true)
      },
      error => {
        showErrorMessage(error.message)
        this.$router.replace('/auth')
      }
    )
    // add task event
    userTasksRef.on(
      'child_added',
      snapshot => {
        let task = snapshot.val()
        let payload = {
          id: snapshot.key,
          task: task
        }
        commit('addTask', payload)
      },
      error => console.log(error)
    )
    // changed task event
    userTasksRef.on(
      'child_changed',
      snapshot => {
        let task = snapshot.val()
        let payload = {
          id: snapshot.key,
          updates: task
        }
        commit('updateTask', payload)
      },
      error => console.log(error)
    )
    // removed task event
    userTasksRef.on(
      'child_removed',
      snapshot => {
        let taskId = snapshot.key
        commit('deleteTask', taskId)
      },
      error => console.log(error)
    )
  },
  firebaseAddTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = firebaseDb.ref('tasks/' + userId)
    taskRef.push(payload.task, error => {
      if (error) {
        showErrorMessage(error.message)
      } else {
        Notify.create('Task added')
      }
    })
  },
  firebaseUpdateTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = firebaseDb.ref('tasks/' + userId + '/' + payload.id)
    taskRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message)
      } else {
        let keys = Object.keys(payload.updates)
        if (!(keys.includes('completed') && keys.length == 1))
          Notify.create('Task updated')
      }
    })
  },
  firebaseDeleteTask({}, taskId) {
    let userId = firebaseAuth.currentUser.uid
    let taskRef = firebaseDb.ref('tasks/' + userId + '/' + taskId)
    taskRef.remove(error => {
      if (error) {
        showErrorMessage(error.message)
      } else {
        Notify.create('Task deleted')
      }
    })
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
