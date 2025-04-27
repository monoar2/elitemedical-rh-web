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
import {
    faUserMinus,
    faRightFromBracket,
    faUser,
    faAddressCard,
    faPlaneDeparture,
    faHotel,
    faSyringe,
    faSackDollar,
    faSackXmark,
    faHouseLaptop,
    faEye,
    faEyeSlash,
    faCalendar,
    faCalendarDay,
    faCalendarWeek,
    faCalendarCheck,
    faCalendarAlt,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { createPinia } from 'pinia';
import { useEmployeeStore } from "@/store/employee.js";

library.add(
    faUserMinus,
    faRightFromBracket,
    faUser,
    faAddressCard,
    faPlaneDeparture,
    faHotel,
    faSyringe,
    faSackDollar,
    faSackXmark,
    faHouseLaptop,
    faEye,
    faEyeSlash,
    faCalendar,
    faCalendarDay,
    faCalendarWeek,
    faCalendarCheck,
    faCalendarAlt,
    faComment
);

const theme = {
    defaultTheme: 'dark',
    themes: {
        light: {
            dark: false, // Changed to false since this is a light theme
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
    theme,
    icons: {
        defaultSet: 'mdi', // Keep MDI as default
        aliases,
        sets: {
            mdi,
            // Add Font Awesome as an additional icon set
            fa: {
                component: FontAwesomeIcon,
            }
        }
    },
    locale: {
        locale: 'es',
        fallback: 'en',
    },
});

const pinia = createPinia();
const app = createApp(App);

// Register FontAwesomeIcon globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Use plugins
app.use(router);
app.use(pinia);
app.use(vuetify);

// Initialize employee store
const employeeStore = useEmployeeStore();
employeeStore.loadSession();

app.mount('#app');