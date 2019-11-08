export interface Place {
  id: string,
  name: string,
  tasks: Task[]
}

export interface Task {
  id: string,
  name: string,
  plans: Plan[]
}

export interface Plan {
  id: string,
  name: string,
  default: boolean,
  interval: number,
  latest: Date,
  memo: string
}

export interface CreatePlaceParams {
  name: string
}

export interface CreateTaskParams {
  placeId: string,
  name: string,
  interval: number,
  memo: string
}

export interface CreatePlanParams {
  taskId: string,
  name: string,
  interval: number,
  memo: string
}

export interface UpdatePlaceParams {
  targetId: string,
  name: string
}

export interface UpdateTaskParams {
  targetId: string,
  name: string,
  interval: number,
  memo: string
}

export interface UpdatePlanParams {
  targetId: string,
  name: string,
  interval: number,
  memo: string
}