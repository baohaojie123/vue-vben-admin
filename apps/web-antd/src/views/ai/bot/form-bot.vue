<script lang="ts" setup>
import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { Vue3JsonEditor } from 'vue3-json-editor';

import { useVbenForm } from '#/adapter/form';
import { mergeBotApi } from '#/api';

defineOptions({
  name: 'FormBot',
});

const initialJsonValue = ref({});

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
      fieldName: 'name',
      // 界面显示的label
      label: '智能体名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'description',
      label: '智能体描述',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入，多个ID用英文逗号分隔',
        type: 'textarea',
        rows: 3,
        onChange: (e: any) => {
          const value = e.target.value;
          return value
            .split(',')
            .map((id: string) => id.trim())
            .filter(Boolean);
        },
      },
      fieldName: 'cozeBotIdList',
      label: 'coze智能体ID列表',
      rules: 'required',
    },
    {
      component: h(Vue3JsonEditor),
      componentProps: {
        modelValue: initialJsonValue,
        // mode: 'code',
        style: {
          width: '100%',
          height: '400px',
        },
        onJsonChange: (value: Record<string, any>) => {
          formApi.setFieldValue('clBotSetting', value);
        },
      },
      fieldName: 'clBotSetting',
      label: '智能体配置',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  class: 'w-1/2',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      modalApi.setState({ title: data.id ? '编辑智能体' : '新增智能体' });
      if (data) {
        initialJsonValue.value = data.clBotSetting || {};
        formApi.setValues({
          id: data.id,
          name: data.name,
          description: data.description,
          cozeBotIdList: Array.isArray(data.cozeBotIdList)
            ? data.cozeBotIdList.join(',')
            : '',
          clBotSetting: data.clBotSetting || {},
        });
      }
    }
  },
});

function onSubmit(values: Record<string, any>) {
  values.cozeBotIdList = values.cozeBotIdList.split(',');
  values.clBotSetting = values.clBotSetting || {};

  mergeBotApi(values).then(() => {
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
