import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 用户表单校验规则 */
export const formRules = reactive<FormRules>({
  nickname: [{ required: true, message: "用户昵称为必填项", trigger: "blur" }],
  username: [{ required: true, message: "用户名称为必填项", trigger: "blur" }],
  password: [{ required: true, message: "用户密码为必填项", trigger: "blur" }]
});

/** 修改用户表单校验规则（不需要密码） */
export const editFormRules = reactive<FormRules>({
  nickname: [{ required: true, message: "用户昵称为必填项", trigger: "blur" }],
  username: [{ required: true, message: "用户名称为必填项", trigger: "blur" }]
});
