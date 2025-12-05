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
    phone: "",
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
      label: "用户编号",
      prop: "id",
      width: 100
    },
    {
      label: "用户头像",
      prop: "avatar",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-avatar size={32} src={row.avatar}>
          {row.nickname?.charAt(0) || row.username?.charAt(0)}
        </el-avatar>
      )
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 120
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 120
    },
    {
      label: "性别",
      prop: "sex",
      width: 80,
      cellRenderer: ({ row }) => (
        <el-tag type={row.sex === 1 ? "primary" : "danger"}>
          {row.sex === 1 ? "男" : "女"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 120,
      formatter: ({ phone }) => {
        return phone?.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") || "";
      }
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
          nickname: row?.nickname ?? "",
          username: row?.username ?? "",
          password: "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          sex: row?.sex ?? 1,
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
        }
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
