<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { mergeStoreApi } from '#/api';

defineOptions({
  name: 'FormShop',
});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  commonConfig: {
    labelWidth: 140,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        type: 'hidden',
      },
      fieldName: 'id',
    },
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入',
      },
      // 字段名
      fieldName: 'region',
      // 界面显示的label
      label: '连锁区域',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '连锁名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      defaultValue: 'OPEN',
      componentProps: {
        options: [
          { label: '已启用', value: 'OPEN' },
          { label: '已禁用', value: 'CLOSE' },
        ],
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  class: 'w-1/3',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      modalApi.setState({ title: data.id ? '编辑连锁' : '新增连锁' });

      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

function onSubmit(values: Record<string, any>) {
  mergeStoreApi(values).then(() => {
    message.success({
      content: `提交成功：${JSON.stringify(values)}`,
      duration: 2,
    });
    modalApi.close();
  });
}
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
