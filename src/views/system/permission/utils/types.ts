// 权限表单项
interface FormItemProps {
  id?: number;
  /** 权限名称（标识） */
  name: string;
  /** 显示名称 */
  displayName: string;
  /** 权限描述 */
  description?: string;
  /** 资源名称 */
  resource: string;
  /** 动作名称 */
  action: string;
  /** 是否激活 0-否 1-是 */
  isActive: number;
  /** 关联菜单ID */
  menuId?: number;
}

interface FormProps {
  formInline: FormItemProps;
  menuOptions: any[];
}

export type { FormItemProps, FormProps };
