<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { mergeChainGroupApi } from '#/api';

defineOptions({
  name: 'FormChainGroup',
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
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '连锁集团公司名称',
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
      modalApi.setState({
        title: data.id ? '编辑连锁集团公司' : '新增连锁集团公司',
      });

      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

function onSubmit(values: Record<string, any>) {
  mergeChainGroupApi(values).then(() => {
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
