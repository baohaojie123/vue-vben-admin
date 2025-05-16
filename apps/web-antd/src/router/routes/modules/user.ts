import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:user-avatar',
      keepAlive: true,
      order: 1000,
      title: $t('page.user.title'),
    },
    name: 'User',
    path: '/user',
    children: [
      {
        meta: {
          title: $t('page.user.store'),
        },
        name: 'Store',
        path: '/user/store',
        component: () => import('#/views/user/store/index.vue'),
      },
      {
        meta: {
          title: $t('page.user.shop'),
        },
        name: 'Shop',
        path: '/user/shop',
        component: () => import('#/views/user/shop/index.vue'),
      },
      {
        meta: {
          title: $t('page.user.employee'),
        },
        name: 'Employee',
        path: '/user/employee',
        component: () => import('#/views/user/employee/index.vue'),
      },
    ],
  },
];

export default routes;
