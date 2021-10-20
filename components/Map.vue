<template lang="pug">
    GoogleMap(id="map" ref="Map")
        
</template>
<script>
export default {
  data() {
    return {
      showInfo: false,
      infoWindowContext: {
        position: {
          lat: 44.2899,
          lng: 11.8774
        }
      }
    };
  },
  methods: {
    toggleInfoWindow(context) {
      this.infoWindowContext = context;
      this.showInfo = true;
    },
    infoClicked(context) {
      console.log(context);
    }
  }
};
</script>
