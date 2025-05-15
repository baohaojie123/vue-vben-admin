import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 分页查询连锁列表
async function getStoreListApi(params: Recordable<any>) {
  return requestClient.post('/stores/search', params);
}

// 新增或修改连锁
async function mergeStoreApi(params: Recordable<any>) {
  return requestClient.post('/stores/store', params);
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
  getEmployeeListApi,
  getShopListApi,
  getStoreListApi,
  mergeEmployeeApi,
  mergeShopApi,
  mergeStoreApi,
};
