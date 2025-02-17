import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { createPinia } from 'pinia'

const vuetify = createVuetify();
const pinia = createPinia()


const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(pinia);
app.mount('#app');
