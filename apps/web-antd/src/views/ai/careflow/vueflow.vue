<script setup lang="ts">
import type { Node } from '@vue-flow/core';

import { ref } from 'vue';

import { Panel, VueFlow } from '@vue-flow/core';

const nodes = ref<Node[]>([
  {
    id: '1',
    position: { x: 50, y: 50 },
    data: { label: 'Node 1' },
  },
]);

function addNode() {
  const id = Date.now().toString();

  nodes.value.push({
    id,
    position: { x: 150, y: 50 },
    data: { label: `Node ${id}` },
  });
}
</script>

<template>
  <VueFlow :nodes="nodes">
    <Panel>
      <button type="button" @click="addNode">Add a node</button>
    </Panel>
  </VueFlow>
</template>
