// 模拟系统管理相关接口
import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 模拟用户数据
const userList = [
  {
    id: 1,
    username: "admin",
    nickname: "小铭",
    avatar: "https://avatars.githubusercontent.com/u/44761321",
    phone: "15888886789",
    email: "n0emzg.gue46@139.com",
    sex: 1,
    status: 1,
    remark: "管理员",
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 2,
    username: "common",
    nickname: "小林",
    avatar: "https://avatars.githubusercontent.com/u/52823142",
    phone: "18288882345",
    email: "common@163.com",
    sex: 0,
    status: 1,
    remark: "普通用户",
    createTime: "2020-11-16 00:00:00"
  }
];

// 模拟角色数据
const roleList = [
  {
    id: 1,
    name: "超级管理员",
    code: "admin",
    status: 1,
    remark: "超级管理员拥有最高权限",
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 2,
    name: "普通角色",
    code: "common",
    status: 1,
    remark: "普通角色拥有部分权限",
    createTime: "2020-11-16 00:00:00"
  }
];

// 模拟权限数据
const permissionList = [
  {
    id: 1,
    menuId: 101,
    name: "system:user:list",
    displayName: "用户列表",
    description: "查看用户列表数据",
    resource: "user",
    action: "list",
    isActive: 1,
    sort: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 2,
    menuId: 101,
    name: "system:user:add",
    displayName: "新增用户",
    description: "新增用户数据",
    resource: "user",
    action: "add",
    isActive: 1,
    sort: 2,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 3,
    menuId: 101,
    name: "system:user:edit",
    displayName: "编辑用户",
    description: "编辑用户数据",
    resource: "user",
    action: "edit",
    isActive: 1,
    sort: 3,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 4,
    menuId: 101,
    name: "system:user:delete",
    displayName: "删除用户",
    description: "删除用户数据",
    resource: "user",
    action: "delete",
    isActive: 1,
    sort: 4,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 5,
    menuId: 102,
    name: "system:role:list",
    displayName: "角色列表",
    description: "查看角色列表数据",
    resource: "role",
    action: "list",
    isActive: 1,
    sort: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 6,
    menuId: 102,
    name: "system:role:add",
    displayName: "新增角色",
    description: "新增角色数据",
    resource: "role",
    action: "add",
    isActive: 1,
    sort: 2,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 7,
    menuId: 102,
    name: "system:role:edit",
    displayName: "编辑角色",
    description: "编辑角色数据",
    resource: "role",
    action: "edit",
    isActive: 1,
    sort: 3,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 8,
    menuId: 102,
    name: "system:role:delete",
    displayName: "删除角色",
    description: "删除角色数据",
    resource: "role",
    action: "delete",
    isActive: 1,
    sort: 4,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 9,
    menuId: 103,
    name: "system:menu:list",
    displayName: "菜单列表",
    description: "查看菜单列表数据",
    resource: "menu",
    action: "list",
    isActive: 1,
    sort: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 10,
    menuId: 103,
    name: "system:menu:add",
    displayName: "新增菜单",
    description: "新增菜单数据",
    resource: "menu",
    action: "add",
    isActive: 1,
    sort: 2,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 11,
    menuId: 103,
    name: "system:menu:edit",
    displayName: "编辑菜单",
    description: "编辑菜单数据",
    resource: "menu",
    action: "edit",
    isActive: 1,
    sort: 3,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 12,
    menuId: 103,
    name: "system:menu:delete",
    displayName: "删除菜单",
    description: "删除菜单数据",
    resource: "menu",
    action: "delete",
    isActive: 1,
    sort: 4,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 13,
    menuId: 104,
    name: "system:permission:list",
    displayName: "权限列表",
    description: "查看权限列表数据",
    resource: "permission",
    action: "list",
    isActive: 1,
    sort: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 14,
    menuId: 104,
    name: "system:permission:add",
    displayName: "新增权限",
    description: "新增权限数据",
    resource: "permission",
    action: "add",
    isActive: 1,
    sort: 2,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 15,
    menuId: 104,
    name: "system:permission:edit",
    displayName: "编辑权限",
    description: "编辑权限数据",
    resource: "permission",
    action: "edit",
    isActive: 1,
    sort: 3,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 16,
    menuId: 104,
    name: "system:permission:delete",
    displayName: "删除权限",
    description: "删除权限数据",
    resource: "permission",
    action: "delete",
    isActive: 1,
    sort: 4,
    createTime: "2020-11-16 00:00:00"
  }
];

// 模拟菜单数据
const menuList = [
  {
    id: 1,
    parentId: 0,
    menuType: 0,
    title: "首页",
    name: "Home",
    path: "/",
    component: "",
    icon: "ep:home-filled",
    sort: 0,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 100,
    parentId: 0,
    menuType: 0,
    title: "系统管理",
    name: "PureSystem",
    path: "/system",
    component: "",
    icon: "ri:settings-3-line",
    sort: 10,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 101,
    parentId: 100,
    menuType: 0,
    title: "用户管理",
    name: "SystemUser",
    path: "/system/user/index",
    component: "system/user/index",
    icon: "ri:admin-line",
    sort: 1,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 102,
    parentId: 100,
    menuType: 0,
    title: "角色管理",
    name: "SystemRole",
    path: "/system/role/index",
    component: "system/role/index",
    icon: "ri:admin-fill",
    sort: 2,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 103,
    parentId: 100,
    menuType: 0,
    title: "菜单管理",
    name: "SystemMenu",
    path: "/system/menu/index",
    component: "system/menu/index",
    icon: "ep:menu",
    sort: 3,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 104,
    parentId: 100,
    menuType: 0,
    title: "权限管理",
    name: "SystemPermission",
    path: "/system/permission/index",
    component: "system/permission/index",
    icon: "ep:key",
    sort: 4,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  // 用户管理按钮
  {
    id: 1011,
    parentId: 101,
    menuType: 3,
    title: "新增用户",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:user:add",
    sort: 1,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1012,
    parentId: 101,
    menuType: 3,
    title: "修改用户",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:user:edit",
    sort: 2,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1013,
    parentId: 101,
    menuType: 3,
    title: "删除用户",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:user:delete",
    sort: 3,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  // 角色管理按钮
  {
    id: 1021,
    parentId: 102,
    menuType: 3,
    title: "新增角色",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:role:add",
    sort: 1,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1022,
    parentId: 102,
    menuType: 3,
    title: "修改角色",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:role:edit",
    sort: 2,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1023,
    parentId: 102,
    menuType: 3,
    title: "删除角色",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:role:delete",
    sort: 3,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1024,
    parentId: 102,
    menuType: 3,
    title: "分配权限",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:role:permission",
    sort: 4,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  // 菜单管理按钮
  {
    id: 1031,
    parentId: 103,
    menuType: 3,
    title: "新增菜单",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:menu:add",
    sort: 1,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1032,
    parentId: 103,
    menuType: 3,
    title: "修改菜单",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:menu:edit",
    sort: 2,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  },
  {
    id: 1033,
    parentId: 103,
    menuType: 3,
    title: "删除菜单",
    name: "",
    path: "",
    component: "",
    icon: "",
    permission: "system:menu:delete",
    sort: 3,
    showLink: false,
    showParent: false,
    keepAlive: false,
    status: 1,
    createTime: "2020-11-16 00:00:00"
  }
];

// 模拟用户-角色关联
const userRoleList = [
  { userId: 1, roleId: 1 },
  { userId: 2, roleId: 2 }
];

// 模拟角色-菜单关联 (admin拥有所有菜单, common拥有部分)
const roleMenuList = [
  // admin 角色拥有所有菜单
  ...menuList.map(menu => ({ roleId: 1, menuId: menu.id })),
  // common 角色拥有部分菜单
  { roleId: 2, menuId: 1 },
  { roleId: 2, menuId: 100 },
  { roleId: 2, menuId: 101 }
];

export default defineFakeRoute([
  // ==================== 用户管理 ====================
  {
    url: "/api/system/user/list",
    method: "post",
    response: ({ body }) => {
      const { username, phone, status, currentPage = 1, pageSize = 10 } = body;
      let list = [...userList];

      // 过滤
      if (username) {
        list = list.filter(item => item.username.includes(username));
      }
      if (phone) {
        list = list.filter(item => item.phone.includes(phone));
      }
      if (status !== undefined && status !== "") {
        list = list.filter(item => item.status === Number(status));
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const pageList = list.slice(start, end);

      return {
        success: true,
        data: {
          list: pageList,
          total: list.length,
          currentPage,
          pageSize
        }
      };
    }
  },
  {
    url: "/api/system/user/add",
    method: "post",
    response: ({ body }) => {
      const newUser = {
        id: userList.length + 1,
        ...body,
        createTime: new Date().toISOString().replace("T", " ").substring(0, 19)
      };
      userList.push(newUser);
      return { success: true, data: newUser };
    }
  },
  {
    url: "/api/system/user/update",
    method: "put",
    response: ({ body }) => {
      const index = userList.findIndex(item => item.id === body.id);
      if (index !== -1) {
        userList[index] = { ...userList[index], ...body };
        return { success: true, data: userList[index] };
      }
      return { success: false, message: "用户不存在" };
    }
  },
  {
    url: "/api/system/user/delete",
    method: "delete",
    response: ({ body }) => {
      const { ids } = body;
      ids.forEach((id: number) => {
        const index = userList.findIndex(item => item.id === id);
        if (index !== -1) {
          userList.splice(index, 1);
        }
      });
      return { success: true };
    }
  },
  {
    url: "/api/system/user/reset-password",
    method: "put",
    response: () => {
      return { success: true, message: "密码重置成功" };
    }
  },
  // 获取用户角色ID列表
  {
    url: "/api/system/user/role-ids",
    method: "post",
    response: ({ body }) => {
      const { userId } = body;
      const roleIds = userRoleList
        .filter(item => item.userId === userId)
        .map(item => item.roleId);
      return { success: true, data: roleIds };
    }
  },
  // 分配用户角色
  {
    url: "/api/system/user/assign-roles",
    method: "post",
    response: ({ body }) => {
      const { userId, roleIds } = body;
      // 删除原有关联
      const newUserRoleList = userRoleList.filter(
        item => item.userId !== userId
      );
      // 添加新关联
      roleIds.forEach((roleId: number) => {
        newUserRoleList.push({ userId, roleId });
      });
      userRoleList.length = 0;
      userRoleList.push(...newUserRoleList);
      return { success: true };
    }
  },

  // ==================== 角色管理 ====================
  {
    url: "/api/system/role/list",
    method: "post",
    response: ({ body }) => {
      const { name, code, status, currentPage = 1, pageSize = 10 } = body;
      let list = [...roleList];

      if (name) {
        list = list.filter(item => item.name.includes(name));
      }
      if (code) {
        list = list.filter(item => item.code.includes(code));
      }
      if (status !== undefined && status !== "") {
        list = list.filter(item => item.status === Number(status));
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const pageList = list.slice(start, end);

      return {
        success: true,
        data: {
          list: pageList,
          total: list.length,
          currentPage,
          pageSize
        }
      };
    }
  },
  {
    url: "/api/system/role/list-all",
    method: "get",
    response: () => {
      return {
        success: true,
        data: roleList.filter(item => item.status === 1)
      };
    }
  },
  {
    url: "/api/system/role/add",
    method: "post",
    response: ({ body }) => {
      const newRole = {
        id: roleList.length + 1,
        ...body,
        createTime: new Date().toISOString().replace("T", " ").substring(0, 19)
      };
      roleList.push(newRole);
      return { success: true, data: newRole };
    }
  },
  {
    url: "/api/system/role/update",
    method: "put",
    response: ({ body }) => {
      const index = roleList.findIndex(item => item.id === body.id);
      if (index !== -1) {
        roleList[index] = { ...roleList[index], ...body };
        return { success: true, data: roleList[index] };
      }
      return { success: false, message: "角色不存在" };
    }
  },
  {
    url: "/api/system/role/delete",
    method: "delete",
    response: ({ body }) => {
      const { ids } = body;
      ids.forEach((id: number) => {
        const index = roleList.findIndex(item => item.id === id);
        if (index !== -1) {
          roleList.splice(index, 1);
        }
      });
      return { success: true };
    }
  },
  // 获取角色菜单ID列表
  {
    url: "/api/system/role/menu-ids",
    method: "post",
    response: ({ body }) => {
      const { roleId } = body;
      const menuIds = roleMenuList
        .filter(item => item.roleId === roleId)
        .map(item => item.menuId);
      return { success: true, data: menuIds };
    }
  },
  // 分配角色菜单权限
  {
    url: "/api/system/role/assign-menus",
    method: "post",
    response: ({ body }) => {
      const { roleId, menuIds } = body;
      // 删除原有关联
      const newRoleMenuList = roleMenuList.filter(
        item => item.roleId !== roleId
      );
      // 添加新关联
      menuIds.forEach((menuId: number) => {
        newRoleMenuList.push({ roleId, menuId });
      });
      roleMenuList.length = 0;
      roleMenuList.push(...newRoleMenuList);
      return { success: true };
    }
  },

  // ==================== 菜单管理 ====================
  {
    url: "/api/system/menu/list",
    method: "post",
    response: ({ body }) => {
      const { title } = body;
      let list = [...menuList];

      if (title) {
        list = list.filter(item => item.title.includes(title));
      }

      // 按 sort 排序
      list.sort((a, b) => a.sort - b.sort);

      return {
        success: true,
        data: list
      };
    }
  },
  {
    url: "/api/system/menu/add",
    method: "post",
    response: ({ body }) => {
      const newMenu = {
        id: Math.max(...menuList.map(m => m.id)) + 1,
        ...body,
        createTime: new Date().toISOString().replace("T", " ").substring(0, 19)
      };
      menuList.push(newMenu);
      return { success: true, data: newMenu };
    }
  },
  {
    url: "/api/system/menu/update",
    method: "put",
    response: ({ body }) => {
      const index = menuList.findIndex(item => item.id === body.id);
      if (index !== -1) {
        menuList[index] = { ...menuList[index], ...body };
        return { success: true, data: menuList[index] };
      }
      return { success: false, message: "菜单不存在" };
    }
  },
  {
    url: "/api/system/menu/delete",
    method: "delete",
    response: ({ body }) => {
      const { id } = body;
      // 检查是否有子菜单
      const hasChildren = menuList.some(item => item.parentId === id);
      if (hasChildren) {
        return { success: false, message: "该菜单下有子菜单，无法删除" };
      }
      const index = menuList.findIndex(item => item.id === id);
      if (index !== -1) {
        menuList.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: "菜单不存在" };
    }
  },

  // ==================== 权限管理 ====================
  {
    url: "/api/system/permission/list",
    method: "post",
    response: ({ body }) => {
      const {
        name,
        displayName,
        resource,
        action,
        menuId,
        isActive,
        currentPage = 1,
        pageSize = 10
      } = body;
      let list = [...permissionList];

      // 过滤
      if (name) {
        list = list.filter(item => item.name.includes(name));
      }
      if (displayName) {
        list = list.filter(item => item.displayName.includes(displayName));
      }
      if (resource) {
        list = list.filter(item => item.resource.includes(resource));
      }
      if (action) {
        list = list.filter(item => item.action.includes(action));
      }
      if (menuId !== undefined && menuId !== "") {
        list = list.filter(item => item.menuId === menuId);
      }
      if (isActive !== undefined && isActive !== "") {
        list = list.filter(item => item.isActive === isActive);
      }

      // 按 sort 排序
      list.sort((a, b) => a.sort - b.sort);

      const total = list.length;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      return {
        success: true,
        data: {
          list: list.slice(start, end),
          total,
          currentPage,
          pageSize
        }
      };
    }
  },
  {
    url: "/api/system/permission/list-all",
    method: "get",
    response: () => {
      // 只返回激活的权限
      const list = permissionList.filter(item => item.isActive === 1);
      return {
        success: true,
        data: list.sort((a, b) => a.sort - b.sort)
      };
    }
  },
  {
    url: "/api/system/permission/list-by-menu",
    method: "post",
    response: ({ body }) => {
      const { menuId } = body;
      const list = permissionList.filter(
        item => item.menuId === menuId && item.isActive === 1
      );
      return {
        success: true,
        data: list.sort((a, b) => a.sort - b.sort)
      };
    }
  },
  {
    url: "/api/system/permission/add",
    method: "post",
    response: ({ body }) => {
      // 检查 name 是否唯一
      const existByName = permissionList.find(item => item.name === body.name);
      if (existByName) {
        return { success: false, message: "权限标识已存在" };
      }
      // 检查 resource + action 是否唯一
      const existByKey = permissionList.find(
        item => item.resource === body.resource && item.action === body.action
      );
      if (existByKey) {
        return { success: false, message: "资源和动作组合已存在" };
      }
      const newPermission = {
        id: Math.max(...permissionList.map(p => p.id)) + 1,
        ...body,
        createTime: new Date().toISOString().replace("T", " ").substring(0, 19)
      };
      permissionList.push(newPermission);
      return { success: true, data: newPermission };
    }
  },
  {
    url: "/api/system/permission/update",
    method: "put",
    response: ({ body }) => {
      const index = permissionList.findIndex(item => item.id === body.id);
      if (index !== -1) {
        // 检查 name 是否唯一（排除自身）
        const existByName = permissionList.find(
          item => item.name === body.name && item.id !== body.id
        );
        if (existByName) {
          return { success: false, message: "权限标识已存在" };
        }
        // 检查 resource + action 是否唯一（排除自身）
        const existByKey = permissionList.find(
          item =>
            item.resource === body.resource &&
            item.action === body.action &&
            item.id !== body.id
        );
        if (existByKey) {
          return { success: false, message: "资源和动作组合已存在" };
        }
        permissionList[index] = { ...permissionList[index], ...body };
        return { success: true, data: permissionList[index] };
      }
      return { success: false, message: "权限不存在" };
    }
  },
  {
    url: "/api/system/permission/delete",
    method: "delete",
    response: ({ body }) => {
      const { ids } = body;
      if (Array.isArray(ids)) {
        ids.forEach(id => {
          const index = permissionList.findIndex(item => item.id === id);
          if (index !== -1) {
            permissionList.splice(index, 1);
          }
        });
        return { success: true };
      }
      return { success: false, message: "参数错误" };
    }
  }
]);
