import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 菜单表单校验规则 */
export const formRules = reactive<FormRules>({
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "路由路径为必填项", trigger: "blur" }]
});

/** 按钮类型表单校验规则 */
export const buttonFormRules = reactive<FormRules>({
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  permission: [{ required: true, message: "权限标识为必填项", trigger: "blur" }]
});

/** 外链类型表单校验规则 */
export const linkFormRules = reactive<FormRules>({
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "路由路径为必填项", trigger: "blur" }]
});
