# Tagged Library（共享分页整理库）v2

一个**服务端专用**的 Fabric 模组：用**染料颜色**把箱子归入不同的“库”，同一个颜色的所有箱子**共通**同一个**自动整理、可分页**的共享库存——存入自动合并排序，打开箱子直接看、直接拿，还能在箱子里翻页。

- 目标版本：**Minecraft Java 版 26.3（Fabric）**
- 构建工具链：**JDK 25 + Gradle 9.8.2 + Fabric Loom 1.19**
- 依赖：Fabric Loader `>=0.19.5`，Fabric API `0.165.0+26.3`
- 仅需服务端安装；**客户端无需安装任何东西**。

> 互通服 / Geyser 友好：模组不注册任何方块/物品/实体/自定义 GUI，不发送自定义网络包，**全部用原版交互（蹲下+右键、原版箱子界面、原版物品）+ 命令**。基岩版玩家能完整使用，Java 与基岩版共用同一套库。

---

## 1. 核心概念

- **库 = 一个颜色**。手持**改名为“钥匙”的染料**（橙色染料钥匙→橙色库、红色染料钥匙→红色库……最多 16 个颜色）蹲下右键箱子，就把这个箱子**挂到对应颜色的库**。未改名染料右键是普通右键，不会误挂库。
- **共通**：所有挂到同一颜色的箱子，共享**同一个**分页库存——在任何一箱存取，都是同一批物品。
- **整理**：库存自动打包——同类物品合并到满堆叠，按名称排序，从第 1 页起连续排满（塞满一页进下一页）。
- **分页**：打开已挂库箱子，看到的就是库的某一页；箱子最后一格放“翻页书”，**拿起书 = 翻到下一页**。

---

## 2. 用法

### 挂库 / 解挂（**仅 OP 可操作**）
1. OP 先做一把“钥匙”：用**铁砧**给**染料**改名为 **“钥匙”**（改名只识别染料；16 色各自对应各自颜色库）。Java 与基岩版铁砧均可。
2. OP 手持**这把钥匙**，**蹲下(shift) + 右键**一个箱子 → 挂到“该染料颜色的库”；对同一箱子再执行一次 = 解除挂库。
3. 未改名染料 / 非 OP / 不蹲下，都不会挂库。
4. 命令 `/lib untag`（看向箱子）也可解挂（OP）。

### 打开 / 分页（所有玩家）
- **空手右键**已挂库箱子 → 打开，显示库当前页。
- 箱子**最后一格**是“翻页书”（书名显示“第 X 页 / 共 N 页”），**把它拿起来** → 翻到下一页，书自动回到格子里。
- `/lib page <N>`（看向箱子）直接跳到第 N 页。

### 存入（所有玩家）
- 手持物品（**不蹲下**）右键已挂库箱子 → 存入并自动整理。
- 空手放进打开的箱子格子 → 先放原位，下次存入/整理时归位。

### 取出（所有玩家）
- 打开箱子，从当前页**直接拿**（拿了就从库扣除）。
- 远程：`/lib call <颜色> <物品> [数量]` 任意位置把库里的物品调用回背包。

---

## 3. 命令

| 命令 | 作用 |
|---|---|
| `/lib call <颜色> <物品> [数量]` | 任意位置从库里调用物品回背包 |
| `/lib page <N>` | 看向箱子并跳到第 N 页 |
| `/lib untag` | （OP）解除看向箱子的库归属 |
| `/lib list [颜色]` | 查看库内容；不带颜色则列出所有库 |
| `/lib info [颜色]` | 库统计（连接箱子数、种类、总数） |
| `/lib sort [颜色]` | 手动重新整理一个库 |
| `/lib help` | 帮助 |

**物品参数**支持三种写法（按顺序尝试）：`hand` / 物品 id（`iron_ingot` 或 `minecraft:iron_ingot`）/ 显示名模糊匹配（如 `铁`）。

**颜色**：输入染料颜色名（`orange`、`red`、`lime`…… 见 §5）。

---

## 4. OP 权限说明

- **挂库 / 解挂**需要 OP（权限等级 ≥ 2）**且**手持改名“钥匙”的染料。判断方式：`player.permissions().hasPermission(Permissions.COMMANDS_GAMEMASTER)`——**生存模式与创造模式的 OP 均可用**（旧版的 `canUseGameMasterBlocks()` 只认创造模式 OP，已废弃）。
- **存入 / 取出 / 翻页**对所有玩家开放。
- 互通服：基岩版玩家需在 **Java 服务端**被授予 OP（Geyser 会同步权限状态），才能执行挂库。

---

## 5. 颜色 ↔ 库对照

染料物品注册名去掉 `_dye` 即为库名：

| 染料 | 库名 |
|---|---|
| `orange_dye`（橙色染料） | `orange` |
| `red_dye`（红色染料） | `red` |
| `lime_dye`（黄绿染料） | `lime` |
| `blue_dye`（蓝色染料） | `blue` |
| …… 其余 12 色同理 | …… |

即：**一个颜色 = 一个独立的共享分页库**。

---

## 6. 数据与配置存储位置

所有数据在**世界目录**的 `taggedlibs/` 下：

```
<世界>/taggedlibs/
├── config.json      # 配置（首次启动自动生成）
└── libraries.dat    # 所有库 + 箱子归属 + 每箱页码（NBT，变更自动保存）
```

`config.json` 字段：

```json
{
  "reach": 5.0,               // 命令看向方块判定的最大距离（格）
  "depositOnRightClick": true,// 手持物品右键已挂库箱子是否快速存入
  "listPageSize": 60          // /lib list 单次显示条目上限
}
```

> 备份/迁移：把 `taggedlibs/` 随世界一起复制即可。

---

## 7. 安装

1. 服务端已装 **Fabric Loader 0.19.5+**（MC 26.3）。
2. 把 **Fabric API 0.165.0+26.3** 放入 `mods/`。
3. 把 **`taggedlib-1.1.5.jar`** 放入 `mods/`。
4. 重启服务端。客户端**无需**安装本模组。

---

## 8. 自行构建

本仓库已带 Gradle Wrapper，需要 JDK 25。

```bash
./gradlew build        # Linux / macOS
gradlew.bat build      # Windows
```

产物在 `build/libs/taggedlib-<版本>.jar`（含 `-sources.jar`）。

**本地一键测试**：`./gradlew runServer`（启动一个 26.3 测试服并加载本模组；先在 `run/eula.txt` 写 `eula=true`）。

---

## 9. 版本对应与升级维护（重要）

| 组件 | 本模组使用 | 说明 |
|---|---|---|
| Minecraft | 26.3 | |
| Fabric Loader | ≥0.19.5（已在 0.19.5 与 0.20.1 实测） | `gradle.properties → loader_version` |
| Fabric API | 0.165.0+26.3 | `gradle.properties → fabric_api_version` |
| Fabric Loom | 1.19-SNAPSHOT | `gradle.properties → loom_version` |
| 映射 | Mojang 官方映射（mojmap） | 26.3 无 Yarn 映射，Loom 默认 mojmap。**不要**在 `build.gradle` 再写 `officialMojangMappings()`（会报 “Cannot use Mojang mappings in a non-obfuscated environment”）。 |
| JDK | 25 | `build.gradle` 中 `release = 25` |

**升级到更新版本时**：改 `gradle.properties` 里的 `minecraft_version / loader_version / fabric_api_version`，其余不变。若报 API 变动，多半是 mojmap 签名变化。**本项目在 26.3 已踩过并修正的坑：**

- `CompoundTag.getString / getCompound / getList / getInt` 现在返回 `Optional<...>`，需 `.orElse(...)`。
- `getAllKeys()` 改名为 `keySet()`。
- `NbtIo.readCompressed(Path)` 需改为 `NbtIo.readCompressed(Path, NbtAccounter.unlimitedHeap())`。
- `Inventory.items` 变为私有，改用 `getContainerSize() / getItem(i) / setItem(i, stack)`。
- **权限 API 重构**：`hasPermission(int)`、`getPermissions()`、`ServerPlayer.hasPermissions(int)` 均不存在；改为 `PermissionSet` 体系。判断 OP 用 `Player.canUseGameMasterBlocks()`（OP 等级 ≥ 2）。
- **染料颜色**：`DyeColor.getColor(...)` 已移除；改为从物品注册名解析（`orange_dye` → `orange`）。
- **命名物品**：`ItemStack.setHoverName(...)` 已移除；改用 `stack.set(DataComponents.CUSTOM_NAME, Component)`。
- **菜单**：`ChestMenu.getContainer()` 存在，可直接拿到箱子 Container；`player.containerMenu` 仍在。

---

## 10. 与其他模组的兼容性

- **零 Mixin**：不注入任何 Minecraft 类，不会与其它模组的 Mixin 冲突。
- **零注册**：不注册新方块/物品/实体，不占用注册表 ID。
- 只用 Fabric API 的**命令 / 生命周期 / tick / 方块破坏 / 右键交互**事件；Fabric API 是所有 Fabric 模组共享的标准依赖。
- **Geyser 兼容**：无客户端代码、无自定义 GUI、无自定义网络包；挂库走“蹲下+右键”原版手势，分页走原版箱子+原版书，基岩版可完整使用。

---

## 11. 设计说明与已知取舍

- **库是虚拟的**：物品存在 `taggedlibs/libraries.dat`，被挂库的箱子只是“窗口/坐标标记”。空手打开箱子看到的是库的某一页，箱子自身的格子不长期保存（每次打开都会从库重新灌入）。
- **打开的箱子内操作即时生效**：拿起物品立即从库扣除，放入物品立即入库；整体重新归位在“下次存入/翻页/重新打开”时发生（避免边放边乱跳）。
- **翻页书被拿起时会留一本在你手上**（就是一本普通命名书），这是原版格子交互的取舍，没有副作用。
- **窗口追踪**：只要有玩家开着某已挂库箱子，服务端就逐 tick 对该箱写回；没人在看时停止追踪。
- **单箱 / 双联大箱子均支持**：单箱 27 格（26 物品格 + 翻页书），双联大箱子 54 格（53 物品格 + 翻页书），通过 `ChestBlock.getContainer(...)` 取整只箱子的合并容器。

---

## 12. 验证情况

- ✅ 使用 **JDK 25 + Gradle 9.8.2 + Loom 1.19** 编译通过，产出 `taggedlib-1.1.5.jar`（含 remap、sources）。
- ✅ 在**真实 26.3 服务端**实测启动：**Fabric Loader 0.19.5**（实测环境）与 **0.20.1** 均可正常加载、命令注册、数据目录/配置生成成功，日志零报错零崩溃。
- ⚠️ 分页窗口写回、染料挂库、翻页等**交互逻辑依赖玩家在线**，未在无人测试服内端到端跑通；代码已按 26.3 实际 API 编译通过并人工走查（取回时背包放不下会自动放回库；窗口写回按物品 key 处理、脏了就落盘，无重复/丢失）。

---

## 13. 许可证

MIT，见 `LICENSE`。

---

## 14. 更新日志

### 1.1.5（复查修复）
- **修复物品键误带数量**：`Library.keyOf` 原来只剥大写 `Count`，而 26.3 的 ItemStack 编码是小写 `count`；已同时剥离两者，避免同物品不同数量被当成不同物品（种类虚高、模糊匹配报“多个”、按旧键扣除失效）。
- **修复跨维度串库**：箱子身份改为「维度 + 坐标」，主世界 / 下界 / 末地相同坐标不再互相覆盖；旧数据（仅 x,y,z）自动按主世界兼容读取。
- **修复双联箱半边识别**：从双联箱任一半边右键，都能归到已挂库的那一半并正常打开/翻页/存取。
- **去掉署名与个人化措辞**：模组元数据移除作者字段，许可证改为项目名，文档中不出现个人标识。

### 1.1.4（按反汇编审查报告修复）
- **修正 OP 判定**：`canUseGameMasterBlocks()` 要求创造模式，生存 OP 恒为 false → 改用 `Permissions.COMMANDS_GAMEMASTER` 权限判定，生存/创造 OP 均可用（挂库不再“没反应/提示只有 OP”）。
- **修复挂库丢物品**：首次挂库时先把箱子内原有物品并入库并清空，避免第一次打开分页窗口被覆盖。
- **修复双联大箱子**：`isViewing` 改为识别 `CompoundContainer`；`openWindow` / 写回 / `/lib page` 统一用 `ChestBlock.getContainer(...)` 取 54 格合并容器（原来只拿半边 27 格且窗口下一 tick 即失效）。
- **接通配置项**：`depositOnRightClick` 现在真正生效（设 false 则手持物品右键不再快速存入，交给原版箱子）；`listPageSize` 现在限制 `/lib list` 单次显示条数。
- **`/lib call` 物品名支持空格**：改为 `greedyString`，物品名可含空格，末尾纯数字仍识别为数量。
- **入口点改 `main` + `environment: "*"`**：专用服务器、单人、局域网均加载；代码无客户端引用、回调均判 `ServerPlayer`，客户端加载亦安全。注意**只挂 `main`**（不重复挂 `server`，否则事件重复注册）。

### 1.1.3
- 染料须用铁砧改名为“钥匙”才能挂库；颜色仍决定绑哪个库；未改名染料不再误触。
