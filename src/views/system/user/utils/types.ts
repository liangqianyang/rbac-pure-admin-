import type { UserItem } from "@/api/system";

interface FormItemProps extends UserItem {
  /** 用于判断是新增还是修改 */
  isAdd?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  userId: number;
  username: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色IDs */
  roleIds: number[];
}

interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
