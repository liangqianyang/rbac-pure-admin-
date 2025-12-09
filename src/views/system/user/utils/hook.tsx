import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserRoleIds,
  assignUserRoles,
  getAllRoleList
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps, RoleFormItemProps } from "./types";
import editForm from "../form/index.vue";
import roleForm from "../form/role.vue";
import { addDialog } from "@/components/ReDialog";

export function useUser() {
  const form = reactive({
    username: "",
    email: "",
    phone: "",
    status: "" as string | number
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

  // 头像预览状态
  const previewVisible = ref(false);
  const previewUrl = ref("");

  function handlePreview(url: string) {
    previewUrl.value = url;
    previewVisible.value = true;
  }

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
      width: 80
    },
    {
      label: "头像",
      prop: "avatar",
      width: 80,
      cellRenderer: ({ row }) => (
        <el-avatar
          size={36}
          src={row.avatar}
          style="cursor: pointer"
          onClick={() => row.avatar && handlePreview(row.avatar)}
        >
          {row.nickname?.charAt(0) || row.username?.charAt(0)}
        </el-avatar>
      )
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 100
    },
    {
      label: "昵称",
      prop: "nickname",
      minWidth: 100
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 160
    },
    {
      label: "手机号",
      prop: "phone",
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
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  async function _handleStatusChange(row: any) {
    const { id, status } = row;
    await updateUser({ id, status });
    message(`已${status === 1 ? "启用" : "停用"}该用户`, { type: "success" });
  }

  function handleSelectionChange(val: any[]) {
    selectedIds.value = val.map(item => item.id);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserList(
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

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          isAdd: title === "新增",
          id: row?.id ?? undefined,
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          email: row?.email ?? "",
          phone: row?.phone ?? "",
          sex: (row as any)?.gender ?? 0,
          avatar: row?.avatar ?? "",
          password: "",
          status: row?.status ?? 1
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: formRef,
          formInline: options.props.formInline
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (valid) {
            if (title === "新增") {
              await addUser(curData);
              message("新增成功", { type: "success" });
            } else {
              await updateUser(curData);
              message("修改成功", { type: "success" });
            }
            done();
            onSearch();
          }
        });
      }
    });
  }

  const formRef = ref();

  async function handleRole(row: any) {
    // 获取所有角色
    const { data: roleOptions } = await getAllRoleList();
    // 获取用户已有角色
    const { data: roleIds } = await getUserRoleIds(row.id);

    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          userId: row.id,
          username: row.username,
          nickname: row.nickname,
          roleOptions: roleOptions || [],
          roleIds: roleIds || []
        } as RoleFormItemProps
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        await assignUserRoles({
          userId: curData.userId,
          roleIds: curData.roleIds
        });
        message("分配角色成功", { type: "success" });
        done();
      }
    });
  }

  async function handleDelete(row?: any) {
    const ids = row ? [row.id] : selectedIds.value;
    if (ids.length === 0) {
      message("请选择要删除的用户", { type: "warning" });
      return;
    }
    await ElMessageBox.confirm(
      `确认要删除选中的 ${ids.length} 个用户吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await deleteUser(ids);
    message("删除成功", { type: "success" });
    onSearch();
  }

  async function handleResetPassword(row: any) {
    await ElMessageBox.confirm(
      `确认要重置用户 ${row.username} 的密码吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await resetUserPassword({ id: row.id, password: "123456" });
    message("密码重置成功，新密码为：123456", { type: "success" });
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
    previewVisible,
    previewUrl,
    onSearch,
    resetForm,
    openDialog,
    handleRole,
    handleDelete,
    handleResetPassword,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
