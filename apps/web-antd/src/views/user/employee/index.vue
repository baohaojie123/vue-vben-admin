<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getChainGroupListApi,
  getChainListApi,
  getEmployeeListApi,
  getShopListApi,
} from '#/api';

import FormEmployee from './form-employee.vue';

interface RowType {
  chainDeptName: string;
  shopDeptName: string;
  realName: string;
  username: string;
  userNo: string;
  status: string;
  statusDisplay: string;
}
const chainOptions = ref<{ label: string; value: string }[]>([]);

const getChainList = async (value: string, groupDeptId: string) => {
  const options = await getChainListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    groupDeptId,
  });
  // 假设接口支持关键词参数
  chainOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const shopOptions = ref<{ label: string; value: string }[]>([]);
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
const handleChainSearch = async (value: string, groupDeptId: string) => {
  await getChainList(value, groupDeptId);
};
const handleShopSearch = async (value: string, chainDeptId: string) => {
  await getShopList(value, chainDeptId);
};

const chainGroupOptions = ref<{ label: string; value: string }[]>([]);

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
const handleChainGroupSearch = async (value: string) => {
  await getChainGroupList(value);
};
getChainGroupList('');
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Select',
      fieldName: 'groupDeptId',
      label: '连锁集团公司',
      defaultValue: '',
      componentProps: () => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: chainGroupOptions.value,
        onSearch: handleChainGroupSearch,
        placeholder: '请输入连锁集团公司',
      }),
    },
    {
      component: 'Select',
      fieldName: 'chainDeptId',
      label: '连锁',
      defaultValue: '',
      componentProps: (values) => {
        return {
          allowClear: true,
          showSearch: true,
          filterOption: false,
          options: chainOptions.value,
          onSearch: handleChainSearch,
          placeholder: '请输入搜索',
          disabled: !values.groupDeptId,
        };
      },
      dependencies: {
        trigger(values) {
          handleChainSearch('', values.groupDeptId);
        },
        triggerFields: ['groupDeptId'],
      },
    },
    {
      component: 'Select',
      fieldName: 'shopDeptId',
      label: '门店',
      defaultValue: '',
      componentProps: (values) => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: shopOptions.value,
        onSearch: (value: string) =>
          handleShopSearch(value, values.chainDeptId),
        placeholder: '请输入搜索',
        disabled: !values.chainDeptId,
      }),
      dependencies: {
        trigger(values) {
          handleShopSearch('', values.chainDeptId);
          values.shopDeptId = '';
        },
        triggerFields: ['chainDeptId'],
      },
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
    { field: 'chainDeptName', title: '连锁' },
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
