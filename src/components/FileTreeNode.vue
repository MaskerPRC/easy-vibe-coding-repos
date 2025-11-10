<template>
  <div class="tree-node">
    <div
      class="node-label"
      :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
      @click="toggleExpand"
    >
      <span v-if="isDirectory" class="expand-icon">{{ isExpanded ? '▼' : '▶' }}</span>
      <span v-else class="file-icon">📄</span>
      <span class="node-icon">{{ isDirectory ? '📁' : getFileIcon(node.name) }}</span>
      <span class="node-name" :title="node.path">{{ node.name }}</span>
    </div>
    <div v-if="isDirectory && isExpanded && node.children" class="node-children">
      <FileTreeNode
        v-for="(child, index) in node.children"
        :key="child.path || index"
        :node="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
});

const isExpanded = ref(props.depth < 2); // 默认展开前两层

const isDirectory = computed(() => props.node.type === 'directory');

const toggleExpand = () => {
  if (isDirectory.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    'js': '📜',
    'vue': '💚',
    'json': '📋',
    'md': '📝',
    'html': '🌐',
    'css': '🎨',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'pdf': '📕',
    'txt': '📄',
    'zip': '📦',
    'env': '⚙️',
  };
  return iconMap[ext] || '📄';
};
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-label {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  cursor: pointer;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-label:hover {
  background: #f0f0f0;
}

.expand-icon {
  display: inline-block;
  width: 12px;
  font-size: 8px;
  margin-right: 4px;
  color: black;
}

.file-icon {
  display: inline-block;
  width: 12px;
  margin-right: 4px;
  opacity: 0;
}

.node-icon {
  margin-right: 6px;
  font-size: 14px;
}

.node-name {
  font-size: 13px;
  color: black;
}

.node-children {
  /* 子节点容器 */
}
</style>
