import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: 'AI',
    },
    name: 'AI',
    path: '/ai',
    children: [
      {
        meta: {
          title: '智能体广场',
        },
        name: 'Bot',
        path: '/ai/bot',
        component: () => import('#/views/ai/bot/index.vue'),
      },
    ],
  },
];

export default routes;
