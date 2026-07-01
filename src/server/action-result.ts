// Server Action 统一返回结构，Client Component 可以稳定展示成功、失败和字段级错误。
export type ActionResult<T = undefined> = {
  ok: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function actionSuccess<T>(
  message: string,
  data?: T,
): ActionResult<T> {
  return {
    ok: true,
    message,
    data,
  };
}

export function actionFailure(
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionResult {
  return {
    ok: false,
    message,
    fieldErrors,
  };
}
