<h1 align="center">🥡 盲盒外卖</h1>

<p align="center">
  选择困难症救星：今天吃什么，交给转盘和一点运气。
</p>

<p align="center">
  <a href="https://hanny-0303.github.io/blind-box-takeout/"><strong>在线体验 →</strong></a>
  &nbsp;·&nbsp; 纯前端 &nbsp;·&nbsp; 零依赖 &nbsp;·&nbsp; 手机优先
</p>

<p align="center">
  <img src="docs/screenshot-wheel.jpg" width="300" alt="转盘：转到什么吃什么" />
  &nbsp;&nbsp;
  <img src="docs/screenshot-filter.jpg" width="300" alt="精准盲盒：按口味筛选" />
</p>

---

## 两个玩法

**🎡 转盘**
8 个分类各随机抽一道菜，凑成一圈候选。点「开转」转盘转几圈，指针停在哪道就吃哪道，选择困难当场痊愈。不满意可以「换一批候选」重新洗牌。

**🎲 精准盲盒**
把条件摆出来，再随机开一个盲盒：

| 条件 | 选项 |
| --- | --- |
| 辣度 | 随便 / 不辣 / 微辣 / 正常辣 / 加辣（按「能接受的上限」筛选） |
| 分类 | 随便 / 饭 / 面 / 粉 / 米线 / 麻辣烫 / 汉堡 / 日料 / 轻食 |
| 新鲜度 | 随便 / 想尝试新东西 / 老口味 |
| 价格 | 随便 / ¥20 以内 / ¥20–40 / ¥40–60 / ¥60–100 / ¥100 以上 / 自定义 0–1000 |

**🗂️ 口味档案**
每次点「就吃这个」，就会自动记一笔。档案里能看到总点单数、最常吃的分类、平均花费和辣度偏好。

**✨ 新鲜度是怎么算的**
推荐时会给每道菜算一个权重：

- **想尝试新东西**：你点得越多的分类/菜品，权重越低；完全没吃过的菜再额外加权，优先开新地图。
- **老口味**：常点的分类和菜品权重更高，往熟悉的味道靠。
- **还没有记录时**：按「随便」处理。可以在口味档案里一键生成 5 笔示例记录，先体验这个功能。

所有数据只存在浏览器的 `localStorage` 里，没有后端、没有账号、没有埋点。换台设备或清除浏览器数据，就会重新开始。

---

## 本地运行

不需要安装任何依赖，也不需要构建：

```bash
# 方式一：起一个静态服务器（推荐）
python3 -m http.server 8000
# 打开 http://localhost:8000

# 方式二：直接双击 index.html
```

## 部署到 GitHub Pages

1. 新建一个仓库，把代码推上去；
2. 进入仓库 **Settings → Pages**；
3. **Build and deployment → Source** 选 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`，保存；
4. 等一两分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`。

本项目没有构建步骤，Pages 直接托管根目录即可。

## 项目结构

```
index.html          页面结构
styles.css          样式（移动端优先）
data.js             菜品库：8 个分类、54 道菜
app.js              转盘、筛选、口味档案
favicon.svg         小图标
docs/               README 截图
```

## 想加菜？

打开 `data.js`，照着格式往 `DISHES` 里加一行就行：

```js
{ id: 'r11', name: '青椒肉丝盖饭', short: '青椒肉丝', cat: 'rice', spice: 1, price: 22, emoji: '🫑', desc: '家常但下饭' },
```

- `spice`：`0` 不辣 / `1` 微辣 / `2` 正常辣 / `3` 加辣
- `cat`：对应 `CATEGORIES` 里的分类 id
- `short`：转盘上显示的短名字，建议不超过 6 个字

## 技术栈

原生 HTML + CSS + JavaScript，没有框架、没有依赖、没有构建步骤。转盘用 `<canvas>` 绘制，动画用 `requestAnimationFrame`，记录存在 `localStorage`。

---

<p align="center"><sub>用 ❤️ 和一点点运气做的 · 数据只存在你的浏览器里</sub></p>
