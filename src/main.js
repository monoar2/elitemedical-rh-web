import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserMinus, faRightFromBracket, faUser, faAddressCard, faPlaneDeparture, faHotel, faSyringe, faSackDollar, faSackXmark, faHouseLaptop } from '@fortawesome/free-solid-svg-icons';

import { createPinia } from 'pinia';
import { useEmployeeStore } from "@/store/employee.js";

library.add(faUserMinus, faRightFromBracket, faUser, faAddressCard, faPlaneDeparture, faHotel, faSyringe, faSackDollar, faSackXmark, faHouseLaptop);

const theme = {
    defaultTheme: 'light',
    themes: {
        light: {
            dark: true,
            colors: {
                primary: '#1a75b6',
                secondary: '#424242',
                accent: '#4a7fd9',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',
                background: '#FFFFFF',
            }
        }
    }
};

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: 'es',
        fallback: 'en',
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme,
});

const pinia = createPinia();
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(pinia);

const employeeStore = useEmployeeStore();
employeeStore.loadSession();

app.use(vuetify);
app.mount('#app');