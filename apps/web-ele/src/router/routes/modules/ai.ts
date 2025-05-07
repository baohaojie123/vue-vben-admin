import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'tdesign:animation-1',
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
      {
        meta: {
          title: '会话列表',
          hideInMenu: true,
        },
        name: 'ConversationList',
        path: '/ai/bot/conversation-list',
        component: () => import('#/views/ai/bot/conversation-list.vue'),
      },
      {
        meta: {
          title: '消息列表',
          hideInMenu: true,
        },
        name: 'MessageList',
        path: '/ai/bot/message-list',
        component: () => import('#/views/ai/bot/message-list.vue'),
      },
      {
        meta: {
          title: 'vueflow',
        },
        name: 'Vueflow',
        path: '/ai/careflow/vueflow',
        component: () => import('../../../views/ai/careflow/vueflow.vue'),
      },
    ],
  },
];

export default routes;
