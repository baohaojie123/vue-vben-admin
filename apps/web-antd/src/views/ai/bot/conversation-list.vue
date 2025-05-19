<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getConversationListApi } from '#/api';

const route = useRoute();
interface RowType {
  id: string;
  clBotId: string;
  cozeBotId: string;
  createTime: string;
  deptId1: string;
  deptId2: string;
  deptId3: string;
  name: string;
  userId: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'userId',
      label: '用户ID',
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'deptId1',
      label: '自定义部门ID1',
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'deptId2',
      label: '自定义部门ID2',
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'deptId3',
      label: '自定义部门ID3',
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
    { field: 'id', title: 'Coze会话ID' },
    { field: 'clBotId', title: 'cl智能体ID' },
    { field: 'cozeBotId', title: 'coze智能体ID' },
    { field: 'userId', title: 'Coze会话userId' },
    { field: 'deptId1', title: '自定义部门ID1' },
    { field: 'deptId2', title: '自定义部门ID2' },
    { field: 'deptId3', title: '自定义部门ID3' },
    { field: 'name', title: '会话名称' },
    { field: 'createTime', title: '创建时间' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 180,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (route.query.userId) {
          formValues.userId = route.query.userId;
        }
        const res = await getConversationListApi({
          pageAsc: false,
          pageCurrent: page.currentPage,
          pageSearchCount: true,
          pageSize: page.pageSize,
          clBotId: route.query.id,
          ...formValues,
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

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const router = useRouter();
function handleViewMessageList(id: string) {
  router.push({
    path: '/ai/bot/message-list',
    query: {
      id,
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <Button type="primary" @click="handleViewMessageList(row.id)">
          消息列表
        </Button>
        <Button type="primary" class="ml-2">查看</Button>
      </template>
    </Grid>
  </Page>
</template>
