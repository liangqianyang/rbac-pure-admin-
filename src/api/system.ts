import { http } from "@/utils/http";

// ==================== 类型定义 ====================

export type Result = {
  success: boolean;
  message?: string;
  data?: any;
};

export type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 用户 */
export type UserItem = {
  id?: number;
  /** 用户名 */
  username?: string;
  /** 用户昵称 */
  nickname?: string;
  /** 头像 */
  avatar?: string;
  /** 手机号 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 性别 0-女 1-男 */
  sex?: number;
  /** 状态 0-禁用 1-启用 */
  status?: number;
  /** 备注 */
  remark?: string;
  /** 密码 (新增时) */
  password?: string;
  /** 创建时间 */
  createTime?: string;
};

/** 角色 */
export type RoleItem = {
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 角色标识 */
  code?: string;
  /** 状态 0-禁用 1-启用 */
  status?: number;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: string;
};

/** 菜单 */
export type MenuItem = {
  id?: number;
  /** 上级菜单ID */
  parentId?: number;
  /** 菜单类型 0-菜单 1-iframe 2-外链 3-按钮 */
  menuType?: number;
  /** 菜单名称 */
  title?: string;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 重定向地址 */
  redirect?: string;
  /** 权限标识 */
  permission?: string;
  /** 菜单图标 */
  icon?: string;
  /** 右侧图标 */
  extraIcon?: string;
  /** 进场动画 */
  enterTransition?: string;
  /** 离场动画 */
  leaveTransition?: string;
  /** iframe链接地址 */
  frameSrc?: string;
  /** iframe加载动画 */
  frameLoading?: boolean;
  /** 排序 */
  sort?: number;
  /** 是否显示 */
  showLink?: boolean;
  /** 是否显示父级 */
  showParent?: boolean;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 是否禁止标签页 */
  hiddenTag?: boolean;
  /** 是否固定标签页 */
  fixedTag?: boolean;
  /** 激活路径 */
  activePath?: string;
  /** 状态 0-禁用 1-启用 */
  status?: number;
  /** 创建时间 */
  createTime?: string;
  /** 子菜单 */
  children?: MenuItem[];
};

/** 权限 */
export type PermissionItem = {
  id?: number;
  /** 关联菜单ID */
  menuId?: number;
  /** 权限名称（标识） */
  name?: string;
  /** 显示名称 */
  displayName?: string;
  /** 权限描述 */
  description?: string;
  /** 资源名称 */
  resource?: string;
  /** 动作名称 */
  action?: string;
  /** 是否激活 0-否 1-是 */
  isActive?: number;
  /** 排序 */
  sort?: number;
  /** 创建时间 */
  createTime?: string;
};

// ==================== 用户管理 API ====================

/** 获取用户列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/api/system/user/list", { data });
};

/** 新增用户 */
export const addUser = (data: UserItem) => {
  return http.request<Result>("post", "/api/system/user/add", { data });
};

/** 修改用户 */
export const updateUser = (data: UserItem) => {
  return http.request<Result>("put", "/api/system/user/update", { data });
};

/** 删除用户 */
export const deleteUser = (ids: number[]) => {
  return http.request<Result>("delete", "/api/system/user/delete", {
    data: { ids }
  });
};

/** 重置用户密码 */
export const resetUserPassword = (data: { id: number; password: string }) => {
  return http.request<Result>("put", "/api/system/user/reset-password", {
    data
  });
};

/** 获取用户角色ID列表 */
export const getUserRoleIds = (userId: number) => {
  return http.request<Result>("post", "/api/system/user/role-ids", {
    data: { userId }
  });
};

/** 分配用户角色 */
export const assignUserRoles = (data: {
  userId: number;
  roleIds: number[];
}) => {
  return http.request<Result>("post", "/api/system/user/assign-roles", {
    data
  });
};

// ==================== 角色管理 API ====================

/** 获取角色列表(分页) */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", "/api/system/role/list", { data });
};

/** 获取所有启用的角色 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/api/system/role/list-all");
};

/** 新增角色 */
export const addRole = (data: RoleItem) => {
  return http.request<Result>("post", "/api/system/role/add", { data });
};

/** 修改角色 */
export const updateRole = (data: RoleItem) => {
  return http.request<Result>("put", "/api/system/role/update", { data });
};

/** 删除角色 */
export const deleteRole = (ids: number[]) => {
  return http.request<Result>("delete", "/api/system/role/delete", {
    data: { ids }
  });
};

/** 获取角色菜单ID列表 */
export const getRoleMenuIds = (roleId: number) => {
  return http.request<Result>("post", "/api/system/role/menu-ids", {
    data: { roleId }
  });
};

/** 分配角色菜单权限 */
export const assignRoleMenus = (data: {
  roleId: number;
  menuIds: number[];
}) => {
  return http.request<Result>("post", "/api/system/role/assign-menus", {
    data
  });
};

// ==================== 菜单管理 API ====================

/** 获取菜单列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/api/system/menu/list", { data });
};

/** 新增菜单 */
export const addMenu = (data: MenuItem) => {
  return http.request<Result>("post", "/api/system/menu/add", { data });
};

/** 修改菜单 */
export const updateMenu = (data: MenuItem) => {
  return http.request<Result>("put", "/api/system/menu/update", { data });
};

/** 删除菜单 */
export const deleteMenu = (id: number) => {
  return http.request<Result>("delete", "/api/system/menu/delete", {
    data: { id }
  });
};

// ==================== 权限管理 API ====================

/** 获取权限列表(分页) */
export const getPermissionList = (data?: object) => {
  return http.request<ResultTable>("post", "/api/system/permission/list", {
    data
  });
};

/** 获取所有启用的权限 */
export const getAllPermissionList = () => {
  return http.request<Result>("get", "/api/system/permission/list-all");
};

/** 根据菜单ID获取权限列表 */
export const getPermissionListByMenu = (menuId: number) => {
  return http.request<Result>("post", "/api/system/permission/list-by-menu", {
    data: { menuId }
  });
};

/** 新增权限 */
export const addPermission = (data: PermissionItem) => {
  return http.request<Result>("post", "/api/system/permission/add", { data });
};

/** 修改权限 */
export const updatePermission = (data: PermissionItem) => {
  return http.request<Result>("put", "/api/system/permission/update", { data });
};

/** 删除权限 */
export const deletePermission = (ids: number[]) => {
  return http.request<Result>("delete", "/api/system/permission/delete", {
    data: { ids }
  });
};
