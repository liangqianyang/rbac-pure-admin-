import { message } from "@/utils/message";
import { getMenuList, addMenu, updateMenu, deleteMenu } from "@/api/system";
import { ElMessageBox } from "element-plus";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";

export function useMenu() {
  const form = reactive({
    title: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const isExpandAll = ref(false);
  const refreshTable = ref(true);

  // 菜单类型映射
  const menuTypeMap: Record<number, { text: string; type: string }> = {
    0: { text: "菜单", type: "primary" },
    1: { text: "iframe", type: "warning" },
    2: { text: "外链", type: "danger" },
    3: { text: "按钮", type: "info" }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      width: 200,
      align: "left"
    },
    {
      label: "菜单类型",
      prop: "menuType",
      width: 100,
      cellRenderer: ({ row }) => {
        const type = menuTypeMap[row.menuType] || {
          text: "未知",
          type: "info"
        };
        return <el-tag type={type.type}>{type.text}</el-tag>;
      }
    },
    {
      label: "路由路径",
      prop: "path",
      minWidth: 160
    },
    {
      label: "组件路径",
      prop: "component",
      minWidth: 160
    },
    {
      label: "权限标识",
      prop: "permission",
      minWidth: 120
    },
    {
      label: "排序",
      prop: "sort",
      width: 80
    },
    {
      label: "隐藏",
      prop: "showLink",
      width: 80,
      cellRenderer: ({ row }) => <span>{row.showLink ? "否" : "是"}</span>
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuList(toRaw(form));
    // 转换为树形结构
    dataList.value = handleTree(data);
    loading.value = false;
  }

  function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 展开/折叠
  function toggleExpandAll() {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    setTimeout(() => {
      refreshTable.value = true;
    }, 100);
  }

  const formRef = ref();

  async function openDialog(title = "新增", row?: FormItemProps) {
    // 获取菜单列表作为上级菜单选项
    const { data: menuData } = await getMenuList({});
    const menuTree = handleTree(menuData);
    // 添加顶级选项
    const higherMenuOptions = [{ id: 0, title: "顶级", children: menuTree }];

    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          isAdd: title === "新增",
          higherMenuOptions,
          id: row?.id ?? undefined,
          parentId: row?.parentId ?? 0,
          menuType: row?.menuType ?? 0,
          title: row?.title ?? "",
          name: row?.name ?? "",
          path: row?.path ?? "",
          component: row?.component ?? "",
          redirect: row?.redirect ?? "",
          permission: row?.permission ?? "",
          icon: row?.icon ?? "",
          extraIcon: row?.extraIcon ?? "",
          enterTransition: row?.enterTransition ?? "",
          leaveTransition: row?.leaveTransition ?? "",
          frameSrc: row?.frameSrc ?? "",
          frameLoading: row?.frameLoading ?? true,
          sort: row?.sort ?? 99,
          showLink: row?.showLink ?? true,
          showParent: row?.showParent ?? true,
          keepAlive: row?.keepAlive ?? false,
          hiddenTag: row?.hiddenTag ?? false,
          fixedTag: row?.fixedTag ?? false,
          activePath: row?.activePath ?? "",
          status: row?.status ?? 1
        }
      },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            // 移除 higherMenuOptions 和 isAdd
            const submitData = { ...curData };
            delete submitData.higherMenuOptions;
            delete submitData.isAdd;

            if (title === "新增") {
              await addMenu(submitData);
              message("新增成功", { type: "success" });
            } else {
              await updateMenu(submitData);
              message("修改成功", { type: "success" });
            }
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 新增下级菜单
  function handleAddChild(row: any) {
    openDialog("新增", { parentId: row.id } as FormItemProps);
  }

  async function handleDelete(row: any) {
    await ElMessageBox.confirm(
      `确认要删除菜单【${row.title}】吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    const { success, message: msg } = await deleteMenu(row.id);
    if (success) {
      message("删除成功", { type: "success" });
      onSearch();
    } else {
      message(msg || "删除失败", { type: "error" });
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    isExpandAll,
    refreshTable,
    onSearch,
    resetForm,
    openDialog,
    handleAddChild,
    handleDelete,
    toggleExpandAll
  };
}
