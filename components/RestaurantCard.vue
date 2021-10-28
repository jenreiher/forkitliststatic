<template lang="pug">
  ElCard(class="box-card restaurant-card" shadow="hover")
    .restaurant-card__header(slot="header" class="clearfix")
        h3.restaurant-card__name(class="overflow-nicely")
            | {{restaurant.name}}
    h4.restaurant-card__description(v-if="restaurant.description")
        | {{restaurant.description}}
    .restaurant-card__meta
        span.restaurant-card__address(v-if="restaurant.address" class="overflow-nicely")
                i(class="fas fa-map-marker-alt u-mr--10")
                a(:href="searchLink" target="_blank")
                    | {{restaurant.address}}
                    i(class="fas fa-chevron-double-right u-ml--5")
        span.restaurant-card__url(v-if="restaurant.url" class="overflow-nicely")
            i(class="fas fa-link u-mr--10")
            a(:href="restaurant.url" target="_blank")
                | {{getShortWebsite}}
                i(class="fas fa-chevron-double-right u-ml--5")
    .restaurant-card__types
        .restaurant-card__type
            span.restaurant-card__type-breakfast(v-if="restaurant.breakfast === 'Yes'")
                i(class="far fa-egg-fried")
            span.restaurant-card__type-lunch(v-if="restaurant.lunch === 'Yes'")
                i(class="far fa-sandwich")
            span.restaurant-card__type-dinner(v-if="restaurant.dinner === 'Yes'")
                i(class="far fa-salad")
            span.restaurant-card__type-drinks(v-if="restaurant.drinks === 'Yes'")
                i(class="far fa-glass-martini-alt")
            span.restaurant-card__type-coffee(v-if="restaurant.coffee === 'Yes'")
                i(class="far fa-coffee-togo")
            span.restaurant-card__type-snacks(v-if="restaurant.snacks === 'Yes'")
                i(class="far fa-cookie-bite")

</template>
<script>
export default {
  props: {
    restaurant: {
      type: Object,
      default: {}
    },
    selectedTypes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    searchLink() {
      return `https://www.google.com/maps/search/${this.restaurant.address} ${this.restaurant.city} ${this.restaurant.region} ${this.restaurant.country}`;
    },
    getShortWebsite() {
      let output = this.restaurant.url;
      output = output.replace("https://", "");
      output = output.replace("http://", "");
      output = output.replace("www.", "");
      output = output.substr(-1) === "/" ? output.slice(0, -1) : output;
      return output;
    }
  }
};
</script>
<style lang="scss">
.restaurant-card {
  height: 350px;
  max-height: 100%;
}

.restaurant-card__description {
  font-weight: 500;
  color: var(--dark-grey);
  margin-bottom: 30px;
}

.el-card__header {
  background-color: var(--primary);
  color: var(--white);
}

.el-card__body {
  display: flex;
  flex-direction: column;
  height: calc(100% - 4em);
}

.restaurant-card__meta {
  display: inline-flex;
  flex-direction: column;

  > * {
    margin-bottom: 15px;

    a:hover {
      text-decoration: underline;
    }
  }
}

.restaurant-card__types {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.el-card:hover .restaurant-card__types i {
  opacity: 1;
}

.restaurant-card__type {
  align-self: flex-end;
  font-size: 2.3rem;
  i {
    color: var(--blue);
  }
}
.restaurant-card__type > * {
  margin-right: 15px;
}

.fa-link,
.fa-map-marker-alt {
  color: var(--blue);
}
</style>
