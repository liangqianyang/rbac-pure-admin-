import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 权限表单校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "权限标识为必填项", trigger: "blur" }],
  displayName: [
    { required: true, message: "显示名称为必填项", trigger: "blur" }
  ],
  resource: [{ required: true, message: "资源名称为必填项", trigger: "blur" }],
  action: [{ required: true, message: "动作名称为必填项", trigger: "blur" }]
});
