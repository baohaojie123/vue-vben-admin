<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({
  name: 'MessageList',
});

interface RowType {
  id: string;
  clBotId: string;
  cozeBotId: string;
  createTime: string;
  name: string;
  userId: string;
}
const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { field: 'id', title: 'Coze会话ID' },
    { field: 'clBotId', title: 'cl智能体ID' },
    { field: 'cozeBotId', title: 'coze智能体ID' },
    { field: 'userId', title: 'Coze会话userId' },
    { field: 'name', title: '会话名称' },
    { field: 'createTime', title: '创建时间' },
  ],
  // data: [],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {},
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
  gridOptions,
});

// const route = useRoute();
</script>
<template>
  <Page>
    <Grid />
  </Page>
</template>
