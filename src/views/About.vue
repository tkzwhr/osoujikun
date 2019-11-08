<template>
  <div class="about">
    <ul>
      <li v-for="place in placesStore.places" :key="place.id">
        {{place.name}} ({{place.id}})
        <ul>
          <li v-for="task in place.tasks" :key="task.id">
            {{task.name}} ({{task.id}})
            <ul>
              <li v-for="plan in task.plans" :key="plan.id">
                {{plan.name}} ({{plan.id}})
                <ul>
                  <li>{{plan.interval}}</li>
                  <li>{{plan.latest}}</li>
                  <li>{{plan.memo}}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <hr/>
    <div>
      <button @click="placesStore.createPlace({name: 'sample place'})">Create a place</button>
    </div>
    <div>
      <button @click="placesStore.createTask({placeId: placesStore.places.slice(-1)[0].id, name: 'sample task', interval: 14, memo: 'default memo'})">Create a task</button>
    </div>
    <div>
      <button @click="placesStore.createPlan({taskId: placesStore.places.slice(-1)[0].tasks.slice(-1)[0].id, name: 'sample plan', interval: 28, memo: 'default memo'})">Create a plan</button>
    </div>
    <div>
      <button @click="placesStore.updatePlace({targetId: placesStore.places.slice(-1)[0].id, name: 'sample updated place'})">Update a place</button>
    </div>
    <div>
      <button @click="placesStore.updateTask({targetId: placesStore.places.slice(-1)[0].tasks.slice(-1)[0].id, name: 'sample updated task', interval: 21, memo: 'default updated memo'})">Update a task</button>
    </div>
    <div>
      <button @click="placesStore.updatePlan({targetId: placesStore.places.slice(-1)[0].tasks.slice(-1)[0].plans.slice(-1)[0].id, name: 'sample updated plan', interval: 90, memo: 'default updated memo'})">Update a plan</button>
    </div>
    <div>
      <button @click="placesStore.deletePlace(placesStore.places.slice(-1)[0].id)">Delete a place</button>
    </div>
    <div>
      <button @click="placesStore.deleteTask(placesStore.places.slice(-1)[0].tasks.slice(-1)[0].id)">Delete a task</button>
    </div>
    <div>
      <button @click="placesStore.deletePlan(placesStore.places.slice(-1)[0].tasks.slice(-1)[0].plans.slice(-1)[0].id)">Delete a plan</button>
    </div>
    <div>
      <button @click="placesStore.doCleaning(placesStore.places.slice(-1)[0].tasks.slice(-1)[0].plans.slice(-1)[0].id)">DO CLEANING</button>
    </div>
    <hr/>
    <div>
      Target ID:
      <input v-model="targetId"><br/>
    </div>
    <div>
      <button @click="result = placesStore.findPlace(targetId)">Find place</button>
    </div>
    <div>
      <button @click="result = placesStore.findTask(targetId)">Find task</button>
    </div>
    <div>
      <button @click="result = placesStore.findPlan(targetId)">Find plan</button>
    </div>
    <div>
      Result:
      <span>{{result}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {getModule} from 'vuex-module-decorators'
  import PlacesModule from '@/store/places'

  @Component
  export default class HelloWorld extends Vue {
    placesStore = getModule(PlacesModule)

    targetId: string = ''
    result: string = ''
  }
</script>
