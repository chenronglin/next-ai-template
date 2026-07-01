// 日期格式化放在共享工具中，避免页面里重复创建 Intl.DateTimeFormat。
const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value: Date | string) {
  return dateTimeFormatter.format(new Date(value));
}

export function getInitials(nameOrEmail: string) {
  // 头像兜底只取前两个可见字符，保证中文名、邮箱和英文名都能稳定显示。
  return nameOrEmail.trim().slice(0, 2).toUpperCase() || "U";
}
