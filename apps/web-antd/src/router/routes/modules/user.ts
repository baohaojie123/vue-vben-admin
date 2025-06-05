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
          title: $t('page.user.chainGroup'),
        },
        name: 'ChainGroup',
        path: '/user/chainGroup',
        component: () => import('#/views/user/chain-group/index.vue'),
      },
      {
        meta: {
          title: $t('page.user.chain'),
        },
        name: 'Chain',
        path: '/user/chain',
        component: () => import('#/views/user/chain/index.vue'),
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
