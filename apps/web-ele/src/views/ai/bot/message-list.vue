<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

const route = useRoute();
</script>
<template>
  <Page>
    <h3>消息列表{{ route.query.id }}</h3>
  </Page>
</template>
