/**
 * 站点转换状态管理 Store
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { applyDSLPatch, undoDSLPatch, resetToInitial } from '../utils/patchEngine';

export const useTransformStore = defineStore('transform', () => {
  // 状态
  const sessionId = ref('');
  const appliedTransforms = ref([]);
  const isActive = ref(false);

  // 计算属性
  const transformCount = computed(() => appliedTransforms.value.length);

  // 应用转换
  const applyTransform = (dsl) => {
    try {
      const result = applyDSLPatch(dsl);

      if (result.success) {
        appliedTransforms.value.push({
          dsl,
          timestamp: Date.now(),
          result
        });
        isActive.value = true;
        return { success: true };
      } else {
        return {
          success: false,
          error: '部分变更应用失败',
          details: result.results.filter(r => !r.success)
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 撤销转换
  const undoTransform = (dsl) => {
    try {
      const result = undoDSLPatch(dsl);

      if (result.success) {
        appliedTransforms.value.pop();
        if (appliedTransforms.value.length === 0) {
          isActive.value = false;
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: '撤销失败',
          details: result.results.filter(r => !r.success)
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 重置到初始状态
  const reset = () => {
    try {
      const result = resetToInitial();
      appliedTransforms.value = [];
      isActive.value = false;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 设置会话 ID
  const setSessionId = (id) => {
    sessionId.value = id;
  };

  return {
    sessionId,
    appliedTransforms,
    isActive,
    transformCount,
    applyTransform,
    undoTransform,
    reset,
    setSessionId
  };
});
