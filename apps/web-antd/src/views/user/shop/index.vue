<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getShopListApi, getStoreListApi } from '#/api';

import FormShop from './form-shop.vue';

interface RowType {
  id: string;
  storeDeptId: string;
  storeDeptName: string;
  name: string;
  status: string;
  statusDisplay: string;
}
const storeOptions = ref([]);

const getStoreList = async (value: string) => {
  const options = await getStoreListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
  });
  // 假设接口支持关键词参数
  storeOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const handleSearch = async (value: string) => {
  await getStoreList(value);
};
getStoreList('');
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      fieldName: 'storeDeptId',
      label: '连锁名称',
      defaultValue: '',
      componentProps: () => {
        return {
          showSearch: true,
          filterOption: false,
          options: storeOptions,
          onSearch: handleSearch,
          placeholder: '请输入搜索',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '门店名称',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: [
          { label: '已启用', value: 'OPEN' },
          { label: '已禁用', value: 'CLOSE' },
        ],
      },
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { field: 'id', title: '门店ID' },
    { field: 'storeDeptId', title: '连锁ID' },
    { field: 'storeDeptName', title: '连锁名称' },
    { field: 'name', title: '门店名称' },
    { field: 'statusDisplay', title: '状态' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 100,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getShopListApi({
          pageAsc: false,
          pageCurrent: page.currentPage,
          pageSearchCount: true,
          pageSize: page.pageSize,
          ...formValues,
        });
        res.records.map((item: any) => {
          item.statusDisplay = item.status === 'OPEN' ? '已启用' : '已禁用';
          return item;
        });

        return { items: res.records, total: res.total };
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const [FormModel, formModalApi] = useVbenModal({
  connectedComponent: FormShop,
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});
function openFormModal() {
  formModalApi.setData(null).open();
}
function handleEdit(row: RowType) {
  formModalApi.setData(row).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormModel />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="openFormModal"> 新增门店 </Button>
      </template>
      <template #action="{ row }">
        <Button type="primary" class="ml-2" @click="handleEdit(row)">
          编辑
        </Button>
      </template>
    </Grid>
  </Page>
</template>
