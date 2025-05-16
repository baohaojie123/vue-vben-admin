import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:home',
      keepAlive: true,
      order: 0,
      title: $t('page.home.title'),
    },
    path: '/home',
    name: 'Home',
    component: () => import('#/views/home/index.vue'),
  },
];

export default routes;
