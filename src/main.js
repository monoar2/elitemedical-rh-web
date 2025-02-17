import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { createPinia } from 'pinia';
import 'vuetify/dist/vuetify.min.css'

const vuetify = createVuetify({
    icons: {
        iconfont: 'mdi'
    }
});
const pinia = createPinia()


const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');
