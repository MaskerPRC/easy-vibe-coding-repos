/**
 * JSpspy - JavaScript Spy Tool
 * 用于拦截和监控浏览器API调用
 */

class JSpspy {
    constructor() {
        this.hooks = {
            fetch: { enabled: false, original: null },
            xhr: { enabled: false, original: null },
            localStorage: { enabled: false, original: {} },
            sessionStorage: { enabled: false, original: {} },
            cookie: { enabled: false, original: null },
            console: { enabled: false, original: {} },
            setTimeout: { enabled: false, original: null },
            setInterval: { enabled: false, original: null },
            eval: { enabled: false, original: null },
            Function: { enabled: false, original: null }
        };

        this.records = [];
        this.maxRecords = 1000;
        this.listeners = [];
    }

    /**
     * 添加记录监听器
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * 记录hook信息
     */
    log(type, method, data) {
        const record = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            type,
            method,
            data
        };

        this.records.unshift(record);

        // 限制记录数量
        if (this.records.length > this.maxRecords) {
            this.records = this.records.slice(0, this.maxRecords);
        }

        // 通知监听器
        this.listeners.forEach(listener => listener(record));

        return record;
    }

    /**
     * 获取所有记录
     */
    getRecords(filter = null) {
        if (!filter) return this.records;
        return this.records.filter(record => record.type === filter);
    }

    /**
     * 清空记录
     */
    clearRecords() {
        this.records = [];
    }

    /**
     * Hook Fetch API
     */
    hookFetch() {
        if (this.hooks.fetch.enabled) return;

        const originalFetch = window.fetch;
        this.hooks.fetch.original = originalFetch;

        const self = this;
        window.fetch = function(...args) {
            const [url, options = {}] = args;
            const startTime = Date.now();

            self.log('network', 'fetch', {
                url: url.toString(),
                method: options.method || 'GET',
                headers: options.headers || {},
                body: options.body || null,
                status: 'pending'
            });

            return originalFetch.apply(this, args)
                .then(response => {
                    const duration = Date.now() - startTime;
                    self.log('network', 'fetch', {
                        url: url.toString(),
                        method: options.method || 'GET',
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        duration: duration + 'ms'
                    });
                    return response;
                })
                .catch(error => {
                    self.log('network', 'fetch', {
                        url: url.toString(),
                        method: options.method || 'GET',
                        error: error.message,
                        status: 'error'
                    });
                    throw error;
                });
        };

        this.hooks.fetch.enabled = true;
    }

    /**
     * 恢复Fetch API
     */
    unhookFetch() {
        if (!this.hooks.fetch.enabled) return;
        window.fetch = this.hooks.fetch.original;
        this.hooks.fetch.enabled = false;
    }

    /**
     * Hook XMLHttpRequest
     */
    hookXHR() {
        if (this.hooks.xhr.enabled) return;

        const originalXHR = window.XMLHttpRequest;
        this.hooks.xhr.original = originalXHR;

        const self = this;

        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            const originalSetRequestHeader = xhr.setRequestHeader;

            let method, url;
            const headers = {};

            xhr.open = function(m, u, ...args) {
                method = m;
                url = u;
                return originalOpen.apply(this, [m, u, ...args]);
            };

            xhr.setRequestHeader = function(key, value) {
                headers[key] = value;
                return originalSetRequestHeader.apply(this, arguments);
            };

            xhr.send = function(body) {
                const startTime = Date.now();

                self.log('network', 'XHR', {
                    url,
                    method,
                    headers,
                    body,
                    status: 'pending'
                });

                xhr.addEventListener('load', function() {
                    const duration = Date.now() - startTime;
                    self.log('network', 'XHR', {
                        url,
                        method,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseHeaders: xhr.getAllResponseHeaders(),
                        duration: duration + 'ms'
                    });
                });

                xhr.addEventListener('error', function() {
                    self.log('network', 'XHR', {
                        url,
                        method,
                        error: 'Network Error',
                        status: 'error'
                    });
                });

                return originalSend.apply(this, arguments);
            };

            return xhr;
        };

        this.hooks.xhr.enabled = true;
    }

    /**
     * 恢复XMLHttpRequest
     */
    unhookXHR() {
        if (!this.hooks.xhr.enabled) return;
        window.XMLHttpRequest = this.hooks.xhr.original;
        this.hooks.xhr.enabled = false;
    }

    /**
     * Hook LocalStorage
     */
    hookLocalStorage() {
        if (this.hooks.localStorage.enabled) return;

        const self = this;
        const storage = window.localStorage;

        this.hooks.localStorage.original = {
            setItem: storage.setItem,
            getItem: storage.getItem,
            removeItem: storage.removeItem,
            clear: storage.clear
        };

        Storage.prototype.setItem = function(key, value) {
            self.log('storage', 'localStorage.setItem', { key, value });
            return self.hooks.localStorage.original.setItem.apply(this, arguments);
        };

        Storage.prototype.getItem = function(key) {
            const value = self.hooks.localStorage.original.getItem.apply(this, arguments);
            self.log('storage', 'localStorage.getItem', { key, value });
            return value;
        };

        Storage.prototype.removeItem = function(key) {
            self.log('storage', 'localStorage.removeItem', { key });
            return self.hooks.localStorage.original.removeItem.apply(this, arguments);
        };

        Storage.prototype.clear = function() {
            self.log('storage', 'localStorage.clear', {});
            return self.hooks.localStorage.original.clear.apply(this, arguments);
        };

        this.hooks.localStorage.enabled = true;
    }

    /**
     * 恢复LocalStorage
     */
    unhookLocalStorage() {
        if (!this.hooks.localStorage.enabled) return;

        Storage.prototype.setItem = this.hooks.localStorage.original.setItem;
        Storage.prototype.getItem = this.hooks.localStorage.original.getItem;
        Storage.prototype.removeItem = this.hooks.localStorage.original.removeItem;
        Storage.prototype.clear = this.hooks.localStorage.original.clear;

        this.hooks.localStorage.enabled = false;
    }

    /**
     * Hook Cookie
     */
    hookCookie() {
        if (this.hooks.cookie.enabled) return;

        const self = this;
        const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                 Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

        if (!cookieDescriptor) return;

        this.hooks.cookie.original = cookieDescriptor;

        Object.defineProperty(document, 'cookie', {
            get() {
                const value = cookieDescriptor.get.call(document);
                self.log('cookie', 'getCookie', { value });
                return value;
            },
            set(value) {
                self.log('cookie', 'setCookie', { value });
                return cookieDescriptor.set.call(document, value);
            }
        });

        this.hooks.cookie.enabled = true;
    }

    /**
     * 恢复Cookie
     */
    unhookCookie() {
        if (!this.hooks.cookie.enabled) return;
        Object.defineProperty(document, 'cookie', this.hooks.cookie.original);
        this.hooks.cookie.enabled = false;
    }

    /**
     * Hook Console
     */
    hookConsole() {
        if (this.hooks.console.enabled) return;

        const self = this;
        const methods = ['log', 'info', 'warn', 'error', 'debug'];

        methods.forEach(method => {
            this.hooks.console.original[method] = console[method];

            console[method] = function(...args) {
                self.log('console', method, {
                    arguments: args.map(arg => {
                        try {
                            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                        } catch {
                            return String(arg);
                        }
                    })
                });
                return self.hooks.console.original[method].apply(console, args);
            };
        });

        this.hooks.console.enabled = true;
    }

    /**
     * 恢复Console
     */
    unhookConsole() {
        if (!this.hooks.console.enabled) return;

        Object.keys(this.hooks.console.original).forEach(method => {
            console[method] = this.hooks.console.original[method];
        });

        this.hooks.console.enabled = false;
    }

    /**
     * Hook setTimeout
     */
    hookSetTimeout() {
        if (this.hooks.setTimeout.enabled) return;

        const originalSetTimeout = window.setTimeout;
        this.hooks.setTimeout.original = originalSetTimeout;

        const self = this;

        window.setTimeout = function(callback, delay, ...args) {
            self.log('timer', 'setTimeout', {
                delay,
                callback: callback.toString().substring(0, 100)
            });
            return originalSetTimeout.apply(this, arguments);
        };

        this.hooks.setTimeout.enabled = true;
    }

    /**
     * 恢复setTimeout
     */
    unhookSetTimeout() {
        if (!this.hooks.setTimeout.enabled) return;
        window.setTimeout = this.hooks.setTimeout.original;
        this.hooks.setTimeout.enabled = false;
    }

    /**
     * Hook setInterval
     */
    hookSetInterval() {
        if (this.hooks.setInterval.enabled) return;

        const originalSetInterval = window.setInterval;
        this.hooks.setInterval.original = originalSetInterval;

        const self = this;

        window.setInterval = function(callback, delay, ...args) {
            self.log('timer', 'setInterval', {
                delay,
                callback: callback.toString().substring(0, 100)
            });
            return originalSetInterval.apply(this, arguments);
        };

        this.hooks.setInterval.enabled = true;
    }

    /**
     * 恢复setInterval
     */
    unhookSetInterval() {
        if (!this.hooks.setInterval.enabled) return;
        window.setInterval = this.hooks.setInterval.original;
        this.hooks.setInterval.enabled = false;
    }

    /**
     * Hook eval
     */
    hookEval() {
        if (this.hooks.eval.enabled) return;

        const originalEval = window.eval;
        this.hooks.eval.original = originalEval;

        const self = this;

        window.eval = function(code) {
            self.log('dangerous', 'eval', {
                code: String(code).substring(0, 200)
            });
            return originalEval.apply(this, arguments);
        };

        this.hooks.eval.enabled = true;
    }

    /**
     * 恢复eval
     */
    unhookEval() {
        if (!this.hooks.eval.enabled) return;
        window.eval = this.hooks.eval.original;
        this.hooks.eval.enabled = false;
    }

    /**
     * Hook Function构造器
     */
    hookFunction() {
        if (this.hooks.Function.enabled) return;

        const originalFunction = window.Function;
        this.hooks.Function.original = originalFunction;

        const self = this;

        window.Function = function(...args) {
            self.log('dangerous', 'Function', {
                arguments: args.map(arg => String(arg).substring(0, 100))
            });
            return originalFunction.apply(this, args);
        };

        // 保留原型
        window.Function.prototype = originalFunction.prototype;

        this.hooks.Function.enabled = true;
    }

    /**
     * 恢复Function
     */
    unhookFunction() {
        if (!this.hooks.Function.enabled) return;
        window.Function = this.hooks.Function.original;
        this.hooks.Function.enabled = false;
    }

    /**
     * 启用指定hook
     */
    enableHook(name) {
        const hookMethod = `hook${name.charAt(0).toUpperCase() + name.slice(1)}`;
        if (typeof this[hookMethod] === 'function') {
            this[hookMethod]();
            return true;
        }
        return false;
    }

    /**
     * 禁用指定hook
     */
    disableHook(name) {
        const unhookMethod = `unhook${name.charAt(0).toUpperCase() + name.slice(1)}`;
        if (typeof this[unhookMethod] === 'function') {
            this[unhookMethod]();
            return true;
        }
        return false;
    }

    /**
     * 启用所有hook
     */
    enableAll() {
        Object.keys(this.hooks).forEach(name => this.enableHook(name));
    }

    /**
     * 禁用所有hook
     */
    disableAll() {
        Object.keys(this.hooks).forEach(name => this.disableHook(name));
    }

    /**
     * 获取hook状态
     */
    getStatus() {
        const status = {};
        Object.keys(this.hooks).forEach(name => {
            status[name] = this.hooks[name].enabled;
        });
        return status;
    }

    /**
     * 导出记录
     */
    exportRecords(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.records, null, 2);
        }
        return this.records;
    }
}

// 创建全局实例
const jspspy = new JSpspy();

// 挂载到window对象
if (typeof window !== 'undefined') {
    window.jspspy = jspspy;
}

export default jspspy;
