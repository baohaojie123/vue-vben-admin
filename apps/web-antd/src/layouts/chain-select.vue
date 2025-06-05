<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useRefresh } from '@vben/hooks';

import { Select } from 'ant-design-vue';

import { getChainGroupListApi, getChainListApi, getShopListApi } from '#/api';
import { useChainSelectStore } from '#/store/chain-select';

const emit = defineEmits(['change']);
const chainSelectStore = useChainSelectStore();
const { refresh } = useRefresh();

const chainGroupOptions = ref<{ label: string; value: string }[]>([]);
const chainOptions = ref<{ label: string; value: string }[]>([]);
const shopOptions = ref<{ label: string; value: string }[]>([]);

const selectedValues = ref<{
  chainDeptId: string | undefined;
  groupDeptId: string | undefined;
  shopDeptId: string | undefined;
}>({
  groupDeptId: undefined,
  chainDeptId: undefined,
  shopDeptId: undefined,
});

// 获取连锁集团公司列表
const getChainGroupList = async (value: string) => {
  const options = await getChainGroupListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
  });
  chainGroupOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 获取连锁列表
const getChainList = async (value: string, groupDeptId: string) => {
  const options = await getChainListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    groupDeptId,
  });
  chainOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 获取门店列表
const getShopList = async (value: string, chainDeptId: string) => {
  const options = await getShopListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    chainDeptId,
  });
  shopOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 处理连锁集团公司搜索
const handleChainGroupSearch = async (value: string) => {
  await getChainGroupList(value);
};

// 处理连锁搜索
const handleChainSearch = async (value: string) => {
  if (selectedValues.value.groupDeptId) {
    await getChainList(value, selectedValues.value.groupDeptId);
  }
};

// 处理门店搜索
const handleShopSearch = async (value: string) => {
  if (selectedValues.value.chainDeptId) {
    await getShopList(value, selectedValues.value.chainDeptId);
  }
};

// 监听值变化
watch(
  () => selectedValues.value,
  (newVal) => {
    chainSelectStore.setValues(newVal);
    emit('change', { ...newVal });
    refresh();
  },
  { deep: true },
);

// 监听连锁集团公司变化
watch(
  () => selectedValues.value.groupDeptId,
  async (newVal) => {
    if (newVal) {
      await getChainList('', newVal);
    } else {
      chainOptions.value = [];
      selectedValues.value.chainDeptId = '';
      selectedValues.value.shopDeptId = '';
    }
  },
);

// 监听连锁变化
watch(
  () => selectedValues.value.chainDeptId,
  async (newVal) => {
    if (newVal) {
      await getShopList('', newVal);
    } else {
      shopOptions.value = [];
      selectedValues.value.shopDeptId = '';
    }
  },
);

// 初始化加载连锁集团公司列表
getChainGroupList('');
</script>

<template>
  <div class="chain-select mr-2">
    <Select
      v-model:value="selectedValues.groupDeptId"
      allow-clear
      show-search
      :filter-option="false"
      :options="chainGroupOptions"
      placeholder="请选择连锁集团公司"
      class="mb-2 w-full"
      @search="handleChainGroupSearch"
    />
    <Select
      v-model:value="selectedValues.chainDeptId"
      :disabled="!selectedValues.groupDeptId"
      allow-clear
      show-search
      :filter-option="false"
      :options="chainOptions"
      placeholder="请选择连锁"
      class="mb-2 w-full"
      @search="handleChainSearch"
      v-if="selectedValues.groupDeptId"
    />
    <Select
      v-model:value="selectedValues.shopDeptId"
      :disabled="!selectedValues.chainDeptId"
      allow-clear
      show-search
      :filter-option="false"
      :options="shopOptions"
      placeholder="请选择门店"
      class="w-full"
      @search="handleShopSearch"
      v-if="selectedValues.chainDeptId"
    />
  </div>
</template>

<style scoped>
.chain-select {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chain-select :deep(.ant-select) {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
  padding: 0;
  margin: 0;
}
</style>
