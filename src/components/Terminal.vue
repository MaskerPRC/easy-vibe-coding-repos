<template>
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="terminal-buttons">
        <span class="btn-close"></span>
        <span class="btn-minimize"></span>
        <span class="btn-maximize"></span>
      </div>
      <div class="terminal-title">root@raspberrypi: ~</div>
    </div>
    <div class="terminal-body" ref="terminalBody" @click="focusInput">
      <div class="terminal-content">
        <div v-for="(line, index) in history" :key="index" class="terminal-line">
          <div v-if="line.type === 'command'" class="command-line">
            <span class="prompt">{{ prompt }}</span>
            <span class="command-text">{{ line.content }}</span>
          </div>
          <div v-else-if="line.type === 'output'" class="output-line">
            <pre>{{ line.content }}</pre>
          </div>
          <div v-else-if="line.type === 'error'" class="error-line">
            <pre>{{ line.content }}</pre>
          </div>
        </div>
        <div class="terminal-line current-line">
          <span class="prompt">{{ prompt }}</span>
          <input
            ref="commandInput"
            v-model="currentCommand"
            @keydown.enter="executeCommand"
            @keydown.up="navigateHistory(-1)"
            @keydown.down="navigateHistory(1)"
            @keydown.tab.prevent="handleTab"
            class="command-input"
            spellcheck="false"
            autocomplete="off"
          />
          <span class="cursor"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const terminalBody = ref(null);
const commandInput = ref(null);
const currentCommand = ref('');
const history = ref([
  { type: 'output', content: `The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Nov  8 21:41:39 2025 from 192.168.8.1

Wi-Fi is currently blocked by rfkill.
Use raspi-config to set the country before use.` }
]);

const commandHistory = ref([]);
const historyIndex = ref(-1);
const prompt = ref('root@raspberrypi:~ $');

// 文件系统模拟
const fileSystem = ref({
  '/': {
    'root': {
      'readme.txt': 'Welcome to Raspberry Pi!\n\nFor more information, visit https://www.raspberrypi.org/',
      'notes.txt': 'My personal notes'
    },
    'home': {
      'pi': {}
    },
    'etc': {
      'hostname': 'raspberrypi',
      'hosts': '127.0.0.1\tlocalhost\n127.0.1.1\traspberrypi'
    },
    'var': {
      'log': {}
    },
    'usr': {
      'bin': {},
      'local': {}
    },
    'boot': {}
  }
});

const currentPath = ref('/root');

// 可用命令
const commands = {
  help: () => {
    return `GNU bash, version 5.1.4(1)-release (arm-unknown-linux-gnueabihf)
These shell commands are defined internally. Type 'help' to see this list.

Available commands:
  help            - Show this help message
  ls              - List directory contents
  pwd             - Print working directory
  cd [dir]        - Change directory
  clear           - Clear terminal screen
  echo [text]     - Display text
  whoami          - Display current user
  hostname        - Display system hostname
  date            - Display current date and time
  uname [-a]      - Display system information
  cat [file]      - Display file contents
  mkdir [dir]     - Create directory
  touch [file]    - Create file
  rm [file]       - Remove file
  free [-h]       - Display memory usage
  df [-h]         - Display disk usage
  uptime          - Show system uptime
  ps              - Display running processes
  ifconfig        - Display network interfaces
  ping [host]     - Ping a host
  reboot          - Reboot the system (simulated)
  shutdown        - Shutdown the system (simulated)`;
  },

  ls: () => {
    const parts = currentPath.value.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      }
    }

    if (typeof current === 'string') {
      return 'Not a directory';
    }

    const items = Object.keys(current);
    return items.length > 0 ? items.join('  ') : '';
  },

  pwd: () => {
    return currentPath.value;
  },

  cd: (args) => {
    if (!args || args === '~') {
      currentPath.value = '/root';
      updatePrompt();
      return '';
    }

    if (args === '..') {
      const parts = currentPath.value.split('/').filter(p => p);
      parts.pop();
      currentPath.value = '/' + parts.join('/');
      updatePrompt();
      return '';
    }

    if (args === '/') {
      currentPath.value = '/';
      updatePrompt();
      return '';
    }

    const newPath = args.startsWith('/') ? args : `${currentPath.value}/${args}`;
    const parts = newPath.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part] && typeof current[part] === 'object') {
        current = current[part];
      } else {
        return `cd: ${args}: No such file or directory`;
      }
    }

    currentPath.value = '/' + parts.join('/');
    updatePrompt();
    return '';
  },

  clear: () => {
    history.value = [];
    return null;
  },

  echo: (args) => {
    return args || '';
  },

  whoami: () => {
    return 'root';
  },

  hostname: () => {
    return 'raspberrypi';
  },

  date: () => {
    return new Date().toString();
  },

  uname: (args) => {
    if (args === '-a') {
      return 'Linux raspberrypi 6.1.21-v8+ #1642 SMP PREEMPT Mon Apr  3 17:24:16 BST 2023 aarch64 GNU/Linux';
    }
    return 'Linux';
  },

  cat: (args) => {
    if (!args) {
      return 'cat: missing file operand';
    }

    const parts = currentPath.value.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      }
    }

    if (current[args] && typeof current[args] === 'string') {
      return current[args];
    }

    return `cat: ${args}: No such file or directory`;
  },

  mkdir: (args) => {
    if (!args) {
      return 'mkdir: missing operand';
    }

    const parts = currentPath.value.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      }
    }

    if (current[args]) {
      return `mkdir: cannot create directory '${args}': File exists`;
    }

    current[args] = {};
    return '';
  },

  touch: (args) => {
    if (!args) {
      return 'touch: missing file operand';
    }

    const parts = currentPath.value.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      }
    }

    current[args] = '';
    return '';
  },

  rm: (args) => {
    if (!args) {
      return 'rm: missing operand';
    }

    const parts = currentPath.value.split('/').filter(p => p);
    let current = fileSystem.value['/'];

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      }
    }

    if (current[args]) {
      delete current[args];
      return '';
    }

    return `rm: cannot remove '${args}': No such file or directory`;
  },

  free: (args) => {
    const total = 3892;
    const used = 2105;
    const free = total - used;
    const available = 1787;

    if (args === '-h') {
      return `              total        used        free      shared  buff/cache   available
Mem:          3.8Gi       2.1Gi       1.7Gi        52Mi       123Mi       1.7Gi
Swap:          99Mi          0B        99Mi`;
    }

    return `              total        used        free      shared  buff/cache   available
Mem:        ${total}        ${used}        ${free}          52         123        ${available}
Swap:         99           0          99`;
  },

  df: (args) => {
    if (args === '-h') {
      return `Filesystem      Size  Used Avail Use% Mounted on
/dev/root        29G   12G   16G  44% /
devtmpfs        1.8G     0  1.8G   0% /dev
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           784M  8.9M  775M   2% /run
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
/dev/mmcblk0p1  255M   31M  225M  13% /boot
tmpfs           392M   20K  392M   1% /run/user/0`;
    }

    return `Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/root       30408704 12563456  16583776  44% /
devtmpfs         1888308        0   1888308   0% /dev
tmpfs            1989008        0   1989008   0% /dev/shm
tmpfs             802704     9096    793608   2% /run
tmpfs               5120        4      5116   1% /run/lock
/dev/mmcblk0p1    261108    31344    229764  13% /boot
tmpfs             401800       20    401780   1% /run/user/0`;
  },

  uptime: () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return ` ${hours}:${minutes}:${now.getSeconds().toString().padStart(2, '0')} up 3 days, 12:34,  1 user,  load average: 0.15, 0.24, 0.18`;
  },

  ps: () => {
    return `  PID TTY          TIME CMD
    1 ?        00:00:03 systemd
  234 ?        00:00:00 sshd
  456 ?        00:00:01 cron
  789 pts/0    00:00:00 bash
  790 pts/0    00:00:00 ps`;
  },

  ifconfig: () => {
    return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.8.100  netmask 255.255.255.0  broadcast 192.168.8.255
        inet6 fe80::ba27:ebff:fe1e:8c3a  prefixlen 64  scopeid 0x20<link>
        ether b8:27:eb:1e:8c:3a  txqueuelen 1000  (Ethernet)
        RX packets 12345  bytes 1234567 (1.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9876  bytes 987654 (964.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 123  bytes 12345 (12.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 123  bytes 12345 (12.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`;
  },

  ping: (args) => {
    if (!args) {
      return 'ping: usage error: Destination address required';
    }
    return `PING ${args} (8.8.8.8) 56(84) bytes of data.
64 bytes from ${args}: icmp_seq=1 ttl=117 time=12.3 ms
64 bytes from ${args}: icmp_seq=2 ttl=117 time=11.8 ms
64 bytes from ${args}: icmp_seq=3 ttl=117 time=13.1 ms
^C
--- ${args} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 11.823/12.400/13.101/0.537 ms`;
  },

  reboot: () => {
    setTimeout(() => {
      history.value = [];
      setTimeout(() => {
        history.value.push({
          type: 'output',
          content: 'Broadcast message from root@raspberrypi\nThe system is going down for reboot NOW!'
        });
        setTimeout(() => {
          history.value = [];
          history.value.push({
            type: 'output',
            content: `The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Nov  8 21:45:12 2025 from 192.168.8.1

Wi-Fi is currently blocked by rfkill.
Use raspi-config to set the country before use.`
          });
        }, 2000);
      }, 500);
    }, 1000);
    return 'The system is going down for reboot NOW!';
  },

  shutdown: () => {
    setTimeout(() => {
      history.value.push({
        type: 'output',
        content: 'Broadcast message from root@raspberrypi\nThe system is going down for poweroff NOW!'
      });
      setTimeout(() => {
        history.value = [];
        history.value.push({
          type: 'output',
          content: 'System halted.'
        });
      }, 2000);
    }, 1000);
    return 'The system is going down for poweroff NOW!';
  }
};

const updatePrompt = () => {
  const path = currentPath.value === '/root' ? '~' : currentPath.value;
  prompt.value = `root@raspberrypi:${path} $`;
};

const executeCommand = async () => {
  const command = currentCommand.value.trim();

  if (!command) {
    return;
  }

  // 添加命令到历史记录
  history.value.push({
    type: 'command',
    content: command
  });

  commandHistory.value.unshift(command);
  historyIndex.value = -1;

  // 解析命令
  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');

  // 执行命令
  if (commands[cmd]) {
    const result = commands[cmd](args);
    if (result !== null) {
      history.value.push({
        type: 'output',
        content: result
      });
    }
  } else {
    history.value.push({
      type: 'error',
      content: `bash: ${cmd}: command not found`
    });
  }

  currentCommand.value = '';

  await nextTick();
  scrollToBottom();
};

const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return;

  historyIndex.value += direction;

  if (historyIndex.value < -1) {
    historyIndex.value = -1;
  } else if (historyIndex.value >= commandHistory.value.length) {
    historyIndex.value = commandHistory.value.length - 1;
  }

  if (historyIndex.value === -1) {
    currentCommand.value = '';
  } else {
    currentCommand.value = commandHistory.value[historyIndex.value];
  }
};

const handleTab = () => {
  // 简单的自动补全功能
  const cmd = currentCommand.value.trim();
  const availableCommands = Object.keys(commands);
  const matches = availableCommands.filter(c => c.startsWith(cmd));

  if (matches.length === 1) {
    currentCommand.value = matches[0];
  } else if (matches.length > 1) {
    history.value.push({
      type: 'output',
      content: matches.join('  ')
    });
  }
};

const focusInput = () => {
  commandInput.value?.focus();
};

const scrollToBottom = () => {
  if (terminalBody.value) {
    terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
  }
};

onMounted(() => {
  focusInput();
});
</script>

<style scoped>
.terminal-container {
  width: 100%;
  max-width: 100%;
  height: 100vh;
  background: #f5f5f5;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
}

.terminal-header {
  background: #e0e0e0;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.terminal-buttons {
  display: flex;
  gap: 8px;
  margin-right: 15px;
}

.terminal-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.btn-close {
  background: #ff5f56;
}

.btn-minimize {
  background: #ffbd2e;
}

.btn-maximize {
  background: #27c93f;
}

.terminal-title {
  color: #333;
  font-size: 13px;
  font-weight: 500;
}

.terminal-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #ffffff;
  cursor: text;
}

.terminal-content {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.terminal-line {
  margin-bottom: 4px;
}

.command-line {
  display: flex;
}

.prompt {
  color: #28a745;
  margin-right: 8px;
  font-weight: bold;
  white-space: nowrap;
}

.command-text {
  color: #333;
}

.output-line pre,
.error-line pre {
  margin: 0;
  padding: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-line {
  color: #555;
  margin-left: 0;
}

.error-line {
  color: #dc3545;
  margin-left: 0;
}

.current-line {
  display: flex;
  align-items: center;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #333;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  caret-color: #28a745;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #28a745;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

.terminal-body::-webkit-scrollbar {
  width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.terminal-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.terminal-body::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
