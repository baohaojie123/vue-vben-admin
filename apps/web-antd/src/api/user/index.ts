import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 分页查询连锁集团公司列表
async function getChainGroupListApi(params: Recordable<any>) {
  return requestClient.post('/chain/groups/search', params);
}

// 新增或修改连锁集团公司
async function mergeChainGroupApi(params: Recordable<any>) {
  return requestClient.post('/chain/groups/group', params);
}

// 分页查询连锁列表
async function getChainListApi(params: Recordable<any>) {
  return requestClient.post('/chains/search', params);
}

// 新增或修改连锁
async function mergeChainApi(params: Recordable<any>) {
  return requestClient.post('/chains/store', params);
}

// 分页查询门店列表
async function getShopListApi(params: Recordable<any>) {
  return requestClient.post('/shops/search', params);
}
// 新增或修改门店
async function mergeShopApi(params: Recordable<any>) {
  return requestClient.post('/shops/shop', params);
}

// 分页查询员工列表
async function getEmployeeListApi(params: Recordable<any>) {
  return requestClient.post('/employees/search', params);
}

// 新增或修改员工
async function mergeEmployeeApi(params: Recordable<any>) {
  return requestClient.post('/employees/employee', params);
}

export {
  getChainGroupListApi,
  getChainListApi,
  getEmployeeListApi,
  getShopListApi,
  mergeChainApi,
  mergeChainGroupApi,
  mergeEmployeeApi,
  mergeShopApi,
};
