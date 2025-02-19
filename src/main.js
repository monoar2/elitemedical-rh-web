import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createPinia } from 'pinia';

// Theme configuration
const theme = {
    defaultTheme: 'light',
    themes: {
        light: {
            dark: false,
            colors: {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',
                background: '#FFFFFF',
            }
        },
        dark: {
            dark: true,
            colors: {
                primary: '#2196F3',
                secondary: '#B0BEC5',
                accent: '#FF4081',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',
                background: '#121212',
            }
        }
    }
};

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme, // Apply the custom theme
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');