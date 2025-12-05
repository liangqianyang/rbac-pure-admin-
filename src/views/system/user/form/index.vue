<script setup lang="ts">
import { ref, watch } from "vue";
import { formRules, editFormRules } from "../utils/rule";
import type { FormProps } from "../utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isAdd: true,
    nickname: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    sex: 1,
    status: 1,
    remark: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 根据是否新增选择校验规则
const currentRules = ref(props.formInline.isAdd ? formRules : editFormRules);

watch(
  () => props.formInline,
  val => {
    newFormInline.value = val;
    currentRules.value = val.isAdd ? formRules : editFormRules;
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
    :rules="currentRules"
    label-width="100px"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名称"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="newFormInline.isAdd" :span="12">
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            type="password"
            show-password
            placeholder="请输入用户密码"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="!newFormInline.isAdd" :span="12">
        <el-form-item label="邮箱">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="newFormInline.isAdd" :span="12">
        <el-form-item label="邮箱">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户性别">
          <el-select
            v-model="newFormInline.sex"
            placeholder="请选择用户性别"
            class="w-full"
            clearable
          >
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!newFormInline.isAdd" :span="12">
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="newFormInline.isAdd" :span="12">
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
