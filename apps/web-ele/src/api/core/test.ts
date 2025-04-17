import { requestClient } from '#/api/request';

/**
 * 获取总览测试数据
 */
export async function getTotalDataApi(params: any) {
  return requestClient.get(
    '/cl-suizhen/careflow/mult/hospital/groups/stat/total',
    { params },
  );
}
