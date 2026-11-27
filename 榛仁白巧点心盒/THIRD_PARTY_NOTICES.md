# THIRD_PARTY_NOTICES · 第三方组件声明

本项目 `Whimsical-Cookie-House`（单文件 HTML 版）使用了以下第三方开源组件。
各组件版权归其原作者所有，许可证原文随官方发布包提供。本声明以源码中
实际引用的版本与用途为准。

## 内嵌于 index.html

| 组件 | 版本 | 用途 | 许可证 | 上游仓库 |
| --- | --- | --- | --- | --- |
| tesseract.js | 5.x | OCR 图片转文字（主库内嵌；worker/wasm 核心与语言包运行时从 jsdelivr CDN 加载） | Apache-2.0 | https://github.com/naptha/tesseract.js |
| @tesseract.js-data（chi_sim / eng） | 1.x | 中文简体 / 英文识别语言包（CDN 加载） | Apache-2.0 | https://github.com/naptha/tesseract.js-data |
| pdf.js | 随业务源码打包 | PDF 阅读 / 渲染 | Apache-2.0 | https://github.com/mozilla/pdf.js |
| pdf-lib | 随业务源码打包 | PDF 生成 / 编辑 | MIT | https://github.com/Hopding/pdf-lib |
| three.js（threejs-miniprogram 适配包） | 随业务源码打包 | 火柴人 3D 动画 | MIT | https://github.com/mrdoob/three.js |
| qbsplit（业务自研拆分工具所用解析器） | 随业务源码打包 | QBS 文件分割 | 见上游包内声明 | 随小程序源码附带 |

> 本轮新增的 CSV / TSV 解析、Markdown → HTML 转换为项目自研轻量实现，未引入新的第三方组件，故无对应许可证条目。

## 运行时经 CDN 下载（不随 index.html 分发）

| 资源 | 用途 | 许可证 |
| --- | --- | --- |
| tesseract.js worker / wasm 核心 | OCR 引擎 | Apache-2.0 |
| @tesseract.js-data 语言包 | 中英文识别 | Apache-2.0 |

## 原始小程序内的第三方资源

原微信小程序 `miniprogram-1` 自带若干第三方库与资源（如 pdf.worker、
kgm-v2-mask.bin 等），本次迁移仅将其随业务代码原样打包进单文件，
版权与许可归属原作者，未做任何二次分发修改。

## 免责声明

- 本项目为个人学习与工具用途，不构成对任何第三方组件许可的变更或再授权。
- 若你在合规要求严格的环境使用，请按各组件许可证原文自行留存副本与出处。
- 如你认为本仓库引用了不应公开的内容，请提 issue 联系作者：轻枫万悦（Orangeting-here）。
