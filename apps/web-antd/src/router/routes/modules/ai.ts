import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'tdesign:animation-1',
      keepAlive: true,
      order: 1000,
      title: $t('page.ai.title'),
    },
    name: 'AI',
    path: '/ai',
    children: [
      {
        meta: {
          title: $t('page.ai.bot'),
        },
        name: 'Bot',
        path: '/ai/bot',
        component: () => import('#/views/ai/bot/index.vue'),
      },
      {
        meta: {
          title: $t('page.ai.conversationList'),
          hideInMenu: true,
        },
        name: 'ConversationList',
        path: '/ai/bot/conversation-list',
        component: () => import('#/views/ai/bot/conversation-list.vue'),
      },
      {
        meta: {
          title: $t('page.ai.conversationList'),
          hideInMenu: true,
        },
        name: 'Az4ConversationList',
        path: '/ai/bot/az4-conversation-list',
        component: () => import('#/views/ai/bot/az4-conversation-list.vue'),
      },
      {
        meta: {
          title: $t('page.ai.messageList'),
          hideInMenu: true,
        },
        name: 'MessageList',
        path: '/ai/bot/message-list',
        component: () => import('#/views/ai/bot/message-list.vue'),
      },
      // {
      //   meta: {
      //     title: $t('page.ai.vueflow'),
      //   },
      //   name: 'Vueflow',
      //   path: '/ai/careflow/vueflow',
      //   component: () => import('../../../views/ai/careflow/vueflow.vue'),
      // },
    ],
  },
];

export default routes;
