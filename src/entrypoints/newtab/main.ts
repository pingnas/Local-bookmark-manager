import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import 'normalize.css';
import { createApp } from 'vue';
import App from './App';
import './style.scss';


createApp(App)
    .use(ContextMenu)
    .mount('#app')
