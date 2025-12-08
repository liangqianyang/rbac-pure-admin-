// 刷新Token接口已改为调用真实后端 API
// 此 mock 文件保留但为空，真实刷新请求走 /api/auth/refresh
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([]);
