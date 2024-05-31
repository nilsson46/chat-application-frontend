import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MessageView from '../views/MessageView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/message',
      name: 'message',
      component: MessageView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register','/message'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token'); 

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;