import { defineStore } from "pinia";
import {
  type cacheType,
  store,
  ascending,
  getKeyList,
  filterTree,
  constantMenus,
  filterNoPermissionTree,
  formatFlatteningRoutes
} from "../utils";
import { useMultiTagsStoreHook } from "./multiTags";
import { cloneDeep } from "@pureadmin/utils";

/** 清理路由对象中的额外字段 */
function cleanRouteFields(routes: any[]): any[] {
  if (!routes || !routes.length) return routes;
  return routes.map(route => {
    const cleaned = { ...route };
    // 删除 buildHierarchyTree 添加的字段
    delete cleaned.id;
    delete cleaned.parentId;
    delete cleaned.pathList;
    if (cleaned.children && cleaned.children.length) {
      cleaned.children = cleanRouteFields(cleaned.children);
    }
    return cleaned;
  });
}

export const usePermissionStore = defineStore("pure-permission", {
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 整体路由（一维数组格式）
    flatteningRoutes: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    handleWholeMenus(routes: any[]) {
      // 克隆并清理路由数据，避免污染原始数据
      const cleanedRoutes = cleanRouteFields(cloneDeep(routes));
      const cleanedConstantMenus = cleanRouteFields(
        cloneDeep(this.constantMenus)
      );

      this.wholeMenus = filterNoPermissionTree(
        filterTree(ascending(cleanedConstantMenus.concat(cleanedRoutes)))
      );
      this.flatteningRoutes = formatFlatteningRoutes(
        cloneDeep(this.constantMenus).concat(cloneDeep(routes)) as any
      );
    },
    /** 监听缓存页面是否存在于标签页，不存在则删除 */
    clearCache() {
      let cacheLength = this.cachePageList.length;
      const nameList = getKeyList(useMultiTagsStoreHook().multiTags, "name");
      while (cacheLength > 0) {
        nameList.findIndex(v => v === this.cachePageList[cacheLength - 1]) ===
          -1 &&
          this.cachePageList.splice(
            this.cachePageList.indexOf(this.cachePageList[cacheLength - 1]),
            1
          );
        cacheLength--;
      }
    },
    cacheOperate({ mode, name }: cacheType) {
      const delIndex = this.cachePageList.findIndex(v => v === name);
      switch (mode) {
        case "refresh":
          this.cachePageList = this.cachePageList.filter(v => v !== name);
          this.clearCache();
          break;
        case "add":
          this.cachePageList.push(name);
          break;
        case "delete":
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          this.clearCache();
          break;
      }
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
