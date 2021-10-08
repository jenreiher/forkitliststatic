<template lang="pug">
ElCard(v-if="displayCard" class="box-card restaurant-card" shadow="hover")
    .restaurant-card__header(slot="header" class="clearfix")
        h2.restaurant-card__name(class="overflow-nicely")
            | {{restaurant.name}}
    h3.restaurant-card__description(v-if="restaurant.description")
        | {{restaurant.description}}
    .restaurant-card__address(v-if="restaurant.address")
        span
            i(class="fas fa-map-marker-alt u-mr--5")
            a(:href="searchLink" target="_blank")
                | {{restaurant.address}}
                i(class="fas fa-chevron-double-right u-ml--5")
    span.restaurant-card__url(v-if="restaurant.url" class="overflow-nicely")
        i(class="fas fa-link u-mr--5")
        a(:href="restaurant.url" target="_blank")
            | {{restaurant.url}}
            i(class="fas fa-chevron-double-right u-ml--5")
    .restaurant-card__types
        .restaurant-card__type
            span.restaurant-card__type-breakfast(v-if="restaurant.breakfast === 't'")
                i(class="far fa-egg-fried")
            span.restaurant-card__type-lunch(v-if="restaurant.lunch === 't'")
                i(class="far fa-sandwich")
            span.restaurant-card__type-dinner(v-if="restaurant.dinner === 't'")
                i(class="far fa-salad")
            span.restaurant-card__type-drinks(v-if="restaurant.drinks === 't'")
                i(class="far fa-glass-martini-alt")
            span.restaurant-card__type-coffee(v-if="restaurant.coffee === 't'")
                i(class="far fa-coffee-togo")
            span.restaurant-card__type-snacks(v-if="restaurant.snacks === 't'")
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
            default: []
        }
    },
    computed: {
        displayCard() {
            const myTypes = []
            this.restaurant.breakfast === 't' ? myTypes.push('breakfast') : null
            this.restaurant.lunch === 't' ? myTypes.push('lunch') : null
            this.restaurant.dinner === 't' ? myTypes.push('dinner') : null
            this.restaurant.drinks === 't' ? myTypes.push('drinks') : null
            this.restaurant.coffee === 't' ? myTypes.push('coffee') : null
            this.restaurant.snacks === 't' ? myTypes.push('snacks') : null
            
            const filteredArray = this.selectedTypes.filter(value => myTypes.includes(value));

            return filteredArray.length > 0
        },
        searchLink() {
           return `https://www.google.com/maps/search/${this.restaurant.address} ${this.restaurant.city} ${this.restaurant.region} ${this.restaurant.country}`
        }
    }
}
</script>
<style lang="scss">
.restaurant-card {
    height: 350px;
    max-height: 100%;
}

.restaurant-card__description {
    font-weight: 600;
}

.el-card__body {
    display: flex;
    flex-direction: column;
    height: calc(100% - 4em);
}

.el-card__body > * {
    margin-bottom: 10px;
}

.restaurant-card__types {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.restaurant-card__type {
    align-self: flex-end;
    font-size: 2.5rem;
}
.restaurant-card__type > * {
    margin-right: 15px;
    
}
</style>