<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import FormModalDemo from './form-modal-demo.vue';

const MOCK_TABLE_DATA = Array.from({ length: 100 }, (_, index) => ({
  bot_id: `7480364835252453402 ${index}`,
  bot_name: `AZ-店员 ${index}`,
  description: `AZ-店员是一位亲切专业的药店店员，通过角色扮演对话提升患者沟通技巧。扮演店员/药师角色，耐心倾听患者需求，用通俗语言交流，帮助用户提高沟通能力。始终友善专业，提供耐心回答，助您成为沟通高手。 ${index}`,
  publish_time: '2024-10-14T00:09:22.236Z',
}));
const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
async function getExampleTableApi(params: any) {
  return new Promise<{ items: any; total: number }>((resolve) => {
    const { page, pageSize } = params;
    const items = MOCK_TABLE_DATA.slice((page - 1) * pageSize, page * pageSize);
    sleep(1000).then(() => {
      resolve({
        total: MOCK_TABLE_DATA.length,
        items,
      });
    });
  });
}
interface RowType {
  bot_id: string;
  bot_name: string;
  description: string;
  publish_time: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '1',
      fieldName: 'category',
      label: 'Category',
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: 'ProductName',
    },
    {
      component: 'Input',
      fieldName: 'price',
      label: 'Price',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'Color1',
            value: '1',
          },
          {
            label: 'Color2',
            value: '2',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'color',
      label: 'Color',
    },
    {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
      },
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
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
    { field: 'bot_id', title: 'ID' },
    { field: 'bot_name', title: '名称' },
    { field: 'description', title: '描述' },
    {
      field: 'publish_time',
      formatter: 'formatDateTime',
      title: '发布时间',
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 160,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
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
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});
function openFormModal() {
  formModalApi
    .setData({
      // 表单值
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal />
    <Grid>
      <template #toolbar-actions>
        <ElButton type="primary" @click="openFormModal"> 新增智能体 </ElButton>
      </template>
      <template #action>
        <ElButton type="primary">体验</ElButton>
        <ElButton type="primary">查看</ElButton>
      </template>
    </Grid>
  </Page>
</template>
