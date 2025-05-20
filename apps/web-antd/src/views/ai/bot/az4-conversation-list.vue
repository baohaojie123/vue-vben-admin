<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAz4ConversationListApi } from '#/api';

const route = useRoute();
interface RowType {
  name: string;
  score: number;
  status: string;
  createTime: string;
  finishTime: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: () => ({
        placeholder: '请输入会话名称',
        allowClear: true,
      }),
      fieldName: 'name',
      label: '会话名称',
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
    { field: 'name', title: '会话名称' },
    { field: 'score', title: '评分' },
    { field: 'finishTime', title: '结束时间' },
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
        const res = await getAz4ConversationListApi({
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
          查看
        </Button>
      </template>
    </Grid>
  </Page>
</template>
