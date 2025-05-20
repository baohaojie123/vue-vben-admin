import type { RouteRecordStringComponent } from '@vben/types';

import { useUserStore } from '@vben/stores';

import { requestClient } from '#/api/request';
/**
 * 根据角色ID列表获取菜单
 * @param roleId 角色ID列表
 */

export async function getAllMenusApi() {
  const userStore = useUserStore();
  const roleId = userStore.userInfo?.roleId;
  return requestClient.get<RouteRecordStringComponent[]>(
    `/system/menus/role?roleId=${roleId}`,
  );
}
