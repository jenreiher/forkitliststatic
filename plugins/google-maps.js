import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAFt44UWsHFpM9gjrKg14UCtDmo-nmIbrI",
    libraries: ["places", "geocoder"]
  }
});
