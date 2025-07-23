import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Chat from '../components/Chat.vue';
import Cookies from 'js-cookie';

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Chat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Bảo vệ route: chỉ cho phép user đã đăng nhập vào trang chủ
router.beforeEach((to: any, _: any, next: any) => {
  const token = Cookies.get('token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;