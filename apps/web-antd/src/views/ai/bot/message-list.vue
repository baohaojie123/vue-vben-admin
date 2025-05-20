<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

// import { SyncOutlined } from '@ant-design/icons-vue';
import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getConversationMsgListApi } from '#/api';

defineOptions({
  name: 'MessageList',
});

interface RowType {
  role: string;
  content: string;
  created_at: number;
}

interface PAGINATION_MESSAHE_LIST {
  order: string; // 排序字段
  chatId: string; // 会话id
  beforeId: number | string; // 上一条消息id
  afterId: number | string; // 下一条消息id
  limit: number; // 每页数量
  hasMore: boolean; // 是否有更多
  isLoadAll: boolean; // 是否已经加载完 false 未加载完 true 加载完
  total: number; // 总条数
}
const route = useRoute();
// 数据源
const dataList = ref<RowType[]>([]);
// 加载
const isLoading = ref<boolean | undefined>(false);
// 分页
const pagination = ref({
  order: 'asc', // 排序字段
  chatId: '', // 会话id
  beforeId: 0, // 上一条消息id
  afterId: 0, // 下一条消息id
  hasMore: false, // 是否有更多
  limit: 20, // 每页数量
  isLoadAll: false, // 是否已经加载完
  total: 0, // 总条数
} as PAGINATION_MESSAHE_LIST);

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { type: 'seq', width: 70 },
    { field: 'role', title: '角色', slots: { default: 'role' } },
    { field: 'content', title: '消息内容', minWidth: 400 ,align: 'left'},
    {
      field: 'created_at',
      title: '创建时间',
      // formatter: 'formatDateTime',
      formatter: ({ row }) => {
        const data = formatDateTime(row.created_at * 1000);
        return data;
      },
      width: 200,
    },
  ],
  loading: isLoading.value,
  data: [],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      // 接收 Promise
      query: async () => {
        initPagination();

        const res = await loadList();
        // console.log('🚀 ~ query: ~ res:', res);
        return res;
      },
    },
  },
  pagerConfig: {
    layouts: ['Total', 'Home'],
    total: 0,
    slots: {
      // 自定义插槽
      total: 'pagerTotal',
      home: 'pagerHome',
    },
  },
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
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

// 模拟行数据
const loadList = async () => {
  try {
    isLoading.value = true;
    gridApi.setGridOptions({
      loading: true,
    });
    // 是否已经加载完
    if (pagination.value.isLoadAll) {
      cancelLoading();
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
        form.after_id = pagination.value.afterId;
      }
    }

    const res = await getConversationMsgListApi(form);

    if (res) {
      cancelLoading();

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

      gridApi.setGridOptions({
        data: dataList.value,
        pagerConfig: {
          total: dataList.value.length,
        },
      });
      pagination.value.total = dataList.value.length;

      return { items: dataList.value, total: dataList.value.length };
    }
  } catch (error) {
    cancelLoading();
    console.error('Failed to load data:', error);
  }
};
// 初始化 分页
const initPagination = () => {
  dataList.value = [];
  pagination.value = {
    order: 'asc', // 排序字段
    chatId: '', // 会话id
    beforeId: 0, // 上一条消息id
    afterId: 0, // 下一条消息id
    hasMore: false, // 是否有更多
    limit: 20, // 每页数量
    isLoadAll: false, // 是否已经加载完
    total: 0, // 总条数
  };
};

// 状态loading 取消
const cancelLoading = () => {
  isLoading.value = false;
  gridApi.setGridOptions({
    loading: false,
  });
};
onMounted(() => {
  // loadList();
});
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #role="{ row }">
        <Tag v-if="row.role === 'assistant'" color="red"> AI助手 </Tag>
        <Tag v-if="row.role === 'user'" color="cyan">用户</Tag>
      </template>
      <template #pagerTotal>
        <span class="mr-3"> 共 {{ pagination.total }} 条记录 </span>
      </template>
      <template #pagerHome>
        <Tag color="gold" v-if="!pagination.isLoadAll">
          <template #icon> </template>
          还未加载完毕...
        </Tag>
        <Tag color="processing" v-else> 已经加载完毕 </Tag>
      </template>
    </Grid>
  </Page>
</template>
