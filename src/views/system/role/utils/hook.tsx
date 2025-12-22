import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getRoleMenuIds,
  assignRoleMenus,
  getPermissionsGrouped
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps, MenuFormItemProps } from "./types";
import editForm from "../form.vue";
import menuForm from "../menu.vue";
import { addDialog } from "@/components/ReDialog";

export function useRole() {
  const form = reactive({
    search: "",
    is_active: null as boolean | null
  });
  const dataList = ref([]);
  const loading = ref(true);
  const menuLoading = ref(false); // 权限按钮加载状态
  const selectedIds = ref<number[]>([]);

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
      label: "ID",
      prop: "id",
      width: 100
    },
    {
      label: "角色标识",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色名称",
      prop: "display_name",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "is_active",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.is_active ? "success" : "danger"}>
          {row.is_active ? "已启用" : "已停用"}
        </el-tag>
      )
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 160
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
      width: 200,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val: any[]) {
    selectedIds.value = val.map(item => item.id);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getRoleList(
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
      title: `${title}角色`,
      props: {
        formInline: {
          isAdd: title === "新增",
          id: row?.id ?? undefined,
          display_name: row?.display_name ?? "",
          name: row?.name ?? "",
          is_active: row?.is_active ?? true,
          description: row?.description ?? ""
        }
      },
      width: "500px",
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
              await addRole(curData);
              message("新增成功", { type: "success" });
            } else {
              await updateRole(curData);
              message("修改成功", { type: "success" });
            }
            done();
            onSearch();
          }
        });
      }
    });
  }

  const menuFormRef = ref();

  async function handleMenu(row: any) {
    // 防止重复点击
    if (menuLoading.value) return;
    menuLoading.value = true;

    try {
      // 获取按菜单分组的权限列表
      const { data: permissionsData } = await getPermissionsGrouped();
      // 转换为树形结构（按菜单分组的权限已经是树形结构）
      const menuTree = permissionsData.map((menu: any) => ({
        id: `menu_${menu.menu_id}`, // 菜单节点使用特殊前缀避免与权限ID冲突
        title: menu.menu_title,
        children:
          menu.permissions?.map((perm: any) => ({
            id: perm.id,
            title: perm.display_name || perm.name
          })) || []
      }));

      // 获取角色已有权限
      const { data: permissionIds } = await getRoleMenuIds(row.id);

      addDialog({
        title: `权限设置（${row.display_name}）`,
        props: {
          formInline: {
            roleId: row.id,
            roleName: row.display_name,
            menuOptions: menuTree || [],
            menuIds: permissionIds || []
          } as MenuFormItemProps
        },
        width: "500px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(menuForm, { ref: menuFormRef }),
        beforeSure: async done => {
          const checkedMenuIds = menuFormRef.value.getCheckedMenuIds();
          await assignRoleMenus({
            roleId: row.id,
            menuIds: checkedMenuIds
          });
          message("分配权限成功", { type: "success" });
          done();
        }
      });
    } finally {
      menuLoading.value = false;
    }
  }

  async function handleDelete(row?: any) {
    const ids = row ? [row.id] : selectedIds.value;
    if (ids.length === 0) {
      message("请选择要删除的角色", { type: "warning" });
      return;
    }
    await ElMessageBox.confirm(
      `确认要删除选中的 ${ids.length} 个角色吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await deleteRole(ids);
    message("删除成功", { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    menuLoading,
    columns,
    dataList,
    pagination,
    selectedIds,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleDelete,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
