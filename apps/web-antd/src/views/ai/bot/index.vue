<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBotListApi } from '#/api';

import FormBot from './form-bot.vue';

const router = useRouter();

interface RowType {
  id: string;
  name: string;
  description: string;
  cozeBotIdList: string[];
  clBotSetting: Record<string, any>;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '智能体名称',
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: '智能体描述',
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
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'name', title: '名称' },
    { field: 'description', title: '描述' },

    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 240,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getBotListApi({
          pageAsc: false,
          pageCurrent: page.currentPage,
          pageSearchCount: true,
          pageSize: page.pageSize,
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const [FormModel, formModalApi] = useVbenModal({
  connectedComponent: FormBot,
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});
function openFormModal() {
  formModalApi.setData(null).open();
}
function handleViewConversationList(id: string) {
  router.push({
    path: '/ai/bot/conversation-list',
    query: {
      id,
    },
  });
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
        <Button type="primary" @click="openFormModal"> 新增智能体 </Button>
      </template>
      <template #action="{ row }">
        <Button type="primary">体验</Button>
        <Button
          type="primary"
          @click="handleViewConversationList(row.id)"
          class="ml-2"
        >
          查看
        </Button>
        <Button type="primary" class="ml-2" @click="handleEdit(row)">
          编辑
        </Button>
      </template>
    </Grid>
  </Page>
</template>
