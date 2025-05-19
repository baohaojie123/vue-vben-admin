<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

// import { Tag } from 'antd';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getConversationMsgListApi } from '#/api';

defineOptions({
  name: 'MessageList',
});

interface RowType {
  id: number;
  name: string;
  role: string;
  sex: string;
}

interface PAGINATION_MESSAHE_LIST {
  order: string; // 排序字段
  chatId: string; // 会话id
  beforeId: number | string; // 上一条消息id
  afterId: number | string; // 下一条消息id
  limit: number; // 每页数量
  hasMore: boolean; // 是否有更多
  isLoadAll: boolean; // 是否已经加载完 false 未加载完 true 加载完
}
const route = useRoute();

// 加载
const isLoading = ref(false);
// 分页
const pagination = ref({
  order: 'desc', // 排序字段
  chatId: '', // 会话id
  beforeId: 0, // 上一条消息id
  afterId: 0, // 下一条消息id
  hasMore: false, // 是否有更多
  limit: 20, // 每页数量
  isLoadAll: false, // 是否已经加载完
} as PAGINATION_MESSAHE_LIST);

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { type: 'seq', width: 70 },
    { field: 'id', title: 'ID' },
    { field: 'role', title: '角色', slots: { default: 'role' } },
    { field: 'content', title: '消息内容', minWidth: 400 },
    {
      field: 'created_at',
      title: '创建时间',
      width: 200,
    },
  ],
  data: [],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: false,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<RowType> = {
  scroll: ({ $event, scrollTop }) => {
    if (isLoading.value) return;

    // 获取表格容器元素
    const tableBody = $event.target as HTMLElement;
    const containerHeight = tableBody.clientHeight;
    const scrollHeight = tableBody.scrollHeight;

    // 当滚动到底部时触发
    const isBottom = scrollTop + containerHeight >= scrollHeight - 20;
    if (isBottom) {
      loadList();
    }
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});
// const dataList: RowType[] = [];
const dataList = ref<RowType[]>([]);
// 模拟行数据
const loadList = async () => {
  try {
    isLoading.value = true;
    // 是否已经加载完
    if (pagination.value.isLoadAll) {
      isLoading.value = false;
      return;
    }

    const form: {
      after_id?: number | string; // 下一条消息id
      before_id?: number | string; // 上一条消息id
      conversation_id: string | undefined; // 会话id
      limit: number; // 每页数量
      order: string; // 排序字段
    } = {
      order: pagination.value.order,
      limit: pagination.value.limit,
      conversation_id: route.query.id?.toString(),
    };

    if (pagination.value.hasMore) {
      // 按创建时间升序排序，最早的消息排序最前。
      if (pagination.value.order === 'desc') {
        // 那么需要 向后翻页
        form.after_id = pagination.value.afterId;
      }
      // 向前翻页
      if (pagination.value.order === 'asc') {
        form.before_id = pagination.value.beforeId;
      }
    }

    const res = await getConversationMsgListApi(form);

    if (res) {
      isLoading.value = false;

      // 需要将分页进行赋值
      pagination.value = {
        ...pagination.value,
        beforeId: res.firstID,
        afterId: res.lastID,
        hasMore: res.hasMore,
        isLoadAll: !res.hasMore,
      };

      if (dataList.value.length === 0) {
        // 第一次加载，直接反转数据顺序
        dataList.value = [...res.items];
      } else {
        // 后续加载，将新消息插入到现有消息前面
        dataList.value.push(...res.items);
      }
      gridApi.setGridOptions({ data: dataList.value });
    }
  } catch (error) {
    isLoading.value = false;
    console.error('Failed to load data:', error);
  }
};

onMounted(() => {
  loadList();
});
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #role="{ row }">
        <Tag v-if="row.role === 'assistant'" color="red"> AI助手 </Tag>
        <Tag v-if="row.role === 'user'" color="purple">用户</Tag>
      </template>
    </Grid>
  </Page>
</template>
