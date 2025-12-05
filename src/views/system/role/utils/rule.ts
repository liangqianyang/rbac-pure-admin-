import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 角色表单校验规则 */
export const formRules = reactive<FormRules>({
  name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  code: [{ required: true, message: "角色标识为必填项", trigger: "blur" }]
});
