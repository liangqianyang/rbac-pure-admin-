// 登录接口已改为调用真实后端 API
// 此 mock 文件保留但为空，真实登录请求走 /api/auth/login
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([]);
