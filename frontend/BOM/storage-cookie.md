### Storage

#### sessionStorage 和 localStorage 的区别

1. localStorage 是本地存储，而 sessionStorage 是会话存储(网页关闭消失)。
2. 在页面内实现跳转，localStorage 和 sessionStorage 都会保存
3. 在页面外实现跳转（打开新网页），localStorage 会保留，而 sessionStorage 不会（如果在标签栏复制一个 sessionStorage 也会保留）

#### storage 常见属性与方法

> sessionStorage 和 localStorage 通用

1. `.length` 属性：返回一个整数，表示存储在 storage 对象中的数据项数量。
1. `.key()` 方法：接收一个数值 n 作为参数，返回存储中的第 n 个 key 的名称。

#### Cookie

1. 类型：小型文本文件
2. Cookie 种类：Cookie 总是保存在客户端中，按在客户端中的存储位置，Cookie 可以分为 内存 Cookie（会话 Cookie - 默认） 和 硬盘 Cookie
    - 内存 Cookie：由浏览器维护，保存在内存中，浏览器关闭 Cookie 就会消失，存在时间短暂。（没有设置过期时间）
    - 硬盘 Cookie：保存在硬盘中，有一个过期时间，用户手动清理或过期时间到期，才会被清理。（设置过期时间，并不为 0 或负数）
3. Cookie 常见属性：
    1. 通过 expires 或 max-age 来设置过期时间
        1. expires：规定一个具体的过期时间，格式是 Date.toUTCString(). `expires = new Date(Date.now()).toUTCString()`
        2. max-age：设置过期的秒钟。`max-age = 60 * 60 * 24 * 365 (一年)`
    2. Cookie 作用域：（允许 Cookie 发送给哪些 url）
        1. Domain：（指定哪些主机可以接收 Cookie）
            1. 如果不指定，默认是 origin，不包括子域名（只有对应的源可以）。
            2. 如果执行 Domain，则包括子域名。`Domain = mozilla.org (不管前面是 www.还是dev.都会携带)`
        2. Path：（指定主机下哪些路径可以接收 Cookie）
            1. 如果设置了 Path，则只有以该 Path 为开头会接收。`Path = /a(则/a/*才会被接收)`
4. js 操作 Cookie：（操作的都是非 HttpOnly 的 cookie 值，HttpOnly 的值前端无法操作）
    1. 获取/设置 Cookie：`document.cookie`获取/设置 cookie 值。
    2. 删除 Cookie：通过设置过期时间删除 `document.cookie = "item = ''; max-age = 0;"` 。
5. Cookie 缺陷：
    1. 每次 http 请求都会携带 Cookie。
    2. 明文传输。
    3. 大小限制（4kb）。

#### 两个浏览网页之间如何通信？

按上述内容可知，如果是同一个域名之下的网页，localStorage 和 cookie 可以实现两个网页之间的通信。
