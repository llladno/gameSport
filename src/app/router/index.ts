import {createRouter, createWebHistory} from 'vue-router'
import TaskListPage from "@pages/TaskListPage.vue";
import SettingsPage from "@pages/SettingsPage.vue";
import AboutPage from "@pages/AboutPage.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: TaskListPage
        },
        {
            path: '/settings',
            component: SettingsPage
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

export default router
