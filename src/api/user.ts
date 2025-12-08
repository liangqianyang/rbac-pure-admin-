import { http } from "@/utils/http";

/** 后端登录响应类型 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

/** 获取当前用户信息响应 */
export interface MeResponse {
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  permissions: string[];
  roles: string[];
}

/** 刷新 Token 响应 */
export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
}

/** 前端使用的用户结果类型 */
export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 计算过期时间 */
function calculateExpires(expiresIn: number): Date {
  const now = new Date();
  return new Date(now.getTime() + expiresIn * 1000);
}

/** 登录 */
export const getLogin = async (data: {
  email: string;
  password: string;
}): Promise<UserResult> => {
  try {
    const response = await http.request<LoginResponse>(
      "post",
      "/api/auth/login",
      { data }
    );
    // 登录成功后获取用户详细信息
    const meResponse = await http.request<MeResponse>("get", "/api/auth/me", {
      headers: {
        Authorization: `Bearer ${response.access_token}`
      }
    });

    return {
      success: true,
      data: {
        avatar: "", // 后端暂未提供头像字段
        username: response.user.name,
        nickname: response.user.name,
        roles: meResponse.roles,
        permissions: meResponse.permissions,
        accessToken: response.access_token,
        refreshToken: response.access_token, // JWT 使用同一个 token 刷新
        expires: calculateExpires(response.expires_in)
      }
    };
  } catch (error: any) {
    console.error("登录失败:", error);
    throw error;
  }
};

/** 刷新`token` */
export const refreshTokenApi = async (data?: {
  refreshToken: string;
}): Promise<RefreshTokenResult> => {
  try {
    const response = await http.request<RefreshTokenResponse>(
      "post",
      "/api/auth/refresh",
      {
        headers: {
          Authorization: `Bearer ${data?.refreshToken}`
        }
      }
    );

    return {
      success: true,
      data: {
        accessToken: response.access_token,
        refreshToken: response.access_token,
        expires: calculateExpires(response.expires_in)
      }
    };
  } catch (error: any) {
    console.error("刷新 token 失败:", error);
    throw error;
  }
};

/** 获取当前用户信息 */
export const getCurrentUser = async (): Promise<MeResponse> => {
  return http.request<MeResponse>("get", "/api/auth/me");
};

/** 退出登录 */
export const logout = async (): Promise<void> => {
  return http.request("post", "/api/auth/logout");
};
