<script lang="ts" setup>
import type { TabsProps } from 'ant-design-vue';

import type { AnalysisOverviewItem } from '@vben/common-ui';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { AnalysisOverview, Page, useVbenModal } from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { Button, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getEmployeeListApi, getStoreListApi } from '#/api';

import FormEmployee from './form-employee.vue';

interface RowType {
  id: string;
  storeDeptId: string;
  storeDeptName: string;
  shopDeptId: string;
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

const handleSearchStore = async (value: string) => {
  await getStoreList(value);
};

getStoreList('');

const activeTab = ref<TabsProps['activeKey']>('practiced');

const handleTabChange = (key: TabsProps['activeKey']) => {
  activeTab.value = key;
  gridApi.reload();
};

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'region',
      label: '大区',
      componentProps: {
        placeholder: '请输入',
        allowClear: true,
      },
    },
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
      component: 'Input',
      fieldName: 'realName',
      label: '药师姓名',
      componentProps: {
        placeholder: '请输入姓名',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '药师手机号',
      componentProps: {
        placeholder: '请输入手机号',
        allowClear: true,
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
    { field: 'realName', title: '姓名' },
    { field: 'username', title: '手机号' },
    { field: 'storeDeptName', title: '连锁' },
    { field: 'region', title: '大区' },
    {
      field: 'conversationLastTime',
      title: '最近一次练习时间',
      formatter: 'formatDateTime',
    },
    { field: 'conversationCount', title: '已练习次数' },
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
          hasConversation: activeTab.value === 'practiced',
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
    slots: {
      buttons: 'toolbar-buttons',
    },
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

function handleEdit(row: RowType) {
  formModalApi.setData(row).open();
}

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '药师数量',
    totalTitle: '总药师数',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '练习次数',
    totalTitle: '总练习次数',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '已练习药师',
    totalTitle: '总已练习药师',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '未练习药师',
    totalTitle: '总未练习药师',
    totalValue: 50_000,
    value: 5000,
  },
];
</script>

<template>
  <Page auto-content-height>
    <div class="p-5">
      <AnalysisOverview :items="overviewItems" class="mb-5" />
      <FormModel />
      <Grid>
        <template #toolbar-buttons>
          <Tabs
            type="card"
            v-model:active-key="activeTab"
            @change="handleTabChange"
          >
            <Tabs.TabPane key="practiced" tab="已练习" />
            <Tabs.TabPane key="unpracticed" tab="未练习" />
          </Tabs>
        </template>
        <template #action="{ row }">
          <Button type="primary" class="ml-2" @click="handleEdit(row)">
            查看
          </Button>
        </template>
      </Grid>
    </div>
  </Page>
</template>
