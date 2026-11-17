# 随手贴

> 一款纯本地、轻量、保护隐私的便利贴式任务管理应用。随手记、随手贴，让每件想做的小事都被看见。

无需注册账号，无需联网，一个文件即可运行。同一份应用同时提供 **Android 安装包（APK）** 与可在浏览器直接打开的 **单文件网页版**。

---

## 特性

- **随手记录**：打开即写，先把事情记下来；分类、截止时间、紧迫程度、重要程度都可以稍后再补，均为非必填。
- **四种视图，同一份数据**
  - **时间阶梯**：按「今天 / 明天 / 1 周内 / 2 周内 / 长期任务」分组，移动端一行 2 张便利贴。
  - **四象限**：以重要程度为纵轴、紧迫程度为横轴，将待办铺在四块彩色象限中；支持「圆点 / 大便利贴」两种形态一键切换。
  - **任务板**：文档式列表，支持「列表 / 宫格」切换，待办按紧迫度排序，已完成单独归档展示。
  - **总结**：汇总累计贴了多少张、完成了多少件、哪个分类最勤，给人「没有白过」的正反馈。
- **动态紧迫度（可开关）**：随着截止日期临近，任务在坐标轴上的紧迫程度自动升级，无需手动调整。
- **个性化外观**：暗黑模式、字号调节、便签纸与页面背景色、透明度，以及自定义便签背景图和页面背景图（限制 3MB 以内，自动校验类型与大小）。
- **数据备份与迁移**：一键导出 / 导入 JSON 备份，配置与数据可在不同设备间完整迁移。
- **批量导入日程**：内置 JSON / CSV 日程模板，可下载模板填写后批量导入，支持追加与按「内容 + 截止日期」自动去重。
- **分类可自定义**：自由增删分类；删除分类不会删除便利贴，相关便利贴会自动改为「其他」。
- **分层返回**：Android 物理返回键按「关闭弹窗 → 返回主视图 → 退出应用」分层处理，不会一按就退出。

---

## 隐私与安全

- **完全离线**：应用不申请联网权限，不包含任何网络请求、统计 SDK、广告或第三方追踪。
- **数据只存本机**：所有便利贴与设置保存在设备本地（浏览器为 `localStorage`，Android 为 WebView 本地存储），不会上传到任何服务器。
- **关闭系统云备份**：Android 版默认关闭系统自动备份，避免数据被系统备份到云端。
- **导出可控**：只有当用户主动点击导出时，才会在本地生成文件并保存到下载目录。

---

## 快速开始

### 网页版

直接用浏览器打开 `随手贴完整版.html` 即可，无需安装、无需联网。

### Android

在 Android 手机上安装仓库中的 `随手贴_v1.1.apk`（需允许「安装未知来源应用」）。适用于 Android 7.0（API 24）及以上版本。

---

## 目录结构

```
.
├── 随手贴完整版.html               # 应用主源码（单文件、自包含，可直接用浏览器打开）
├── 随手贴_v1.1.apk                # 已签名的 Android 安装包
├── README.md
└── apk-build
    └── android                    # Android 工程（WebView 套壳）
        ├── settings.gradle
        ├── build.gradle
        ├── gradle.properties
        └── app
            ├── build.gradle
            └── src/main
                ├── AndroidManifest.xml
                ├── assets/index.html        # 与主源码同步的网页副本
                ├── java/com/suishoutie/app/MainActivity.java
                └── res/                     # 图标与主题
```

> 注：Android SDK、Gradle 发行版、签名密钥与本地配置文件均不入库，需按下方说明自行准备。

---

## 从源码构建 Android APK

### 环境要求

- JDK 17
- Android SDK（含 `platforms;android-34`、`build-tools;34.0.0`、`platform-tools`）
- Gradle 8.7（或使用工程自带的 Gradle Wrapper 思路）

### 1. 准备签名密钥（可选，release 构建需要）

```bash
keytool -genkeypair -v \
  -keystore suishoutie.keystore \
  -alias suishoutie -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置本地签名与 SDK 路径

在 `apk-build/android/` 下新建两个不入库的本地文件：

`keystore.properties`：

```properties
storeFile=../suishoutie.keystore
storePassword=你的密钥库密码
keyAlias=suishoutie
keyPassword=你的密钥密码
```

`local.properties`：

```properties
sdk.dir=你的 Android SDK 绝对路径
```

### 3. 同步网页源码并构建

```bash
# 确保工程内网页副本与主源码一致
cp 随手贴完整版.html apk-build/android/app/src/main/assets/index.html

cd apk-build/android
JAVA_HOME=/path/to/jdk17 \
ANDROID_HOME=/path/to/android-sdk \
gradle assembleRelease --no-daemon
```

构建产物位于：

```
app/build/outputs/apk/release/app-release.apk
```

---

## 技术栈

- 前端：原生 HTML / CSS / JavaScript（无框架、无构建依赖、无第三方运行时库）。
- 移动端：原生 WebView 套壳，通过 `JavascriptInterface` 实现导出到系统下载目录、文件选择与返回键协同。

---

## 已知限制与后续计划

- 当前总结为「迄今累计」口径；按自然月 / 年自动生成的情感化总结（含创建时间字段）在规划中。
- 回收站与到期自动清理尚未实现，当前删除为直接删除。
- Windows 桌面版（EXE）计划使用 Tauri 调用系统 WebView2 内核，当前仓库暂未包含。

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
