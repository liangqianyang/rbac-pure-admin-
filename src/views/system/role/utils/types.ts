import type { RoleItem, MenuItem } from "@/api/system";

interface FormItemProps extends RoleItem {
  /** 用于判断是新增还是修改 */
  isAdd?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

interface MenuFormItemProps {
  roleId: number;
  roleName: string;
  /** 菜单树数据 */
  menuOptions: MenuItem[];
  /** 选中的菜单IDs */
  menuIds: number[];
}

interface MenuFormProps {
  formInline: MenuFormItemProps;
}

export type { FormItemProps, FormProps, MenuFormItemProps, MenuFormProps };
