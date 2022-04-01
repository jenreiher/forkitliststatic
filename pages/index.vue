<template lang="pug">
  ElContainer(v-if="dataLoaded")
    ElHeader(class="header" height="auto")
      h1.title
        span
          i(class="fas fa-utensils u-mr--10")
        | ForkItList
      
      .header__navigation
        .header__cities
          template(v-for="(city) in cities")
            button(:class="{ 'header__cities--active': city === currentCity }" @click="setCurrentCity(city)")
              | {{city}}
        
    ElMain
      h2.subtitle
        | Read to fork it all?
      ElSelect(v-if="alphaItineraries && alphaItineraries.length > 0" v-model="currentItinerary" class="u-mt--10" @change="updateItinerary")
        ElOption(
          key="all"
          label="All Restaurants"
          value="All"
        )
        ElOption(
          v-for="item in alphaItineraries"
          :key="item"
          :label="item"
          :value="item"
        )
          span
            i(v-if="!!getIcon(item)" :class="getIcon(item)" class="u-mr--10")
            i(v-else class="fas fa-utensils u-mr--10")
            | {{item}}
      .types
          ElCheckboxGroup(v-model="selectedTypes" fill="#3d2b1f" text-color="#3d2b1f" @change="updateTypes")
            template(v-for="(type) in types" class="type")
              ElCheckbox(:label="type" )
                span.type-icon
                  i(:class="getIcon(type)")
                | {{type}}
      
      Map(v-if="filterRestaurants.length > 0" :restaurants="filterRestaurants" :homebase="!!homebase(currentCity) ? homebase(currentCity) : currentCity")

      .card-grid
        template(v-if="filterRestaurants.length === 0")
          ElCard(class="empty-state")
            i(class="fal fa-frown-open" style="font-size:8em;")
            .empty-state__message
              | Unfortunately, there is no data that matches this set of options. Hopefully Jen will get that sorted soon.
        template(v-else v-for="(place) in filterRestaurants")
          RestaurantCard(:restaurant="place")
    ElFooter
      
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      restaurants: [],
      cities: ["Victoria"],
      types: ["breakfast", "lunch", "dinner", "drinks", "coffee", "snacks"],
      icons: {
        breakfast: "egg-fried",
        lunch: "sandwich",
        dinner: "salad",
        drinks: "glass-martini-alt",
        coffee: "coffee-togo",
        snacks: "cookie-bite",
        "Greatest Hits": "city",
        Seafood: "fish",
        "Brunch for Days": "egg-fried",
        "Craft Draught Beer": "beer",
        "Belly up to the Bar": "cocktail",
        "Cheap Eats": "dollar-sign",
        "Taco Party": "taco",
        "Dining out in Style": "hat-chef",
        "Gluten-free Friendly": "wheat",
        "Burgerz & Friez": "burger-soda",
        Vegetarian: "apple-alt",
        "Sweet Snacks": "pie",
        "Patio Life": "sunglasses",
        "Local Specialities": "map-marked"
      },
      selectedTypes: [
        "breakfast",
        "lunch",
        "dinner",
        "drinks",
        "coffee",
        "snacks"
      ],
      homebase: {
        Victoria: "777 Broughton St #201, Victoria, BC V8W 3H2",
        "San Francisco": "535 Mission St, San Francisco, CA 94105, United States"
      },
      currentCity: "Victoria",
      currentItinerary: "All",
      itineraries: {},
      dataLoaded: false
    };
  },
  mounted() {
    let itineraries = {};

    this.currentItinerary = this.$route.query.itinerary
      ? this.$route.query.itinerary
      : this.currentItinerary;

    let queryTypes = [];
    this.$route.query.breakfast ? queryTypes.push("breakfast") : null;
    this.$route.query.lunch ? queryTypes.push("lunch") : null;
    this.$route.query.dinner ? queryTypes.push("dinner") : null;
    this.$route.query.drinks ? queryTypes.push("drinks") : null;
    this.$route.query.coffee ? queryTypes.push("coffee") : null;
    this.$route.query.snacks ? queryTypes.push("snacks") : null;

    this.selectedTypes =
      queryTypes.length > 0 ? queryTypes : this.selectedTypes;

    this.fetchData().then(res => {
      const data = res.data.body;
      let cities = [];
      let itinerary = {};

      data.forEach(restaurant => {
        itinerary = { [restaurant.city]: [] };

        let split =
          restaurant.itineraries.split(",") != ""
            ? restaurant.itineraries.split(",").map(function(item) {
                return item.trim();
              })
            : [];

        cities.includes(restaurant.city) ? null : cities.push(restaurant.city);

        split.forEach(item => {
          itineraries[restaurant.city] &&
          itinerary[restaurant.city] &&
          (itinerary[restaurant.city].includes(item) ||
            itineraries[restaurant.city].includes(item))
            ? null
            : itinerary[restaurant.city].push(item);
        });

        function customizer(objValue, srcValue) {
          if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
          }
        }

        itineraries = _.mergeWith(itineraries, itinerary, customizer);
      });

      this.$data.restaurants = data;
      this.$data.cities = cities.sort((a, b) => a.localeCompare(b));
      this.$data.itineraries = itineraries;
      this.$data.dataLoaded = true;

      return;
    });
  },
  computed: {
    alphaItineraries() {
      const data = this.itineraries[this.currentCity]
        ? this.itineraries[this.currentCity].sort((a, b) => a.localeCompare(b))
        : null;

      return data;
    },
    filterRestaurants() {
      const data = this.restaurants
        .filter(restaurant => {
          return restaurant.city === this.currentCity;
        })
        .filter(restaurant => {
          return (
            (restaurant.breakfast === "Yes" &&
              this.selectedTypes.includes("breakfast")) ||
            (restaurant.lunch === "Yes" &&
              this.selectedTypes.includes("lunch")) ||
            (restaurant.dinner === "Yes" &&
              this.selectedTypes.includes("dinner")) ||
            (restaurant.drinks === "Yes" &&
              this.selectedTypes.includes("drinks")) ||
            (restaurant.coffee === "Yes" &&
              this.selectedTypes.includes("coffee")) ||
            (restaurant.snacks === "Yes" &&
              this.selectedTypes.includes("snacks"))
          );
        })
        .filter(restaurant => {
          const split = restaurant.itineraries.split(",").map(function(item) {
            return item.trim();
          });

          return (
            split.includes(this.currentItinerary) ||
            this.currentItinerary === "All"
          );
        });

      return data;
    }
  },
  methods: {
    async fetchData() {
      const data = await this.$content("restaurants").fetch();
      return { data };
    },
    updateItinerary(newItinerary) {
      window.history.pushState({}, "", `?itinerary=${newItinerary}`);
    },
    updateTypes(newTypes) {
      let state = "?";
      newTypes.forEach(type => {
        state += `${type}=true&`;
      });
      window.history.pushState({}, "", state);
    },
    setCurrentCity(city) {
      return (this.currentCity = city);
    },
    getIcon(type) {
      return this.icons[type] ? `far fa-${this.icons[type]}` : null;
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

*:focus-visible {
  outline: 2px dotted var(--red) !important;
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
  font-size: 1.6em;
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

.el-select {
  width: 300px;
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
  min-height: 35px;
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

.u-mt--10 {
  margin-top: 10px;
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

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  padding: 20px;

  &__message {
    margin-top: 20px;
  }
}
</style>
