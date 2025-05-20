import { requestClient } from '#/api/request';

// 获取总览统计
async function getOverviewApi(enterpriseDeptId?: string) {
  return requestClient.post(
    `/az4/stats/overview?enterpriseDeptId=${enterpriseDeptId}`,
  );
}

export { getOverviewApi };
