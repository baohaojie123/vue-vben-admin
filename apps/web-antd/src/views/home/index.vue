<script lang="ts" setup>
import type { TabsProps } from 'ant-design-vue';

import type { AnalysisOverviewItem } from '@vben/common-ui';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { markRaw, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AnalysisOverview, Page } from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';
import { useUserStore } from '@vben/stores';

import { Button, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getEmployeeListApi, getOverviewApi, getStoreListApi } from '#/api';

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

const router = useRouter();

function handleEdit(row: RowType) {
  router.push({
    path: '/ai/bot/conversation-list',
    query: {
      userId: row.id,
    },
  });
}

const overviewItems = ref<AnalysisOverviewItem[]>([]);

const getOverview = async (params?: { enterpriseDeptId?: string }) => {
  const res = await getOverviewApi(params || {});
  if (res) {
    overviewItems.value = [
      {
        icon: markRaw(SvgCardIcon),
        title: '员工数',
        value: res.employeeCount,
      },
      {
        icon: markRaw(SvgCakeIcon),
        title: '已会话员工数',
        value: res.employeeConversedCount,
      },
      {
        icon: markRaw(SvgDownloadIcon),
        title: '未会话员工数',
        value: res.employeeNotConversedCount,
      },
      {
        icon: markRaw(SvgBellIcon),
        title: '会话次数',
        value: res.conversationCount,
      },
    ];
  }
};

const userStore = useUserStore();

getOverview({
  enterpriseDeptId: userStore.userInfo?.enterpriseDeptId,
});
</script>

<template>
  <Page auto-content-height>
    <AnalysisOverview
      :items="overviewItems"
      class="mb-3"
      v-if="overviewItems.length > 0"
    />
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
  </Page>
</template>
