import type { MenuItem } from "@/api/system";

interface FormItemProps extends MenuItem {
  /** 用于判断是新增还是修改 */
  isAdd?: boolean;
  /** 上级菜单列表（用于选择器） */
  higherMenuOptions?: MenuItem[];
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
