import Vue from 'vue';
import VueMask from 'v-mask';

Vue.use(VueMask);

Vue.directive('mask-date', {
  bind(el) {
    el.setAttribute('mask', '##/##/####');
  }
});
