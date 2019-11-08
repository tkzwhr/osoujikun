import nanoid from 'nanoid'
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators'
import store from '@/store'
import {
  Task,
  Place,
  Plan,
  CreatePlaceParams,
  CreateTaskParams,
  CreatePlanParams,
  UpdatePlaceParams,
  UpdateTaskParams,
  UpdatePlanParams
} from '@/interface'

function _findPlace(places: Place[], id: string): Place | undefined {
  return places.find(v => v.id === id)
}

function _findTask(places: Place[], id: string): Task | undefined {
  return places.flatMap(v => v.tasks).find(v => v.id === id)
}

function _findPlan(places: Place[], id: string): Plan | undefined {
  return places.flatMap(v => v.tasks).flatMap(v => v.plans).find(v => v.id === id)
}

@Module({
  dynamic: true,
  store,
  namespaced: true,
  name: 'places'
})
export default class PlacesModule extends VuexModule {
  places: Place[] = [
    {
      id: 'aaa',
      name: 'お風呂',
      tasks: [{
        id: 'bbb',
        name: '通常',
        plans: [{
          id: 'ccc',
          name: '',
          default: true,
          interval: 7,
          latest: new Date(),
          memo: ''
        }]
      }]
    }
  ]

  get findPlace(): (placeId: string) => Place | undefined {
    return (placeId: string) => _findPlace(this.places, placeId)
  }

  get findTask(): (taskId: string) => Task | undefined {
    return (taskId: string) => _findTask(this.places, taskId)
  }

  get findPlan(): (planId: string) => Plan | undefined {
    return (planId: string) => _findPlan(this.places, planId)
  }

  @Mutation
  CREATE_PLACE(payload: CreatePlaceParams) {
    this.places.push({
      id: nanoid(),
      name: payload.name,
      tasks: []
    })
  }

  @Mutation
  CREATE_TASK(payload: CreateTaskParams) {
    const place = _findPlace(this.places, payload.placeId)
    if (place) {
      place.tasks.push({
        id: nanoid(),
        name: payload.name,
        plans: [{
          id: nanoid(),
          name: '',
          default: true,
          interval: payload.interval,
          latest: new Date(),
          memo: payload.memo
        }]
      })
    }
  }

  @Mutation
  CREATE_PLAN(payload: CreatePlanParams) {
    const task = _findTask(this.places, payload.taskId)
    if (task) {
      task.plans.push({
        id: nanoid(),
        name: payload.name,
        default: false,
        interval: payload.interval,
        latest: new Date(),
        memo: payload.memo
      })
    }
  }

  @Mutation
  UPDATE_PLACE(payload: UpdatePlaceParams) {
    const place = _findPlace(this.places, payload.targetId)
    if (place) {
      place.name = payload.name
    }
  }

  @Mutation
  UPDATE_TASK(payload: UpdateTaskParams) {
    const task = _findTask(this.places, payload.targetId)
    if (task) {
      task.name = payload.name
      const defaultPlan = task.plans.find(v => v.default)
      if (defaultPlan) {
        defaultPlan.interval = payload.interval
        defaultPlan.memo = payload.memo
      }
    }
  }

  @Mutation
  UPDATE_PLAN(payload: UpdatePlanParams) {
    const plan = _findPlan(this.places, payload.targetId)
    if (plan) {
      plan.name = payload.name
      plan.interval = payload.interval
      plan.memo = payload.memo
    }
  }

  @Mutation
  DELETE_PLACE(payload: string) {
    this.places = this.places.filter(v => v.id !== payload)
  }

  @Mutation
  DELETE_TASK(payload: string) {
    this.places
        .forEach(v => v.tasks = v.tasks.filter(vv => vv.id !== payload))
  }

  @Mutation
  DELETE_PLAN(payload: string) {
    this.places
        .flatMap(v => v.tasks)
        .forEach(v => v.plans = v.plans.filter(vv => vv.id !== payload))
  }

  @Mutation
  DO_CLEANING(payload: string) {
    const plan = _findPlan(this.places, payload)
    if (plan) {
      plan.latest = new Date()
    }
  }

  @Action
  async createPlace(payload: CreatePlaceParams) {
    this.context.commit('CREATE_PLACE', payload)
  }

  @Action
  async createTask(payload: CreateTaskParams) {
    this.context.commit('CREATE_TASK', payload)
  }

  @Action
  async createPlan(payload: CreatePlanParams) {
    this.context.commit('CREATE_PLAN', payload)
  }

  @Action
  async updatePlace(payload: UpdatePlaceParams) {
    this.context.commit('UPDATE_PLACE', payload)
  }

  @Action
  async updateTask(payload: UpdateTaskParams) {
    this.context.commit('UPDATE_TASK', payload)
  }

  @Action
  async updatePlan(payload: UpdatePlanParams) {
    const plan: Plan | undefined = this.context.getters['findPlan'](payload.targetId)
    if (plan && !plan.default) {
      this.context.commit('UPDATE_PLAN', payload)
    }
  }

  @Action
  async deletePlace(payload: string) {
    this.context.commit('DELETE_PLACE', payload)
  }

  @Action
  async deleteTask(payload: string) {
    this.context.commit('DELETE_TASK', payload)
  }

  @Action
  async deletePlan(payload: string) {
    const plan: Plan | undefined = this.context.getters['findPlan'](payload)
    if (plan && !plan.default) {
      this.context.commit('DELETE_PLAN', payload)
    }
  }

  @Action
  async doCleaning(payload: string) {
    this.context.commit('DO_CLEANING', payload)
  }
}
