<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { formRules, buttonFormRules, linkFormRules } from "./utils/rule";
import type { FormProps } from "./utils/types";
import { IconSelect } from "@/components/ReIcon";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isAdd: true,
    parentId: 0,
    menuType: 0,
    title: "",
    name: "",
    path: "",
    component: "",
    redirect: "",
    permission: "",
    icon: "",
    extraIcon: "",
    enterTransition: "",
    leaveTransition: "",
    frameSrc: "",
    frameLoading: true,
    sort: 99,
    showLink: true,
    showParent: true,
    keepAlive: false,
    hiddenTag: false,
    fixedTag: false,
    activePath: "",
    status: 1,
    higherMenuOptions: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 菜单类型选项
const menuTypeOptions = [
  { label: "菜单", value: 0 },
  { label: "iframe", value: 1 },
  { label: "外链", value: 2 },
  { label: "按钮", value: 3 }
];

// 动画选项
const transitionOptions = [
  { label: "无", value: "" },
  { label: "fade-slide", value: "fade-slide" },
  { label: "fade", value: "fade" },
  { label: "fade-bottom", value: "fade-bottom" },
  { label: "fade-scale", value: "fade-scale" },
  { label: "zoom-fade", value: "zoom-fade" },
  { label: "zoom-out", value: "zoom-out" }
];

// 根据菜单类型选择校验规则
const currentRules = computed(() => {
  if (newFormInline.value.menuType === 3) {
    return buttonFormRules;
  } else if (newFormInline.value.menuType === 2) {
    return linkFormRules;
  }
  return formRules;
});

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
    :rules="currentRules"
    label-width="100px"
  >
    <el-form-item label="菜单类型">
      <el-segmented
        v-model="newFormInline.menuType"
        :options="menuTypeOptions"
        :props="{ label: 'label', value: 'value' }"
      />
    </el-form-item>

    <el-form-item label="上级菜单">
      <el-tree-select
        v-model="newFormInline.parentId"
        :data="newFormInline.higherMenuOptions"
        :props="{ label: 'title', value: 'id', children: 'children' }"
        :render-after-expand="false"
        check-strictly
        filterable
        clearable
        class="w-full"
        placeholder="请选择上级菜单"
      />
    </el-form-item>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="newFormInline.menuType !== 3" :span="12">
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="newFormInline.menuType === 3" :span="12">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            :max="9999"
            controls-position="right"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 按钮类型特有字段 -->
    <template v-if="newFormInline.menuType === 3">
      <el-form-item label="权限标识" prop="permission">
        <el-input
          v-model="newFormInline.permission"
          clearable
          placeholder="请输入权限标识"
        />
      </el-form-item>
    </template>

    <!-- 菜单类型特有字段 -->
    <template v-if="newFormInline.menuType === 0">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="路由路径" prop="path">
            <el-input
              v-model="newFormInline.path"
              clearable
              placeholder="请输入路由路径"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件路径">
            <el-input
              v-model="newFormInline.component"
              clearable
              placeholder="请输入组件路径"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单排序">
            <el-input-number
              v-model="newFormInline.sort"
              :min="0"
              :max="9999"
              controls-position="right"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由重定向">
            <el-input
              v-model="newFormInline.redirect"
              clearable
              placeholder="请输入默认跳转地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单图标">
            <IconSelect v-model="newFormInline.icon" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右侧图标">
            <IconSelect v-model="newFormInline.extraIcon" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="进场动画">
            <el-select
              v-model="newFormInline.enterTransition"
              class="w-full"
              clearable
              placeholder="请选择页面进场加载动画"
            >
              <el-option
                v-for="item in transitionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离场动画">
            <el-select
              v-model="newFormInline.leaveTransition"
              class="w-full"
              clearable
              placeholder="请选择页面离场加载动画"
            >
              <el-option
                v-for="item in transitionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单激活">
            <el-input
              v-model="newFormInline.activePath"
              clearable
              placeholder="请输入需要激活的菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单">
            <el-segmented
              v-model="newFormInline.showLink"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级菜单">
            <el-segmented
              v-model="newFormInline.showParent"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="缓存页面">
            <el-segmented
              v-model="newFormInline.keepAlive"
              :options="[
                { label: '缓存', value: true },
                { label: '不缓存', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签页">
            <el-segmented
              v-model="newFormInline.hiddenTag"
              :options="[
                { label: '允许', value: false },
                { label: '禁止', value: true }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="固定标签页">
            <el-segmented
              v-model="newFormInline.fixedTag"
              :options="[
                { label: '固定', value: true },
                { label: '不固定', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <!-- iframe类型特有字段 -->
    <template v-if="newFormInline.menuType === 1">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="路由路径" prop="path">
            <el-input
              v-model="newFormInline.path"
              clearable
              placeholder="请输入路由路径"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序">
            <el-input-number
              v-model="newFormInline.sort"
              :min="0"
              :max="9999"
              controls-position="right"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单图标">
            <IconSelect v-model="newFormInline.icon" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右侧图标">
            <IconSelect v-model="newFormInline.extraIcon" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="进场动画">
            <el-select
              v-model="newFormInline.enterTransition"
              class="w-full"
              clearable
              placeholder="请选择页面进场加载动画"
            >
              <el-option
                v-for="item in transitionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离场动画">
            <el-select
              v-model="newFormInline.leaveTransition"
              class="w-full"
              clearable
              placeholder="请选择页面离场加载动画"
            >
              <el-option
                v-for="item in transitionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="链接地址">
        <el-input
          v-model="newFormInline.frameSrc"
          clearable
          placeholder="请输入 iframe 链接地址"
        />
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="加载动画">
            <el-segmented
              v-model="newFormInline.frameLoading"
              :options="[
                { label: '开启', value: true },
                { label: '关闭', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单">
            <el-segmented
              v-model="newFormInline.showLink"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级菜单">
            <el-segmented
              v-model="newFormInline.showParent"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="缓存页面">
            <el-segmented
              v-model="newFormInline.keepAlive"
              :options="[
                { label: '缓存', value: true },
                { label: '不缓存', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签页">
            <el-segmented
              v-model="newFormInline.hiddenTag"
              :options="[
                { label: '允许', value: false },
                { label: '禁止', value: true }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="固定标签页">
            <el-segmented
              v-model="newFormInline.fixedTag"
              :options="[
                { label: '固定', value: true },
                { label: '不固定', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <!-- 外链类型特有字段 -->
    <template v-if="newFormInline.menuType === 2">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="路由路径" prop="path">
            <el-input
              v-model="newFormInline.path"
              clearable
              placeholder="请输入路由路径"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序">
            <el-input-number
              v-model="newFormInline.sort"
              :min="0"
              :max="9999"
              controls-position="right"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单图标">
            <IconSelect v-model="newFormInline.icon" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右侧图标">
            <IconSelect v-model="newFormInline.extraIcon" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单">
            <el-segmented
              v-model="newFormInline.showLink"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级菜单">
            <el-segmented
              v-model="newFormInline.showParent"
              :options="[
                { label: '显示', value: true },
                { label: '隐藏', value: false }
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </el-form>
</template>
