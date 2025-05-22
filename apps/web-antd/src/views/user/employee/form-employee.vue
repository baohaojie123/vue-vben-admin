<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getShopListApi, getStoreListApi, mergeEmployeeApi } from '#/api';

defineOptions({
  name: 'FormEmployee',
});
const storeOptions = ref<{ label: string; value: string }[]>([]);
const shopOptions = ref<{ label: string; value: string }[]>([]);
const getShopList = async (value: string, storeDeptId: string) => {
  const options = await getShopListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    storeDeptId,
  });
  shopOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
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
const handleSearchStore = async (value: string) => {
  await getStoreList(value);
};
const handleSearchShop = async (value: string, storeDeptId: string) => {
  await getShopList(value, storeDeptId);
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
      component: 'Input',
      componentProps: {
        type: 'hidden',
      },
      fieldName: 'oldStoreDeptId',
    },
    {
      component: 'Select',
      fieldName: 'storeDeptId',
      label: '连锁',
      defaultValue: '',
      rules: 'required',
      componentProps: () => {
        return {
          showSearch: true,
          filterOption: false,
          options: storeOptions.value,
          onSearch: handleSearchStore,
          placeholder: '请输入搜索',
          style: {
            width: '100%',
          },
        };
      },
    },
    {
      component: 'Select',
      fieldName: 'shopDeptId',
      label: '门店',
      rules: 'required',
      defaultValue: '',
      componentProps: (values) => {
        return {
          allowClear: true,
          filterOption: false,
          options: shopOptions.value,
          placeholder: '请输入搜索',
          style: {
            width: '100%',
          },
          disabled: !values.storeDeptId,
        };
      },
      dependencies: {
        trigger(values) {
          handleSearchShop('', values.storeDeptId);
          if (values.oldStoreDeptId !== values.storeDeptId) {
            values.shopDeptId = '';
          }
        },
        triggerFields: ['storeDeptId'],
      },
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '姓名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '账号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'userNo',
      label: '员工工号',
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
      modalApi.setState({ title: data.id ? '编辑员工' : '新增员工' });
      if (data) {
        formApi.setValues({
          id: data.id,
          realName: data.realName,
          username: data.username,
          userNo: data.userNo,
          status: data.status,
          storeDeptId: data.storeDeptId,
          oldStoreDeptId: data.storeDeptId,
          shopDeptId: data.shopDeptId,
        });
      }
    }
  },
});

function onSubmit(values: Record<string, any>) {
  mergeEmployeeApi(values).then(() => {
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
