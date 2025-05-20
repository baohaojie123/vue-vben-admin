<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getEmployeeListApi, getShopListApi, getStoreListApi } from '#/api';

import FormEmployee from './form-employee.vue';

interface RowType {
  storeDeptName: string;
  shopDeptName: string;
  realName: string;
  username: string;
  userNo: string;
  status: string;
  statusDisplay: string;
}
const storeOptions = ref<{ label: string; value: string }[]>([]);

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
const shopOptions = ref<{ label: string; value: string }[]>([]);
const getShopList = async (value: string) => {
  const options = await getShopListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
  });
  shopOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const handleSearchStore = async (value: string) => {
  await getStoreList(value);
};
const handleSearchShop = async (value: string) => {
  await getShopList(value);
};
getStoreList('');
getShopList('');
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      fieldName: 'storeDeptId',
      label: '连锁',
      defaultValue: '',
      componentProps: () => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: storeOptions.value,
        onSearch: handleSearchStore,
        placeholder: '请输入搜索',
      }),
    },
    {
      component: 'Select',
      fieldName: 'shopDeptId',
      label: '门店',
      defaultValue: '',
      componentProps: () => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: shopOptions.value,
        onSearch: handleSearchShop,
        placeholder: '请输入搜索',
      }),
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '姓名',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '账号',
    },
    {
      component: 'Input',
      fieldName: 'userNo',
      label: '工号',
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
    { field: 'storeDeptName', title: '连锁' },
    { field: 'shopDeptName', title: '门店' },
    { field: 'realName', title: '姓名' },
    { field: 'username', title: '账号' },
    { field: 'userNo', title: '工号' },
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
        const res = await getEmployeeListApi({
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
  connectedComponent: FormEmployee,
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
        <Button type="primary" @click="openFormModal"> 新增员工 </Button>
      </template>
      <template #action="{ row }">
        <Button type="primary" class="ml-2" @click="handleEdit(row)">
          编辑
        </Button>
      </template>
    </Grid>
  </Page>
</template>
