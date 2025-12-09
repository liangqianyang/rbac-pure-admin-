<script setup lang="ts">
import { ref, watch } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isAdd: true,
    display_name: "",
    name: "",
    is_active: true,
    description: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

watch(
  () => props.formInline,
  val => {
    newFormInline.value = val;
  }
);

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
    <el-form-item label="角色标识" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入角色标识"
      />
    </el-form-item>
    <el-form-item label="角色名称" prop="display_name">
      <el-input
        v-model="newFormInline.display_name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch
        v-model="newFormInline.is_active"
        inline-prompt
        :active-value="true"
        :inactive-value="false"
        active-text="启用"
        inactive-text="停用"
      />
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="3"
        placeholder="请输入角色描述"
      />
    </el-form-item>
  </el-form>
</template>
