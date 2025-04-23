<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';

defineOptions({
  name: 'FormModelDemo',
});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入',
      },
      // 字段名
      fieldName: 'field1',
      // 界面显示的label
      label: '字段1',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      defaultValue: '默认值',
      fieldName: 'field2',
      label: '默认值(必填)',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field3',
      label: '默认值(非必填)',
      rules: z.string().default('默认值').optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field31',
      label: '自定义信息',
      rules: z.string().min(1, { message: '最少输入1个字符' }),
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入',
      },
      // 字段名
      fieldName: 'field4',
      // 界面显示的label
      label: '邮箱',
      rules: z.string().email('请输入正确的邮箱'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'number',
      label: '数字',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'options',
      label: '下拉选',
      rules: 'selectRequired',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      fieldName: 'radioGroup',
      label: '单选组',
      rules: 'selectRequired',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      fieldName: 'checkboxGroup',
      label: '多选组',
      rules: 'selectRequired',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['我已阅读并同意'],
        };
      },
      rules: z.boolean().refine((value) => value, {
        message: '请勾选',
      }),
    },
    {
      component: 'DatePicker',
      defaultValue: undefined,
      fieldName: 'datePicker',
      label: '日期选择框',
      rules: 'selectRequired',
    },
    {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
      },
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'rangePicker',
      label: '区间选择框',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        showPassword: true,
      },
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'input-blur',
      formFieldProps: {
        validateOnChange: false,
        validateOnModelUpdate: false,
      },
      help: 'blur时才会触发校验',
      label: 'blur触发',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'input-async',
      label: '异步校验',
      rules: z
        .string()
        .min(3, '用户名至少需要3个字符')
        .refine(
          async (username) => {
            // 假设这是一个异步函数，模拟检查用户名是否已存在
            const checkUsernameExists = async (
              username: string,
            ): Promise<boolean> => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return username === 'existingUser';
            };
            const exists = await checkUsernameExists(username);
            return !exists;
          },
          {
            message: '用户名已存在',
          },
        ),
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '内嵌表单示例',
});

function onSubmit(values: Record<string, any>) {
  ElMessage({
    type: 'info',
    message: '正在提交中...',
    duration: 0,
  });
  modalApi.lock();
  setTimeout(() => {
    modalApi.close();
    ElMessage({
      type: 'success',
      message: `提交成功：${JSON.stringify(values)}`,
      duration: 2,
    });
  }, 3000);
}
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
