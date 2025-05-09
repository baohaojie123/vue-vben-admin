/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  // return requestClient.get<UserInfo>('/user/info');
  return {
    id: 0,
    realName: 'Vben',
    roles: ['super'],
    userName: 'vben',
  };
}
