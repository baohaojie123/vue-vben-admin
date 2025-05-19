import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 获取总览统计
async function getOverviewApi(params: Recordable<any>) {
  return requestClient.post('/az4/stats/overview', params);
}

export { getOverviewApi };
