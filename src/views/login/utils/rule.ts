import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为6位以上） */
export const REGEXP_PWD = /^.{6,}$/;

/** 登录校验 */
const loginRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur"
    },
    {
      type: "email",
      message: "请输入正确的邮箱格式",
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error("密码长度至少为6位"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
