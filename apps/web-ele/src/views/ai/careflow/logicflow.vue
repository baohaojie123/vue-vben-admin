<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import LogicFlow from '@logicflow/core';

// 准备数据
const data = {
  // 节点
  nodes: [
    {
      id: '21',
      type: 'rect',
      x: 100,
      y: 200,
      text: '矩形节点',
    },
    {
      id: '50',
      type: 'circle',
      x: 300,
      y: 400,
      text: '圆形节点',
    },
  ],
  // 边
  edges: [
    {
      type: 'polyline',
      sourceNodeId: '50',
      targetNodeId: '21',
    },
  ],
};

const container = ref<HTMLElement | null>(null);
let lf: any = null;

onMounted(() => {
  if (container.value) {
    lf = new LogicFlow({
      container: container.value,
      width: 700,
      height: 600,
    });

    lf.render(data);
  }
});
</script>
<template>
  <Page auto-content-height>
    <div id="container" ref="container"></div>
  </Page>
</template>
