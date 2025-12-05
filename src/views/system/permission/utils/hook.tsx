import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getPermissionList,
  addPermission,
  updatePermission,
  deletePermission,
  getMenuList
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "./types";
import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";

export function usePermission() {
  const form = reactive({
    name: "",
    displayName: "",
    resource: "",
    menuId: "",
    isActive: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedIds = ref<number[]>([]);
  const menuOptions = ref<any[]>([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      reserveSelection: true
    },
    {
      label: "编号",
      prop: "id",
      width: 80
    },
    {
      label: "权限标识",
      prop: "name",
      minWidth: 180
    },
    {
      label: "显示名称",
      prop: "displayName",
      minWidth: 120
    },
    {
      label: "资源",
      prop: "resource",
      minWidth: 100
    },
    {
      label: "动作",
      prop: "action",
      minWidth: 100
    },
    {
      label: "所属菜单",
      prop: "menuId",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const menu = findMenuById(row.menuId);
        return <span>{menu ? menu.title : "-"}</span>;
      }
    },
    {
      label: "状态",
      prop: "isActive",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.isActive === 1 ? "success" : "danger"}>
          {row.isActive === 1 ? "已激活" : "已停用"}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "sort",
      width: 80
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  // 根据ID查找菜单
  function findMenuById(menuId: number) {
    if (!menuId) return null;
    return menuOptions.value.find(item => item.id === menuId);
  }

  function handleSelectionChange(val: any[]) {
    selectedIds.value = val.map(item => item.id);
  }

  async function loadMenuOptions() {
    const { data } = await getMenuList({});
    // 只获取菜单类型（非按钮）
    menuOptions.value = data.filter((item: any) => item.menuType !== 3);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getPermissionList(
      toRaw({
        ...form,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize
      })
    );
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  }

  function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  const formRef = ref();

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}权限`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          menuId: row?.menuId ?? undefined,
          name: row?.name ?? "",
          displayName: row?.displayName ?? "",
          description: row?.description ?? "",
          resource: row?.resource ?? "",
          action: row?.action ?? "",
          isActive: row?.isActive ?? 1,
          sort: row?.sort ?? 0
        },
        menuOptions: menuOptions.value
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            if (title === "新增") {
              const res = await addPermission(curData);
              if (res.success) {
                message("新增成功", { type: "success" });
                done();
                onSearch();
              } else {
                message(res.message || "新增失败", { type: "error" });
              }
            } else {
              const res = await updatePermission(curData);
              if (res.success) {
                message("修改成功", { type: "success" });
                done();
                onSearch();
              } else {
                message(res.message || "修改失败", { type: "error" });
              }
            }
          }
        });
      }
    });
  }

  async function handleDelete(row?: any) {
    const ids = row ? [row.id] : selectedIds.value;
    if (ids.length === 0) {
      message("请选择要删除的数据", { type: "warning" });
      return;
    }
    ElMessageBox.confirm(
      row
        ? `确认删除权限【${row.displayName}】吗?`
        : `确认删除选中的 ${ids.length} 条数据吗?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    ).then(async () => {
      await deletePermission(ids);
      message("删除成功", { type: "success" });
      onSearch();
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(async () => {
    await loadMenuOptions();
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    menuOptions,
    selectedIds,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
