<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getChainGroupListApi, getChainListApi, mergeShopApi } from '#/api';

defineOptions({
  name: 'FormShop',
});
const chainOptions = ref<{ label: string; value: string }[]>([]);

const getChainList = async (value: string, groupDeptId: string) => {
  const options = await getChainListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    groupDeptId,
  });
  chainOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

const handleChainSearch = async (value: string, groupDeptId: string) => {
  await getChainList(value, groupDeptId);
};

const handleChainGroupSearch = async (value: string) => {
  await getChainGroupList(value);
};
const chainGroupOptions = ref<{ label: string; value: string }[]>([]);

const getChainGroupList = async (value: string) => {
  const options = await getChainGroupListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
  });
  chainGroupOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
getChainGroupList('');
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
        type: 'hidden',
      },
      fieldName: 'oldGroupDeptId',
    },
    {
      component: 'Select',
      fieldName: 'groupDeptId',
      label: '连锁集团公司',
      defaultValue: '',
      rules: 'required',
      componentProps: () => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: chainGroupOptions.value,
        onSearch: handleChainGroupSearch,
        placeholder: '请输入搜索',
        style: {
          width: '100%',
        },
      }),
    },
    {
      component: 'Select',
      fieldName: 'chainDeptId',
      label: '连锁',
      defaultValue: '',
      rules: 'required',
      componentProps: (values) => {
        return {
          allowClear: true,
          showSearch: true,
          filterOption: false,
          options: chainOptions.value,
          placeholder: '请输入搜索',
          style: {
            width: '100%',
          },
          disabled: !values.groupDeptId,
        };
      },
      dependencies: {
        trigger(values) {
          handleChainSearch('', values.groupDeptId);
          if (values.oldGroupDeptId !== values.groupDeptId) {
            values.chainDeptId = '';
          }
        },
        triggerFields: ['groupDeptId'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '门店名称',
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
      modalApi.setState({ title: data.id ? '编辑门店' : '新增门店' });
      if (data) {
        formApi.setValues({
          id: data.id,
          name: data.name,
          groupDeptId: data.groupDeptId,
          chainDeptId: data.chainDeptId,
          status: data.status,
        });
      }
    }
  },
});

function onSubmit(values: Record<string, any>) {
  mergeShopApi(values).then(() => {
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
