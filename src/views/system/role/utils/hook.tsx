import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getRoleMenuIds,
  assignRoleMenus,
  getMenuList
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps, MenuFormItemProps } from "./types";
import editForm from "../form.vue";
import menuForm from "../menu.vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";

export function useRole() {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
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
      label: "角色编号",
      prop: "id",
      width: 100
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "code",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.status === 1 ? "success" : "danger"}>
          {row.status === 1 ? "已启用" : "已停用"}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "remark",
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

  async function _handleStatusChange(row: any) {
    const { id, status } = row;
    await updateRole({ id, status });
    message(`已${status === 1 ? "启用" : "停用"}该角色`, { type: "success" });
  }

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
          name: row?.name ?? "",
          code: row?.code ?? "",
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
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
    // 获取所有菜单
    const { data: menuData } = await getMenuList({});
    // 转换为树形结构
    const menuTree = handleTree(menuData);
    // 获取角色已有菜单
    const { data: menuIds } = await getRoleMenuIds(row.id);

    addDialog({
      title: `菜单权限（${row.name}）`,
      props: {
        formInline: {
          roleId: row.id,
          roleName: row.name,
          menuOptions: menuTree || [],
          menuIds: menuIds || []
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
        message("分配菜单权限成功", { type: "success" });
        done();
      }
    });
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
