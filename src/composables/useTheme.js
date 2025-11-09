import { ref, computed, watch, onMounted } from 'vue';

// 主题模式常量
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// localStorage 键名
const THEME_STORAGE_KEY = 'app-theme-preference';

// 全局状态 - 使用单例模式确保所有组件共享同一个状态
let themeMode = null;
let effectiveTheme = null;
let systemPreference = null;

export function useTheme() {
  // 初始化全局状态（仅第一次调用时）
  if (themeMode === null) {
    themeMode = ref(THEME_MODES.AUTO);
    effectiveTheme = ref(THEME_MODES.LIGHT);
    systemPreference = ref(THEME_MODES.LIGHT);
  }

  // 获取系统主题偏好
  const getSystemPreference = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_MODES.DARK;
    }
    return THEME_MODES.LIGHT;
  };

  // 从 localStorage 加载主题偏好
  const loadThemePreference = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && Object.values(THEME_MODES).includes(saved)) {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    return THEME_MODES.AUTO;
  };

  // 保存主题偏好到 localStorage
  const saveThemePreference = (mode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // 计算实际应用的主题
  const calculateEffectiveTheme = computed(() => {
    if (themeMode.value === THEME_MODES.AUTO) {
      return systemPreference.value;
    }
    return themeMode.value;
  });

  // 应用主题到 DOM
  const applyTheme = (theme) => {
    const root = document.documentElement;

    // 移除所有主题类
    root.classList.remove('theme-light', 'theme-dark');

    // 添加当前主题类
    root.classList.add(`theme-${theme}`);

    // 设置 data 属性（方便 CSS 选择器使用）
    root.setAttribute('data-theme', theme);
  };

  // 切换到下一个主题模式
  const cycleTheme = () => {
    const modes = Object.values(THEME_MODES);
    const currentIndex = modes.indexOf(themeMode.value);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  // 设置主题模式
  const setThemeMode = (mode) => {
    if (Object.values(THEME_MODES).includes(mode)) {
      themeMode.value = mode;
      saveThemePreference(mode);
    }
  };

  // 监听系统主题变化
  const watchSystemPreference = () => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      systemPreference.value = e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    };

    // 现代浏览器使用 addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // 旧版浏览器兼容
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  };

  // 初始化主题
  const initTheme = () => {
    // 加载系统偏好
    systemPreference.value = getSystemPreference();

    // 加载用户偏好
    const savedMode = loadThemePreference();
    themeMode.value = savedMode;

    // 应用初始主题
    effectiveTheme.value = calculateEffectiveTheme.value;
    applyTheme(effectiveTheme.value);

    // 监听系统主题变化
    watchSystemPreference();
  };

  // 监听计算后的主题变化
  watch(calculateEffectiveTheme, (newTheme) => {
    effectiveTheme.value = newTheme;
    applyTheme(newTheme);
  });

  // 组件挂载时初始化（仅第一次）
  onMounted(() => {
    if (!document.documentElement.hasAttribute('data-theme')) {
      initTheme();
    }
  });

  return {
    // 状态
    themeMode,
    effectiveTheme,
    systemPreference,

    // 计算属性
    isLight: computed(() => effectiveTheme.value === THEME_MODES.LIGHT),
    isDark: computed(() => effectiveTheme.value === THEME_MODES.DARK),
    isAuto: computed(() => themeMode.value === THEME_MODES.AUTO),

    // 方法
    setThemeMode,
    cycleTheme,
    initTheme,

    // 常量
    THEME_MODES
  };
}
