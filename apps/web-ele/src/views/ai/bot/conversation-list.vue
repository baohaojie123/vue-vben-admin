<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const MOCK_TABLE_DATA = [
  {
    id: '7493378135753490447',
  },
  {
    id: '7493378109140598821',
  },
  {
    id: '7493377597582360628',
  },
  {
    id: '7491503250189991974',
  },
  {
    id: '7491219172719050804',
  },
  {
    id: '7491129678737178662',
  },
  {
    id: '7490758380554993664',
  },
  {
    id: '7490758162916720677',
  },
  {
    id: '7490758094914519080',
  },
];
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
  id: string;
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
    { field: 'id', title: '会话ID' },
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
        <ElButton type="primary" @click="handleViewMessageList(row.id)">
          消息列表
        </ElButton>
        <ElButton type="primary">查看</ElButton>
      </template>
    </Grid>
  </Page>
</template>
