import nanoid from 'nanoid'
import dayjs from 'dayjs'
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators'
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
  return places.flatMap(v => v.tasks)
      .find(v => v.id === id)
}

function _findPlan(places: Place[], id: string): Plan | undefined {
  return places.flatMap(v => v.tasks)
      .flatMap(v => v.plans)
      .find(v => v.id === id)
}

@Module({
  namespaced: true,
  name: 'places'
})
export default class PlacesModule extends VuexModule {
  places: Place[] = []

  get hasPlaces(): boolean {
    return this.places.length > 0
  }

  get hasRecommendPlaces(): boolean {
    return this.listRecommendPlaces.length > 0
  }

  get listRecommendPlaces(): Place[] {
    return this.places.flatMap(v => {
      const tasks = v.tasks.flatMap(vv => {
        if (vv.plans.length === 0) {
          const isExpired = !vv.plan.latest || dayjs().diff(dayjs(vv.plan.latest), 'day') >= vv.plan.interval
          return isExpired ? [vv] : []
        } else {
          const plans = vv.plans.filter(vvv =>
            !vvv.latest || dayjs().diff(dayjs(vvv.latest), 'day') >= vvv.interval
          )
          return plans.length > 0 ? [{...vv,plans}] : []
        }
      })
      return tasks.length > 0 ? [{...v,tasks}] : []
    })
  }

  get findPlace(): (placeId: string) => Place | undefined {
    return (placeId: string) => _findPlace(this.places, placeId)
  }

  get findPlaceByTask(): (taskId: string) => Place | undefined {
    return (taskId: string) => this.places
        .find(v => v.tasks.find(vv => vv.id === taskId) !== undefined)
  }

  get findTask(): (taskId: string) => Task | undefined {
    return (taskId: string) => _findTask(this.places, taskId)
  }

  get findTaskByPlan(): (planId: string) => Task | undefined {
    return (planId: string) => this.places
        .flatMap(v => v.tasks)
        .find(v => v.plans.find(vv => vv.id === planId) !== undefined)
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
        plan: {
          id: nanoid(),
          name: '',
          interval: payload.interval,
          latest: null,
          memo: payload.memo
        },
        plans: []
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
        interval: payload.interval,
        latest: null,
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
      task.plan.interval = payload.interval
      task.plan.memo = payload.memo
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
    const plan = this.places
        .flatMap(v => v.tasks)
        .flatMap(v => v.plans.concat(v.plan))
        .find(v => v.id === payload)
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
    this.context.commit('UPDATE_PLAN', payload)
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
    this.context.commit('DELETE_PLAN', payload)
  }

  @Action
  async doCleaning(payload: string) {
    this.context.commit('DO_CLEANING', payload)
  }
}
