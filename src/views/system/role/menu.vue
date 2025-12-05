<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import type { MenuFormProps } from "./utils/types";

const props = withDefaults(defineProps<MenuFormProps>(), {
  formInline: () => ({
    roleId: 0,
    roleName: "",
    menuOptions: [],
    menuIds: []
  })
});

const treeRef = ref();
const newFormInline = ref(props.formInline);
const searchValue = ref("");
const isExpand = ref(false);
const isSelectAll = ref(false);
const isLinkage = ref(true);

// 过滤菜单树
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.title.includes(value);
};

watch(searchValue, val => {
  treeRef.value?.filter(val);
});

watch(
  () => props.formInline,
  val => {
    newFormInline.value = val;
    nextTick(() => {
      // 设置选中的节点
      if (treeRef.value && val.menuIds?.length) {
        val.menuIds.forEach((id: number) => {
          const node = treeRef.value.getNode(id);
          if (node && node.isLeaf) {
            treeRef.value.setChecked(id, true, false);
          }
        });
      }
    });
  },
  { immediate: true }
);

// 展开/折叠
function toggleExpand() {
  isExpand.value = !isExpand.value;
  const nodes = treeRef.value?.store?.nodesMap || {};
  for (const key in nodes) {
    nodes[key].expanded = isExpand.value;
  }
}

// 全选/全不选
function toggleSelectAll() {
  isSelectAll.value = !isSelectAll.value;
  if (isSelectAll.value) {
    treeRef.value?.setCheckedNodes(newFormInline.value.menuOptions);
  } else {
    treeRef.value?.setCheckedKeys([]);
  }
}

// 获取选中的菜单IDs
function getCheckedMenuIds() {
  const checkedKeys = treeRef.value?.getCheckedKeys() || [];
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || [];
  return [...checkedKeys, ...halfCheckedKeys];
}

defineExpose({ getCheckedMenuIds });
</script>

<template>
  <div class="menu-tree-container">
    <el-input
      v-model="searchValue"
      placeholder="请输入菜单进行搜索"
      clearable
      class="mb-4"
    />
    <div class="flex items-center mb-4 gap-4">
      <el-checkbox v-model="isExpand" @change="toggleExpand">
        展开/折叠
      </el-checkbox>
      <el-checkbox v-model="isSelectAll" @change="toggleSelectAll">
        全选/全不选
      </el-checkbox>
      <el-checkbox v-model="isLinkage">父子联动</el-checkbox>
    </div>
    <el-tree
      ref="treeRef"
      :data="newFormInline.menuOptions"
      :props="{ label: 'title', children: 'children' }"
      :default-checked-keys="newFormInline.menuIds"
      :filter-node-method="filterNode"
      :check-strictly="!isLinkage"
      show-checkbox
      node-key="id"
      highlight-current
      class="menu-tree"
    />
  </div>
</template>

<style scoped lang="scss">
.menu-tree-container {
  height: 400px;
  overflow: auto;
}

.menu-tree {
  :deep(.el-tree-node__content) {
    height: 30px;
  }
}
</style>
