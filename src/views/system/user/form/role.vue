<script setup lang="ts">
import { ref, watch } from "vue";
import type { RoleFormProps } from "../utils/types";

const props = withDefaults(defineProps<RoleFormProps>(), {
  formInline: () => ({
    userId: 0,
    username: "",
    nickname: "",
    roleOptions: [],
    roleIds: []
  })
});

const newFormInline = ref(props.formInline);

watch(
  () => props.formInline,
  val => {
    newFormInline.value = val;
  }
);
</script>

<template>
  <el-form :model="newFormInline" label-width="100px">
    <el-form-item label="用户昵称">
      <el-input v-model="newFormInline.nickname" disabled />
    </el-form-item>
    <el-form-item label="角色列表">
      <el-select
        v-model="newFormInline.roleIds"
        multiple
        clearable
        placeholder="请选择角色"
        class="w-full"
      >
        <el-option
          v-for="item in newFormInline.roleOptions"
          :key="item.id"
          :label="item.displayName || item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
