import { http } from "@/utils/http";

/** 动态路由返回类型 */
type AsyncRoutesResult = {
  success: boolean;
  data: Array<any>;
};

/** 后端API返回的菜单路由格式 */
interface UserRoutesResponse {
  code: number;
  message: string;
  data: {
    routes: Array<any>;
    permissions: Array<string>;
  };
}

/** 获取当前用户的动态路由 */
export const getAsyncRoutes = async (): Promise<AsyncRoutesResult> => {
  try {
    const response = await http.request<UserRoutesResponse>(
      "get",
      "/api/menus/user-routes"
    );

    if (response.code === 0 && response.data?.routes) {
      return {
        success: true,
        data: response.data.routes
      };
    }

    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error("获取动态路由失败:", error);
    return {
      success: false,
      data: []
    };
  }
};

/** 获取当前用户的按钮权限列表 */
export const getUserPermissions = async (): Promise<Array<string>> => {
  try {
    const response = await http.request<UserRoutesResponse>(
      "get",
      "/api/menus/user-routes"
    );

    if (response.code === 0 && response.data?.permissions) {
      return response.data.permissions;
    }

    return [];
  } catch (error) {
    console.error("获取用户权限失败:", error);
    return [];
  }
};
