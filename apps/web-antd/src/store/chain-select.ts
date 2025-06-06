import { defineStore } from 'pinia';

export const useChainSelectStore = defineStore('chainSelect', {
  state: () => ({
    groupDeptId: undefined as string | undefined,
    chainDeptId: undefined as string | undefined,
    shopDeptId: undefined as string | undefined,
  }),
  actions: {
    setValues(values: {
      chainDeptId?: string;
      groupDeptId?: string;
      shopDeptId?: string;
    }) {
      this.groupDeptId = values.groupDeptId;
      this.chainDeptId = values.chainDeptId;
      this.shopDeptId = values.shopDeptId;
    },
  },
});
