import qs from "qs";
import axios from 'axios';

// --- 1. 生成 Key (保持原逻辑) ---
function generateReqKey(config) {
  const { method, url, params, data } = config;
  if (!url) return null;

  // 去除 URL 中的查询参数
  let urlString = url.indexOf("?", 0) === -1 ? url : url.substring(0, url.indexOf("?", 0));

  // 统一序列化参数
  // 注意：qs.stringify 可能会因为对象键顺序不同产生不同结果，确保业务层 params 结构稳定
  let shuju = method?.toUpperCase() === 'GET' ? qs.stringify(params) : qs.stringify(data);

  return shuju ? [urlString, method, shuju].join('&') : [urlString, method].join('&');
}

// --- 2. 全局存储 ---
const pendingRequest = new Map();

/**
 * 添加请求到 pending 列表
 * 策略：后浪拍死前浪 (发现重复 -> 取消旧的 -> 注册新的)
 */
export function addPendingRequest(config) {
  const requestKey = generateReqKey(config);
  if (!requestKey) return config;

  // 1. 检查是否存在重复请求
  if (pendingRequest.has(requestKey)) {
    const oldController = pendingRequest.get(requestKey);

    // 【关键动作】取消旧的请求
    // 这会导致旧请求进入 error 拦截器，错误名为 CanceledError
    oldController.abort('DuplicateRequestCanceled');

    // 立即从 Map 移除旧的记录，为新请求腾位置
    pendingRequest.delete(requestKey);
  }

  // 2. 创建新的控制器
  const newController = new AbortController();

  // 3. 存入 Map
  pendingRequest.set(requestKey, newController);

  // 4. 绑定 signal 和 控制器实例 (身份证) 到 config
  config.signal = newController.signal;
  config._currentController = newController; // 【新增核心】挂载身份标识

  return config;
}

/**
 * 手动取消特定请求
 */
export function removePendingRequest(config) {
  const requestKey = generateReqKey(config);
  if (!requestKey || !pendingRequest.has(requestKey)) return;

  const controller = pendingRequest.get(requestKey);
  controller.abort('ManuallyCanceled');
  pendingRequest.delete(requestKey);
}

/**
 * 清除所有请求
 */
export function clearAllRequest() {
  pendingRequest.forEach((controller) => {
    controller.abort('ClearAllCanceled');
  });
  pendingRequest.clear();
}

/**
 * 请求完成后的清理函数 (成功或失败都调用)
 * 【核心改造】增加身份校验，防止误删新请求
 */
export function removeFinishedRequest(config) {
  if (!config) return;
  const requestKey = generateReqKey(config);
  if (!requestKey) return;

  if (pendingRequest.has(requestKey)) {
    const storedController = pendingRequest.get(requestKey);
    const currentController = config._currentController;

    // 【核心校验】
    // 只有当 Map 里的控制器 和 当前请求携带的控制器 是同一个实例时，才删除！
    // 场景：请求 A 被 B 取代 -> A 触发 error -> A 进来清理 -> 发现 Map 里已经是 B 了 -> A 停止操作，保护 B
    if (currentController && currentController === storedController) {
      pendingRequest.delete(requestKey);
      // console.log(`✅ 正常清理: ${requestKey}`);
    } else {
      // console.warn(`⚠️ 跳过清理: 请求 ${requestKey} 已被新请求取代，保留新请求.`);
    }
  }
}
