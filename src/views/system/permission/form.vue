<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    displayName: "",
    description: "",
    resource: "",
    action: "",
    isActive: 1,
    menuId: undefined
  }),
  menuOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="权限标识" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入权限标识，如：system:user:add"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="显示名称" prop="displayName">
          <el-input
            v-model="newFormInline.displayName"
            clearable
            placeholder="请输入显示名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="资源名称" prop="resource">
          <el-input
            v-model="newFormInline.resource"
            clearable
            placeholder="请输入资源名称，如：user"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="动作名称" prop="action">
          <el-input
            v-model="newFormInline.action"
            clearable
            placeholder="请输入动作名称，如：add"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属菜单" prop="menuId">
          <el-select
            v-model="newFormInline.menuId"
            filterable
            placeholder="请选择所属菜单"
            class="w-full"
          >
            <el-option
              v-for="item in menuOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="isActive">
          <el-radio-group v-model="newFormInline.isActive">
            <el-radio :value="1">激活</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="权限描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            type="textarea"
            :rows="3"
            placeholder="请输入权限描述"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
