<template lang="pug">
  ElContainer
    ElHeader(class="header" height="auto")
      h1.title
        |ForkItList
      
      .header__navigation
        .header__cities
          template(v-for="(city) in cities")
            button(:class="{ 'header__cities--active': city === currentCity }" @click="setCurrentCity(city)")
              | {{city}}
        
    ElMain
      h2.subtitle
        | Read to fork it all?
      .types
          ElCheckboxGroup(v-model="selectedTypes" fill="#3d2b1f" text-color="#3d2b1f")
            template(v-for="(type) in types" class="type")
              ElCheckbox(:label="type" )
                span.type-icon
                  i(:class="getTypeIcon(type)")
                | {{type}}
      .card-grid
        template(v-for="(place) in filterRestaurants(currentCity)")
          RestaurantCard(:restaurant="place" :selectedTypes="selectedTypes")
    ElFooter
      
</template>

<script>
export default {
  data() {
    return {
      restaurants: [],
      cities: [],
      types: ["breakfast", "lunch", "dinner", "drinks", "coffee", "snacks"],
      typeIcons: {
        breakfast: "egg-fried",
        lunch: "sandwich",
        dinner: "salad",
        drinks: "glass-martini-alt",
        coffee: "coffee-togo",
        snacks: "cookie-bite"
      },
      selectedTypes: [
        "breakfast",
        "lunch",
        "dinner",
        "drinks",
        "coffee",
        "snacks"
      ],
      currentCity: "Victoria"
    };
  },
  mounted() {
    this.fetchData().then(res => {
      const data = res.data.body;
      const cities = [];

      data.forEach(restaurant => {
        cities.includes(restaurant.city) ? null : cities.push(restaurant.city);
      });

      this.$data.restaurants = data;
      this.$data.cities = cities.sort((a, b) => a.localeCompare(b));

      return;
    });
  },
  methods: {
    async fetchData() {
      const data = await this.$content("restaurants").fetch();
      return { data };
    },
    filterRestaurants(city) {
      const data = this.$data.restaurants.filter(restaurant => {
        return restaurant.city === city;
      });
      return data;
    },
    setCurrentCity(city) {
      return (this.currentCity = city);
    },
    getTypeIcon(type) {
      return `far fa-${this.typeIcons[type]}`;
    }
  }
};
</script>
<style lang="scss">
:root {
  --primary: #3d2b1f;
  --blue: #0f5e7f;
  --red: #f01206;
  --green: #8db600;
  --purple: #75005b;
  --orange: #ff8400;
  --pink: #f54c4d;
  --light-grey: #efefef;
  --medium-grey: #666;
  --dark-grey: #393939;
  --black: #36454f;
  --white: #fff;
}

@import url("https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@300;400;500;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  background: var(--light-grey);
  font-family: "Alegreya Sans", system-ui, sans-serif;
  color: var(--black);
}

.el-main {
  padding: 30px 20px;
}

button {
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  font-size: 0.9rem;
  font-family: inherit;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  padding: 0;
  cursor: pointer;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

h1 {
  font-size: 2.5em;
}

h2 {
  font-size: 1.25em;
}

a {
  text-decoration: none;
  color: var(--primary);
}

.el-header,
.el-footer {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-header {
  display: flex;
  flex-direction: column;
  margin: -10px -10px 20px -10px;
  padding: 30px;
  line-height: 1.5;
}

.title {
  margin-bottom: 20px;
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

.types {
  border-bottom: 1px solid var(--medium-grey);
  width: 100%;
  padding: 10px 0;
  line-height: 1.75;
  margin-bottom: 30px;
}

.type-icon {
  margin-right: 4px;
}

.el-checkbox {
  font-size: 16px;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--blue);
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: var(--blue);
  border-color: var(--blue);
}

.el-checkbox__inner:hover {
  border-color: var(--blue);
}

.el-footer {
  margin: 30px -10px -10px -10px;
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
  opacity: 0.8;
}
</style>
