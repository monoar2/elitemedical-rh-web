import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

const vuetify = createVuetify();

const app = createApp(App);
app.use(router); // Use the router
app.use(vuetify);
app.mount('#app');
