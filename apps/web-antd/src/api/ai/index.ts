import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 分页查询智能体列表
async function getBotListApi(params: Recordable<any>) {
  return requestClient.post('/ai/coze/bots/search', params);
}

// 新增或修改智能体
async function mergeBotApi(params: Recordable<any>) {
  return requestClient.post('/ai/coze/bots/bot', params);
}

// 分页查询会话列表
async function getConversationListApi(params: Recordable<any>) {
  return requestClient.post('/ai/coze/conversations/search', params);
}

export { getBotListApi, getConversationListApi, mergeBotApi };
