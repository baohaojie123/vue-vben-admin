<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getStoreListApi, mergeShopApi } from '#/api';

defineOptions({
  name: 'FormShop',
});
const storeOptions = ref([]);

const getStoreList = async (value: string) => {
  const options = await getStoreListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
  });
  // 假设接口支持关键词参数
  storeOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const handleSearch = async (value: string) => {
  await getStoreList(value);
};
getStoreList('');
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
      component: 'Select',
      fieldName: 'storeDeptId',
      label: '连锁名称',
      defaultValue: '',
      rules: 'required',

      componentProps: () => {
        return {
          showSearch: true,
          filterOption: false,
          options: storeOptions,
          onSearch: handleSearch,
          placeholder: '请输入搜索',
          style: {
            width: '100%',
          },
        };
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
          storeDeptId: data.storeDeptId,
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
