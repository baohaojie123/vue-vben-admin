import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    roleId: string;
    name: string;
    menuIdList: string[];
    description?: string;
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.post('/system/roles/search', params);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function editRole(data: SystemRoleApi.SystemRole) {
  return requestClient.post(`/system/roles/role`, data);
}

export { editRole, getRoleList };
