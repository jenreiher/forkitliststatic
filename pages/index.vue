<template lang="pug">
  ElContainer
    ElHeader(class="header" height="150px")
      h1
        | Read to fork it all?
      .header__navigation
        .header__cities.stack-10-horizontal
          template(v-for="(city) in cities")
            button(:class="{ 'header__cities--active': city === currentCity }" @click="setCurrentCity(city)")
              | {{city}}
        .header__types.stack-10-horizontal
          ElCheckboxGroup(v-model="selectedTypes")
            template(v-for="(type) in types")
              ElCheckbox(:label="type")
                | {{type}}
    ElMain
      .card-grid
        template(v-for="(place) in filterRestaurants(currentCity)")
          RestaurantCard(:restaurant="place" :selectedTypes="selectedTypes")
    ElFooter
      | Footer
</template>

<script>
export default {
  data() {
    return {
      restaurants: [],
      cities: [],
      types: ['breakfast', 'lunch', 'dinner', 'drinks', 'coffee', 'snacks'],
      selectedTypes: ['breakfast', 'lunch', 'dinner', 'drinks', 'coffee', 'snacks'],
      currentCity: 'Victoria'
    }
  },
  mounted() {
    this.fetchData().then((res) => {
      const data = res.data.body
      const cities = []

      data.forEach((restaurant) => {
        cities.includes(restaurant.city) ? null : cities.push(restaurant.city)
      })

      this.$data.restaurants = data
      this.$data.cities = cities.sort((a, b) => a.localeCompare(b))

      return 
    })
  },
  methods: {
    async fetchData() {
      const data = await this.$content('restaurants').fetch()
      return { data }
    },
    filterRestaurants(city) {
      const data = this.$data.restaurants.filter((restaurant) => {
        
        return restaurant.city === city
      })
      return data
    },
    setCurrentCity(city) {
      return this.currentCity = city
    }
  },
}
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  background: #ccc;
    font-family: system-ui, sans-serif;

}

.el-main {
  padding: 30px 40px;
}

button {
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  font-size: .9rem;
  font-family: inherit;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  padding: 0;
  cursor: pointer;
}

h1, h2, h3, h4, h5 {
  margin: 0;
}

.el-header, .el-footer {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-header {
  display: flex;
  flex-direction: column;
  margin: -10px -10px 30px -10px;
  height: 100px;
}

.header {
    padding: 20px 10px;

}

.header__navigation {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

}

.header__navigation > * {
  margin-bottom: 10px;
}

.header__cities > * {
  margin-right: 10px;
}

.stack-10-horizontal > * {
  margin-right: 10px;
}

.header__cities--active {
  font-weight: bold;
  border-bottom: 1px solid black;
}

.el-footer {
  margin: 30px -10px -10px  -10px; 
}

.el-container {
  flex-direction: column;
}

.card-grid {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  grid-template-rows: auto;
  gap: 70px 70px;
  align-items: center;
  grid-auto-rows: 1fr;

}

.u-mr--5 {
  margin-right: 5px;
}

.u-ml--5 {
  margin-left: 5px;
}

.u-mr--10 {
  margin-right: 10px;
}

.u-ml--10 {
  margin-left: 10px;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-nicely {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

i[class*="fa-"] {
  opacity: 0.85;
}
</style>