import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 新增用户表单校验规则 */
export const formRules = reactive<FormRules>({
  username: [{ required: true, message: "用户名为必填项", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱为必填项", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  password: [
    { required: true, message: "密码为必填项", trigger: "blur" },
    { min: 6, message: "密码长度至少为6位", trigger: "blur" }
  ]
});

/** 修改用户表单校验规则（不需要密码） */
export const editFormRules = reactive<FormRules>({
  username: [{ required: true, message: "用户名为必填项", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱为必填项", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
});
