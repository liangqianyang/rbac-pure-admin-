<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { formRules, editFormRules } from "../utils/rule";
import type { FormProps } from "../utils/types";
import { uploadImage } from "@/api/system";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isAdd: true,
    username: "",
    nickname: "",
    email: "",
    phone: "",
    sex: 0,
    avatar: "",
    password: "",
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const uploading = ref(false);
const avatarPreviewUrl = ref(""); // 用于预览的完整URL

// 计算属性：获取头像显示URL
const displayAvatarUrl = computed(() => {
  // 优先使用上传后的预览URL
  if (avatarPreviewUrl.value) {
    return avatarPreviewUrl.value;
  }
  // 直接返回avatar（后端返回的是绝对路径）
  return newFormInline.value.avatar || "";
});

// 根据是否新增选择校验规则
const currentRules = ref(props.formInline.isAdd ? formRules : editFormRules);

watch(
  () => props.formInline,
  val => {
    newFormInline.value = val;
    currentRules.value = val.isAdd ? formRules : editFormRules;
    avatarPreviewUrl.value = ""; // 重置预览URL
  }
);

// 文件上传前校验
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  const isImage = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ].includes(rawFile.type);
  if (!isImage) {
    message("头像只能是 JPG/PNG/GIF/WEBP 格式!", { type: "error" });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    message("头像大小不能超过 2MB!", { type: "error" });
    return false;
  }
  return true;
};

// 自定义上传处理
const handleAvatarUpload: UploadProps["httpRequest"] = async options => {
  uploading.value = true;
  try {
    const result = await uploadImage(options.file as File, "images/avatar");
    if (result.success) {
      newFormInline.value.avatar = result.path; // 保存相对路径
      avatarPreviewUrl.value = result.url; // 预览用完整URL
      message("头像上传成功", { type: "success" });
    }
  } catch (error) {
    message("头像上传失败", { type: "error" });
    console.error("Upload error:", error);
  } finally {
    uploading.value = false;
  }
};

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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入昵称"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            { required: true, message: '邮箱为必填项', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱格式',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="newFormInline.isAdd" :span="12">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <el-select
            v-model="newFormInline.sex"
            placeholder="请选择性别"
            class="w-full"
          >
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
            accept="image/*"
          >
            <el-image
              v-if="displayAvatarUrl"
              :src="displayAvatarUrl"
              class="avatar"
              fit="cover"
            />
            <el-icon
              v-else
              class="avatar-uploader-icon"
              :class="{ 'is-loading': uploading }"
            >
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                支持 JPG/PNG/GIF/WEBP 格式，不超过 2MB
              </div>
            </template>
          </el-upload>
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
  </el-form>
</template>

<style scoped>
.avatar-uploader {
  :deep(.el-upload) {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
  }
}

.avatar-uploader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.avatar-uploader-icon.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.avatar {
  display: block;
  width: 100px;
  height: 100px;
}

.el-upload__tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
