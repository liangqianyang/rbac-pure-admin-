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
  /** 角色标识 */
  name?: string;
  /** 角色名称 */
  display_name?: string;
  /** 状态 */
  is_active?: boolean;
  /** 描述 */
  description?: string;
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
  /** 权限名称（标识） */
  name?: string;
  /** 显示名称 */
  display_name?: string;
  /** 权限描述 */
  description?: string;
  /** 资源名称 */
  resource?: string;
  /** 动作名称 */
  action?: string;
  /** 是否激活 */
  is_active?: boolean;
  /** 关联菜单ID */
  menu_id?: number;
  /** 排序 */
  sort?: number;
  /** 创建时间 */
  created_at?: string;
};

// ==================== 用户管理 API ====================

/** 后端用户列表响应 */
interface BackendUserListResponse {
  data: Array<{
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nickname?: string;
    phone?: string;
    gender?: number;
    gender_text?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    roles?: Array<{ id: number; name: string; display_name: string }>;
  }>;
  meta: {
    current_page: number[];
    per_page: number[];
    total: number[];
    last_page: number[];
  };
}

/** 后端角色列表响应 */
interface BackendRoleListResponse {
  data: Array<{
    id: number;
    name: string;
    display_name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

/** 获取用户列表 */
export const getUserList = async (data?: {
  username?: string;
  email?: string;
  phone?: string;
  status?: string | number;
  currentPage?: number;
  pageSize?: number;
}): Promise<ResultTable> => {
  const params: Record<string, any> = {
    page: data?.currentPage || 1,
    per_page: data?.pageSize || 10
  };
  // 后端支持独立的搜索参数
  if (data?.username) params.name = data.username;
  if (data?.email) params.email = data.email;
  if (data?.phone) params.phone = data.phone;
  // 状态筛选：后端使用 is_active (boolean)
  if (data?.status !== undefined && data?.status !== "") {
    params.is_active = Number(data.status) === 1;
  }

  const response = await http.request<BackendUserListResponse>(
    "get",
    "/api/users",
    { params }
  );

  // 转换后端数据格式为前端格式
  const list = response.data.map(user => ({
    id: user.id,
    username: user.name,
    nickname: user.nickname || user.name,
    email: user.email,
    phone: user.phone || "",
    gender: user.gender ?? 0,
    genderText: user.gender_text || "未知",
    status: user.is_active ? 1 : 0,
    avatar: user.avatar || "",
    createTime: user.created_at,
    roles: user.roles || []
  }));

  return {
    success: true,
    data: {
      list,
      total: response.meta.total[0],
      pageSize: response.meta.per_page[0],
      currentPage: response.meta.current_page[0]
    }
  };
};

/** 新增用户 */
export const addUser = async (data: UserItem): Promise<Result> => {
  const requestData: Record<string, any> = {
    name: data.username,
    email: data.email,
    password: data.password
  };
  if (data.nickname) requestData.nickname = data.nickname;
  if (data.phone) requestData.phone = data.phone;
  if (data.avatar) requestData.avatar = data.avatar;
  if (data.sex !== undefined) requestData.gender = data.sex;

  await http.request("post", "/api/users", { data: requestData });
  return { success: true, message: "创建成功" };
};

/** 修改用户 */
export const updateUser = async (data: UserItem): Promise<Result> => {
  const updateData: Record<string, any> = {
    name: data.username
  };
  if (data.nickname) updateData.nickname = data.nickname;
  if (data.email) updateData.email = data.email;
  if (data.phone) updateData.phone = data.phone;
  if (data.avatar) updateData.avatar = data.avatar;
  if (data.password) updateData.password = data.password;
  if (data.sex !== undefined) updateData.gender = data.sex;
  if (typeof data.status !== "undefined") {
    updateData.is_active = data.status === 1;
  }

  await http.request("put", `/api/users/${data.id}`, { data: updateData });
  return { success: true, message: "更新成功" };
};

/** 删除用户 */
export const deleteUser = async (ids: number[]): Promise<Result> => {
  // 后端是单个删除，需要循环删除
  for (const id of ids) {
    await http.request("delete", `/api/users/${id}`);
  }
  return { success: true, message: "删除成功" };
};

/** 重置用户密码 */
export const resetUserPassword = async (data: {
  id: number;
  password: string;
}): Promise<Result> => {
  await http.request("put", `/api/users/${data.id}`, {
    data: { password: data.password }
  });
  return { success: true, message: "密码重置成功" };
};

/** 获取用户角色ID列表 */
export const getUserRoleIds = async (userId: number): Promise<Result> => {
  const response = await http.request<{
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
  }>("get", `/api/users/${userId}`);

  return {
    success: true,
    data: response.roles?.map(r => r.id) || []
  };
};

/** 分配用户角色 */
export const assignUserRoles = async (data: {
  userId: number;
  roleIds: number[];
}): Promise<Result> => {
  await http.request("post", `/api/users/${data.userId}/roles`, {
    data: { role_ids: data.roleIds }
  });
  return { success: true, message: "分配成功" };
};

// ==================== 角色管理 API ====================

/** 获取角色列表(分页) */
export const getRoleList = async (data?: {
  search?: string;
  is_active?: boolean | null;
  currentPage?: number;
  pageSize?: number;
}): Promise<ResultTable> => {
  const params: Record<string, any> = {
    page: data?.currentPage || 1,
    per_page: data?.pageSize || 10
  };
  if (data?.search) params.search = data.search;
  if (data?.is_active !== null && data?.is_active !== undefined) {
    params.is_active = data.is_active;
  }

  const response = await http.request<BackendRoleListResponse>(
    "get",
    "/api/roles",
    { params }
  );

  return {
    success: true,
    data: {
      list: response.data.map(role => ({
        id: role.id,
        name: role.name,
        display_name: role.display_name,
        is_active: role.is_active,
        description: role.description || "",
        createTime: role.created_at
      })),
      total: response.total || response.data.length,
      pageSize: response.per_page || 10,
      currentPage: response.current_page || 1
    }
  };
};

/** 获取所有启用的角色 */
export const getAllRoleList = async (): Promise<Result> => {
  const response = await http.request<BackendRoleListResponse>(
    "get",
    "/api/roles",
    { params: { per_page: 100 } }
  );

  return {
    success: true,
    data: response.data
      .filter(role => role.is_active)
      .map(role => ({
        id: role.id,
        name: role.name,
        display_name: role.display_name
      }))
  };
};

/** 新增角色 */
export const addRole = (data: RoleItem & { isAdd?: boolean }) => {
  // 移除前端专用字段
  const { isAdd: _isAdd, createTime: _createTime, ...postData } = data;
  return http.request<Result>("post", "/api/roles", { data: postData });
};

/** 修改角色 */
export const updateRole = (data: RoleItem & { isAdd?: boolean }) => {
  // 移除前端专用字段
  const { id, isAdd: _isAdd, createTime: _createTime, ...updateData } = data;
  return http.request<Result>("put", `/api/roles/${id}`, { data: updateData });
};

/** 删除角色 */
export const deleteRole = (ids: number[]) => {
  // 批量删除，逐个调用删除接口
  return Promise.all(
    ids.map(id => http.request<Result>("delete", `/api/roles/${id}`))
  );
};

/** 获取角色菜单ID列表（通过角色详情获取权限） */
export const getRoleMenuIds = async (roleId: number): Promise<Result> => {
  const response = await http.request<any>("get", `/api/roles/${roleId}`);
  // 返回角色已有的权限ID列表
  const permissionIds = response.data?.permissions?.map((p: any) => p.id) || [];
  return {
    success: true,
    data: permissionIds
  };
};

/** 获取按菜单分组的权限列表 */
export const getPermissionsGrouped = async (): Promise<Result> => {
  const response = await http.request<any>("get", "/api/permissions/grouped");
  return {
    success: true,
    data: response.data || []
  };
};

/** 分配角色权限 */
export const assignRoleMenus = async (data: {
  roleId: number;
  menuIds: number[];
}): Promise<Result> => {
  return http.request<Result>("post", `/api/roles/${data.roleId}/permissions`, {
    data: {
      permission_ids: data.menuIds
    }
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

/** 获取菜单选项（用于下拉选择） */
export const getMenuOptions = async (): Promise<
  Array<{ id: number; title: string; parent_id: number; menu_type: number }>
> => {
  try {
    const response = await http.request<{
      code: number;
      message: string;
      data: Array<{
        id: number;
        parent_id: number;
        title: string;
        menu_type: number;
      }>;
    }>("get", "/api/menus/options");
    return response.data || [];
  } catch (error) {
    console.error("获取菜单选项失败:", error);
    return [];
  }
};

// ==================== 权限管理 API ====================

/** 后端权限列表响应 */
interface BackendPermissionListResponse {
  data: Array<{
    id: number;
    name: string;
    display_name: string;
    description?: string;
    resource: {
      resource: string;
      action: string;
    };
    action: string;
    is_active: boolean;
    menu_id?: number;
    menu?: {
      id: number;
      name: string;
      path: string;
    };
    sort?: number;
    created_at: string;
  }>;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

/** 获取权限列表(分页) */
export const getPermissionList = async (params?: {
  search?: string;
  resource?: string;
  menu_id?: number;
  is_active?: boolean | string;
  page?: number;
  per_page?: number;
}): Promise<ResultTable> => {
  try {
    const response = await http.request<BackendPermissionListResponse>(
      "get",
      "/api/permissions",
      {
        params: {
          search: params?.search || undefined,
          resource: params?.resource || undefined,
          menu_id: params?.menu_id || undefined,
          is_active:
            params?.is_active !== undefined && params?.is_active !== ""
              ? params.is_active === true || params.is_active === "1"
                ? 1
                : 0
              : undefined,
          page: params?.page || 1,
          per_page: params?.per_page || 15
        }
      }
    );

    return {
      success: true,
      data: {
        list: response.data.map(item => ({
          id: item.id,
          name: item.name,
          displayName: item.display_name,
          description: item.description,
          resource: item.resource?.resource || item.action?.split(":")[0] || "",
          action: item.action,
          isActive: item.is_active ? 1 : 0,
          menuId: item.menu_id,
          menuName: item.menu?.name || "-",
          menuTitle: item.menu?.path || "-",
          sort: item.sort,
          createTime: item.created_at
        })),
        total: response.meta.total,
        pageSize: response.meta.per_page,
        currentPage: response.meta.current_page
      }
    };
  } catch (error) {
    console.error("获取权限列表失败:", error);
    return { success: false, data: { list: [], total: 0 } };
  }
};

/** 新增权限 */
export const addPermission = async (data: {
  name: string;
  displayName: string;
  description?: string;
  resource: string;
  action: string;
  menuId?: number;
}): Promise<Result> => {
  try {
    await http.request("post", "/api/permissions", {
      data: {
        name: data.name,
        display_name: data.displayName,
        description: data.description,
        resource: data.resource,
        action: data.action,
        menu_id: data.menuId || null
      }
    });
    return { success: true, message: "创建成功" };
  } catch (error: any) {
    console.error("新增权限失败:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "创建失败"
    };
  }
};

/** 修改权限 */
export const updatePermission = async (data: {
  id: number;
  name?: string;
  displayName?: string;
  description?: string;
  resource?: string;
  action?: string;
  isActive?: number;
  menuId?: number;
}): Promise<Result> => {
  try {
    await http.request("put", `/api/permissions/${data.id}`, {
      data: {
        name: data.name,
        display_name: data.displayName,
        description: data.description,
        resource: data.resource,
        action: data.action,
        is_active: data.isActive === 1,
        menu_id: data.menuId || null
      }
    });
    return { success: true, message: "更新成功" };
  } catch (error: any) {
    console.error("修改权限失败:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "更新失败"
    };
  }
};

/** 删除权限 */
export const deletePermission = async (id: number): Promise<Result> => {
  try {
    await http.request("delete", `/api/permissions/${id}`);
    return { success: true, message: "删除成功" };
  } catch (error: any) {
    console.error("删除权限失败:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "删除失败"
    };
  }
};

// ==================== 文件上传 API ====================

/** 上传图片响应 */
interface UploadImageResponse {
  code: number;
  message: string;
  data: {
    url: string;
    path: string;
    driver: string;
    extension: string;
    hash: string;
    mime: string;
    original_name: string;
    size: number;
  };
}

/** 上传图片 */
export const uploadImage = async (
  file: File,
  directory: string = "images/avatar"
): Promise<{ success: boolean; path: string; url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  const response = await http.request<UploadImageResponse>(
    "post",
    "/api/upload/image",
    {
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return {
    success: response.code === 0,
    path: response.data.path,
    url: response.data.url
  };
};
