<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  getChainGroupListApi,
  getChainListApi,
  getShopListApi,
  mergeEmployeeApi,
} from '#/api';

defineOptions({
  name: 'FormEmployee',
});
const chainOptions = ref<{ label: string; value: string }[]>([]);
const shopOptions = ref<{ label: string; value: string }[]>([]);
const getShopList = async (
  value: string,
  groupDeptId: string,
  chainDeptId: string,
) => {
  const options = await getShopListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    name: value,
    groupDeptId,
    chainDeptId,
  });
  shopOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const getChainList = async (value: string, groupDeptId: string) => {
  const options = await getChainListApi({
    pageAsc: false,
    pageCurrent: 1,
    pageSearchCount: true,
    pageSize: 9999,
    ...(value && { name: value }),
    groupDeptId,
  });
  // 假设接口支持关键词参数
  chainOptions.value = options.records.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
const handleSearchChain = async (value: string, groupDeptId: string) => {
  await getChainList(value, groupDeptId);
};
const handleSearchShop = async (
  value: string,
  groupDeptId: string,
  chainDeptId: string,
) => {
  await getShopList(value, groupDeptId, chainDeptId);
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
const handleChainGroupSearch = async (value: string) => {
  await getChainGroupList(value);
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
      rules: 'required',
      defaultValue: '',
      componentProps: () => ({
        allowClear: true,
        showSearch: true,
        filterOption: false,
        options: chainGroupOptions.value,
        onSearch: handleChainGroupSearch,
        style: {
          width: '100%',
        },
        placeholder: '请输入连锁集团公司',
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
          showSearch: true,
          filterOption: false,
          allowClear: true,
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
          handleSearchChain('', values.groupDeptId);
          if (values.oldGroupDeptId !== values.groupDeptId) {
            values.chainDeptId = '';
            values.shopDeptId = '';
          }
        },
        triggerFields: ['groupDeptId'],
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
          showSearch: true,
          allowClear: true,
          filterOption: false,
          options: shopOptions.value,
          placeholder: '请输入搜索',
          style: {
            width: '100%',
          },
          disabled: !values.chainDeptId,
        };
      },
      dependencies: {
        trigger(values) {
          handleSearchShop('', values.groupDeptId, values.chainDeptId);
          if (values.oldGroupDeptId !== values.groupDeptId) {
            values.shopDeptId = '';
          }
        },
        triggerFields: ['chainDeptId'],
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
          groupDeptId: data.groupDeptId,
          oldGroupDeptId: data.groupDeptId,
          chainDeptId: data.chainDeptId,
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
