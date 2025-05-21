<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { useQRCode } from '@vueuse/integrations/useQRCode';
import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBotListApi } from '#/api';

import FormBot from './form-bot.vue';

const router = useRouter();

interface RowType {
  id: string;
  name: string;
  description: string;
  h5Url: string;
  cozeBotIdList: string[];
  clBotSetting: Record<string, any>;
}

// 体验二维码
const targetUrl = ref('');

const qrcode = useQRCode(targetUrl, {
  errorCorrectionLevel: 'H',
  margin: 4,
});

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
const [QrcodeModal, QrcodeModalApi] = useVbenModal({
  title: '智能体体验',
  confirmText: '关闭',
  showCancelButton: false,
  class: 'w-[600px]',
  onBeforeClose: () => {
    return new Promise((resolve) => {
      targetUrl.value = '';
      qrcode.value = '';
      resolve(true);
    });
  },
  onConfirm: () => {
    QrcodeModalApi.close();
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

// 体验事件
async function handleExperience(row: RowType) {
  // 使用useQRCode生成二维码
  targetUrl.value = row.h5Url;
  // 等待一小段时间确保二维码生成完成
  await new Promise((resolve) => setTimeout(resolve, 100));
  QrcodeModalApi.open();
}
// 处理targetUrl判断的逻辑
function isUrlValid() {
  const url = targetUrl.value;
  const isEmpty = !url;

  return {
    isEmpty,
    iconType: isEmpty ? 'warning' : 'success',
    tipText: isEmpty
      ? 'H5链接为空，请先设置H5链接'
      : '请使用手机扫描下方二维码',
    showQRCode: !isEmpty,
  };
}
</script>

<template>
  <Page auto-content-height>
    <FormModel />
    <QrcodeModal>
      <div>
        <p class="text-center">{{ isUrlValid().tipText }}</p>
        <img
          v-if="isUrlValid().showQRCode"
          :src="qrcode"
          alt="qrcode"
          class="mx-auto block w-[200px]"
        />
      </div>
    </QrcodeModal>
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="openFormModal"> 新增智能体 </Button>
      </template>
      <template #action="{ row }">
        <Button type="primary" @click="handleExperience(row)">体验</Button>
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
