<template>
  <svg :width="width" :height="height" viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg">
    <!-- 终端背景 -->
    <rect width="900" height="700" :fill="backgroundColor" />

    <!-- Linux Kernel Panic -->
    <g v-if="osType === 'linux'" font-family="'Courier New', 'Monaco', monospace" font-size="11">
      <!-- Kernel Panic 标题 -->
      <text x="10" y="20" fill="#FF0000" font-weight="bold" font-size="12">
        Kernel panic - not syncing: Fatal exception in interrupt
      </text>

      <!-- 寄存器信息 -->
      <text x="10" y="50" :fill="textColor">
        CPU: 0 PID: 0 Comm: swapper/0 Not tainted 5.15.0-generic #47-Ubuntu
      </text>
      <text x="10" y="65" :fill="textColor">
        Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)
      </text>

      <!-- 调用栈 -->
      <text x="10" y="95" fill="#FFFF00" font-weight="bold">
        Call Trace:
      </text>
      <text x="10" y="110" :fill="textColor">
        &lt;IRQ&gt;
      </text>
      <text x="30" y="125" :fill="textColor">
        dump_stack+0x6d/0x8b
      </text>
      <text x="30" y="140" :fill="textColor">
        panic+0x101/0x2e3
      </text>
      <text x="30" y="155" :fill="textColor">
        ? kmsg_dump+0x92/0xa0
      </text>
      <text x="30" y="170" :fill="textColor">
        nmi_panic+0x40/0x40
      </text>
      <text x="30" y="185" :fill="textColor">
        watchdog_overflow_callback+0x9d/0xb0
      </text>
      <text x="30" y="200" :fill="textColor">
        __perf_event_overflow+0x52/0xf0
      </text>
      <text x="30" y="215" :fill="textColor">
        perf_event_overflow+0x14/0x20
      </text>
      <text x="30" y="230" :fill="textColor">
        intel_pmu_handle_irq+0x1d2/0x280
      </text>
      <text x="30" y="245" :fill="textColor">
        perf_event_nmi_handler+0x28/0x50
      </text>
      <text x="30" y="260" :fill="textColor">
        nmi_handle+0x61/0x110
      </text>
      <text x="30" y="275" :fill="textColor">
        default_do_nmi+0x43/0x100
      </text>
      <text x="30" y="290" :fill="textColor">
        do_nmi+0x116/0x150
      </text>
      <text x="30" y="305" :fill="textColor">
        end_repeat_nmi+0x16/0x50
      </text>

      <!-- 寄存器转储 -->
      <text x="10" y="335" fill="#00FF00" font-weight="bold">
        RIP: 0010:native_safe_halt+0xe/0x10
      </text>
      <text x="10" y="350" :fill="textColor">
        Code: cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc cc
      </text>

      <text x="10" y="380" fill="#FFFF00">
        RSP: 0018:ffffc90000013e68 EFLAGS: 00000246
      </text>
      <text x="10" y="395" :fill="textColor">
        RAX: 0000000000000000 RBX: 0000000000000000 RCX: 0000000000000000
      </text>
      <text x="10" y="410" :fill="textColor">
        RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000000
      </text>
      <text x="10" y="425" :fill="textColor">
        RBP: ffffc90000013e68 R08: 0000000000000001 R09: 0000000000000000
      </text>
      <text x="10" y="440" :fill="textColor">
        R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000
      </text>
      <text x="10" y="455" :fill="textColor">
        R13: ffff88807dc00000 R14: 0000000000000000 R15: 0000000000000000
      </text>

      <!-- 结束消息 -->
      <text x="10" y="490" fill="#FF0000">
        ---[ end Kernel panic - not syncing: Fatal exception in interrupt ]---
      </text>

      <!-- 提示信息（现代Linux） -->
      <text x="10" y="530" :fill="textColor" v-if="version === 'modern'">
        Kernel Offset: disabled
      </text>
      <text x="10" y="545" :fill="textColor" v-if="version === 'modern'">
        Rebooting in 10 seconds...
      </text>
    </g>

    <!-- FreeBSD Kernel Panic -->
    <g v-else-if="osType === 'freebsd'" font-family="'Courier New', 'Monaco', monospace" font-size="11">
      <text x="10" y="20" fill="#FFFFFF" font-weight="bold" font-size="12">
        Fatal trap 12: page fault while in kernel mode
      </text>

      <text x="10" y="50" :fill="textColor">
        cpuid = 0; apic id = 00
      </text>
      <text x="10" y="65" :fill="textColor">
        fault virtual address   = 0x0
      </text>
      <text x="10" y="80" :fill="textColor">
        fault code              = supervisor read, page not present
      </text>
      <text x="10" y="95" :fill="textColor">
        instruction pointer     = 0x20:0xffffffff80c3a1b0
      </text>
      <text x="10" y="110" :fill="textColor">
        stack pointer           = 0x28:0xfffffe00008e3a80
      </text>
      <text x="10" y="125" :fill="textColor">
        frame pointer           = 0x28:0xfffffe00008e3ab0
      </text>
      <text x="10" y="140" :fill="textColor">
        code segment            = base 0x0, limit 0xfffff, type 0x1b
      </text>
      <text x="10" y="155" :fill="textColor">
                                = DPL 0, pres 1, long 1, def32 0, gran 1
      </text>

      <text x="10" y="185" fill="#FFFF00">
        panic: page fault
      </text>
      <text x="10" y="200" :fill="textColor">
        cpuid = 0
      </text>
      <text x="10" y="215" :fill="textColor">
        time = 1234567890
      </text>

      <text x="10" y="245" :fill="textColor">
        KDB: stack backtrace:
      </text>
      <text x="10" y="260" :fill="textColor">
        db_trace_self_wrapper() at db_trace_self_wrapper+0x2b
      </text>
      <text x="10" y="275" :fill="textColor">
        vpanic() at vpanic+0x182
      </text>
      <text x="10" y="290" :fill="textColor">
        panic() at panic+0x43
      </text>
      <text x="10" y="305" :fill="textColor">
        trap_fatal() at trap_fatal+0x387
      </text>
      <text x="10" y="320" :fill="textColor">
        trap_pfault() at trap_pfault+0x4f
      </text>
      <text x="10" y="335" :fill="textColor">
        trap() at trap+0x2d3
      </text>

      <text x="10" y="370" fill="#FFFFFF">
        Uptime: 1h23m45s
      </text>
      <text x="10" y="385" :fill="textColor">
        Automatic reboot in 15 seconds - press a key on the console to abort
      </text>
    </g>

    <!-- OpenBSD Kernel Panic -->
    <g v-else-if="osType === 'openbsd'" font-family="'Courier New', 'Monaco', monospace" font-size="11">
      <text x="10" y="20" fill="#FFFFFF" font-weight="bold">
        panic: kernel diagnostic assertion "condition" failed: file "filename.c", line 123
      </text>

      <text x="10" y="50" :fill="textColor">
        Starting stack trace...
      </text>
      <text x="10" y="70" :fill="textColor">
        panic() at panic+0x126
      </text>
      <text x="10" y="85" :fill="textColor">
        __assert() at __assert+0x25
      </text>
      <text x="10" y="100" :fill="textColor">
        function_name() at function_name+0x3c
      </text>
      <text x="10" y="115" :fill="textColor">
        trap() at trap+0x9a
      </text>
      <text x="10" y="130" :fill="textColor">
        --- trap (number 6) ---
      </text>
      <text x="10" y="145" :fill="textColor">
        end of kernel
      </text>
      <text x="10" y="160" :fill="textColor">
        end trace frame: 0x0, count: 0
      </text>

      <text x="10" y="195" fill="#00FF00">
        https://www.openbsd.org/report.html
      </text>
      <text x="10" y="210" :fill="textColor">
        Describe your problem and send output of above panic to bugs@openbsd.org
      </text>

      <text x="10" y="245" fill="#FFFFFF">
        The operating system has halted.
      </text>
      <text x="10" y="260" :fill="textColor">
        Please press any key to reboot.
      </text>

      <text x="10" y="295" :fill="textColor" font-size="10">
        syncing disks... done
      </text>
    </g>

    <!-- NetBSD Kernel Panic -->
    <g v-else-if="osType === 'netbsd'" font-family="'Courier New', 'Monaco', monospace" font-size="11">
      <text x="10" y="20" fill="#FFFFFF" font-weight="bold">
        panic: trap
      </text>

      <text x="10" y="50" :fill="textColor">
        cpu0: Begin traceback...
      </text>
      <text x="10" y="65" :fill="textColor">
        vpanic() at netbsd:vpanic+0x140
      </text>
      <text x="10" y="80" :fill="textColor">
        snprintf() at netbsd:snprintf+0x0
      </text>
      <text x="10" y="95" :fill="textColor">
        startlwp() at netbsd:startlwp
      </text>
      <text x="10" y="110" :fill="textColor">
        cpu0: End traceback...
      </text>

      <text x="10" y="145" :fill="textColor">
        dumping to dev 4,1 offset 123456
      </text>
      <text x="10" y="160" :fill="textColor">
        dump succeeded
      </text>

      <text x="10" y="195" fill="#FFFF00">
        rebooting...
      </text>

      <text x="10" y="230" :fill="textColor" font-size="10">
        Copyright (c) 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005
      </text>
      <text x="10" y="245" :fill="textColor" font-size="10">
            The NetBSD Foundation, Inc.  All rights reserved.
      </text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  osType: {
    type: String,
    default: 'linux', // 'linux', 'freebsd', 'openbsd', 'netbsd'
    validator: (value) => ['linux', 'freebsd', 'openbsd', 'netbsd'].includes(value)
  },
  version: {
    type: String,
    default: 'modern', // 'classic', 'modern'
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  }
});

// 根据OS类型选择背景和文字颜色
const backgroundColor = computed(() => {
  return '#000000'; // 所有Unix-like系统都使用黑色背景
});

const textColor = computed(() => {
  if (props.osType === 'linux') {
    return '#00FF00'; // Linux传统绿色文字
  } else if (props.osType === 'freebsd') {
    return '#AAAAAA'; // FreeBSD灰白色
  } else if (props.osType === 'openbsd') {
    return '#CCCCCC'; // OpenBSD浅灰色
  } else {
    return '#FFFFFF'; // NetBSD白色
  }
});
</script>
