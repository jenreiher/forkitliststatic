<template lang="pug">
    div
        GmapMap(
            id="map" 
            ref="Map" 
            :zoom="13"
            :center="center"
            style="height: 400px; width: 100%; margin: 30px 0;"
        )
            GmapMarker(
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :icon="m.icon"
                @click="toggleInfoWindow(m,index)"
                :clickable="m.clickable"
                :animation='2'
            )
            GmapInfoWindow(
                :options="infoOptions" 
                :position="infoWindowPos" 
                :opened="infoWinOpen" 
                @closeclick="infoWinOpen=false"
            )

        
        
</template>
<script>
export default {
  props: {
    restaurants: {
      type: Array,
      default: () => []
    },
    homebase: {
      type: String,
      default: "2500 Bay St., Victoria BC, V8T 1S7, Canada"
    }
  },
  data() {
    return {
      currentPlace: null,
      center: { lat: 48.4284, lng: -123.3656 },
      markers: [],
      places: [],
      infoWindowPos: null,
      infoWinOpen: false,
      infoOptions: {
        content: "",
        //optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    };
  },
  watch: {
    restaurants: {
      handler(newData, oldData) {
        this.addRestaurants(this.restaurants);
      }
    },
    homebase: {
      handler(newData, oldData) {
        const iconUrl = "/office.svg";
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: newData
        }).then((result) => {
          const { results } = result;
          
          return results;
        })
        .then((data) => {
          const currentPosition = {
            position: data[0].geometry.location,
            icon: iconUrl,
            clickable: false
          };
          this.addMarker(currentPosition)
          return data          
        })
        .then((data) => {
          return this.center = data[0].geometry.location
        })
        .catch((e) => {
          alert("Geocode was not successful for the following reason: " + e);
        });
      }
    },
  },
  mounted() {
    this.geolocate();

    const iconUrl = "/office.svg";

    this.geocode({ address: this.homebase, icon: iconUrl, clickable: false });
    let data = this.restaurants;
    this.addRestaurants(data);
  },
  methods: {
    addRestaurants(data) {
      if (data.length > 0) {
        data.forEach((element, i) => {
          setTimeout(() => {
            this.geocode(data[i]);
          }, i * 750);  // one sec interval
          if(i === 82) {
            console.log("done")
          }
        });
      }
    },
    toggleInfoWindow: function(marker, idx) {
      if (marker.clickable === true) {
        this.infoWindowPos = marker.position;
        this.infoOptions.content = `<p><strong>${marker.name}</strong><br>${marker.description}</p><a href="https://www.google.com/maps/search/${marker.address} ${marker.city} ${marker.region} ${marker.country}" target="_blank">${marker.address} >></a>`;

        //check if its the same marker that was selected if yes toggle
        if (this.currentMidx == idx) {
          this.infoWinOpen = !this.infoWinOpen;
        }
        //if different marker set infowindow to open and reset current marker index
        else {
          this.infoWinOpen = true;
          this.currentMidx = idx;
        }
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let currentPosition = {
          position: this.center,
          icon: "/person.svg",
          clickable: false
        };
        this.addMarker(currentPosition);
      });
    },
    geocode(restaurant) {
      let position = {};
      let address = restaurant.address;

      this.places.forEach(function(item) {
        if (
          item.name === restaurant.name &&
          item.address === restaurant.address
        ) {
          restaurant = item;
        }
      });

      if (!restaurant.position) {
        this.$gmapApiPromiseLazy().then(() => {
          const geocoder = new google.maps.Geocoder();

          geocoder
            .geocode({ address }, function(results, status) {})
            .then(data => {
              if (!!data.results[0].geometry.location) {
                const latitude = data.results[0].geometry.location.lat();
                const longitude = data.results[0].geometry.location.lng();

                position = this.currentPosition = {
                  lat: latitude,
                  lng: longitude
                };

                restaurant.position = position;
                restaurant.clickable =
                  restaurant.clickable === false ? false : true;
              }

              return this.addMarker(restaurant);
            });
        });
      } else {
        this.addMarker(restaurant);
      }
    },
    addMarker(restaurant) {
      if (!this.markers.includes(restaurant)) {
        this.markers.push(restaurant);
      }
      if (!this.places.includes(restaurant)) {
        this.places.push(restaurant);
      }
    }
  }
};
</script>
