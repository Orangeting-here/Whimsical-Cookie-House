# Whimsical-Cookie-House

**作者：Orangeting-here**

最近更新：2026-11-18

自己攒的一些离线小工具，想法和测试都由本人完成；代码有 AI 辅助编写。大部分工具为纯前端单文件，数据只留在本机，不联网上传。使用前请确认你的场景允许使用这些工具。

## 在线访问

导航页（推荐，可预览 / 下载）：

https://orangeting-here.github.io/Whimsical-Cookie-House/

## 工具列表

### 网页工具（浏览器直接打开，离线运行）

| 工具 | 说明 | 在线预览 | 目录 / 文件 |
|---|---|---|---|
| 随手贴 | 便利贴式任务管理：时间阶梯 / 四象限 / 任务板 / 总结，本地存储，另有安卓安装包。 | [打开](https://orangeting-here.github.io/Whimsical-Cookie-House/随手贴/最新版-随手贴.html) | `随手贴/最新版-随手贴.html` |
| 词频分析器 | 离线中文高频字词分析：词频榜、短语重复、部位·动作、出处、对照分析等，内嵌分词词典。 | [打开](https://orangeting-here.github.io/Whimsical-Cookie-House/词频分析器/最新版-词频分析器.html) | `词频分析器/最新版-词频分析器.html` |
| 本地小说阅读器 | 打开本地 txt、docx 慢慢看；可选接本地 Ollama 做续写 / 润色 / 查问题。 | [打开](https://orangeting-here.github.io/Whimsical-Cookie-House/阅读器/最新版-阅读器.html) | `阅读器/最新版-阅读器.html` |

### 下载包（模组 / 安装包，走仓库 raw 或 Release 附件）

| 工具 | 说明 | 文件 |
|---|---|---|
| 共享分页整理库（Tagged Library） | 服务端 Fabric 模组（MC 26.3）：按染料颜色分库，同色箱子共用自动整理、可分页的共享库存；客户端无需安装。 | `MC.mod-箱子/taggedlib-1.1.5.jar.zip` |
| 弹簧发射台（Spring Module） | Fabric 模组（MC 26.3）：冰霜保持动量、粘土自行减速，红石充能与矿车弹射。 | `MC.mod-弹簧/springmodule-1.0.0.jar.zip` |
| 随手贴 · 安卓版 | 随手贴的 Android 安装包。 | `随手贴/最新版-随手贴.apk` |
| 个人档案库 | 本地档案 / 简历库，含电脑版与手机版；**文件待上传**，链接随后续 Release 补齐。 | 待补充 |

## 目录结构

```
.
├── index.html                          # 导航页（启动屏 + 工具墙 + 详情预览）
├── README.md
├── LICENSE                             # MIT 许可证
├── THIRD-PARTY-NOTICES.txt             # 第三方开源组件声明
├── 随手贴/
│   ├── 最新版-随手贴.html
│   └── 最新版-随手贴.apk
├── 词频分析器/最新版-词频分析器.html
├── 阅读器/最新版-阅读器.html
├── MC.mod-箱子/taggedlib-1.1.5.jar.zip
└── MC.mod-弹簧/springmodule-1.0.0.jar.zip
```

## 使用许可

本项目自身代码采用 **MIT 许可证**，可自由使用、修改、分发，商用亦可，唯一要求是保留作者署名（见 [LICENSE](LICENSE)）。

仓库内联 / 内嵌的第三方开源组件（mammoth.js、JSZip、pako、jieba 词典等）遵循各自原始许可，详见 [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt)。

## 隐私说明

- 网页工具均为纯前端，分析与阅读在浏览器本地完成，文本不发送到服务器。
- 个人设置与数据保存在设备本地（浏览器 localStorage / 应用本地存储），清除对应数据即移除。
- 模组为服务端专用，不注册客户端内容、不发送自定义网络包。
