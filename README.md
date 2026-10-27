# 我的博客

基于 Hugo 和 Hextra 的中文个人博客，采用定制深色三栏布局：左侧固定个人信息和可独立滚动的文章目录，中间首页/正文，右侧最近更新或章节目录与开源背景猫。默认深色，可通过左侧底部的主题开关切换。

界面设计与验收文档：[docs/UI-REDESIGN.md](docs/UI-REDESIGN.md)。猫素材来源和许可：[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

网站：https://chimestone.github.io/

## 发布更新

修改文章后，在项目目录执行：

```powershell
git add .
git commit -m "更新博客"
git push
```

推送到 `main` 后，GitHub Actions 会构建并部署到 GitHub Pages。构建失败时不会发布本次更新，线上继续使用上一次成功部署的版本。可以在仓库的 Actions 页面查看进度和错误日志，也可以通过 `workflow_dispatch` 手动重跑。Pull Request 只做构建检查，不部署。

本地保存会更新本地预览，线上更新需要提交、推送并等待部署完成。仓库为公开仓库；`draft: true` 只阻止文章出现在正式网站，提交到仓库的草稿源码仍然公开。

## 本地预览

安装 Hugo（建议 extended 版本）和 Go，在项目目录运行：

```powershell
hugo server -D
```

打开终端显示的本地地址（通常是 http://localhost:1313/）。`-D` 会显示草稿；正式构建不包含草稿。

本次搭建下载的 Hugo 位于项目内 `.tools/hugo/hugo.exe`。如果终端找不到 `hugo`，可直接运行：

```powershell
.\.tools\hugo\hugo.exe server -D --cacheDir "$PWD/.hugo-cache"
```

`.tools/` 和 `.hugo-cache/` 是本地工具与缓存，不纳入版本管理。

## 写一篇文章

```powershell
hugo new content blog/my-next-post.md
```

在生成的 Markdown 文件中填写标题、正文、`description`（摘要）和 `tags`（标签），可用 `weight` 调整左侧导航顺序。发布时将 `draft: true` 改为 `draft: false`，并确认日期不是未来时间。新文章自动出现在左侧目录、博客索引和首页最近文章中，无需手动添加链接。子文件夹使用 `_index.md` 建立分类分组。

## 修改内容与样式

- `hugo.yaml`：站名、导航、站点介绍及域名；`params.profile` 控制作者名字、简介与 GitHub 链接，可添加 `avatar: images/avatar.jpg` 并将图片放在 `static/images/avatar.jpg`。
- `content/_index.md`：首页介绍。
- `content/blog/_index.md`：博客索引介绍，文章列表自动生成。
- `content/about.md`：关于页面。

- `layouts/_partials/notes/`：个人区、首页、文章、目录、右栏等布局；首页主标题在 `home.html`。
- `assets/css/custom.css`：布局、颜色、响应式与动效。
- `assets/js/notes.js`：目录状态、抽屉、阅读进度、猫眼追踪。

保留 Hextra 的 Markdown 渲染、全文搜索和主题切换；`cascade.type: docs` 继续使用本站的文档式布局覆盖。浏览器会记住手动选择的主题；如果仍显示浅色，通过侧栏底部切换到深色即可。手机通过左上角菜单查看导航，通过文章顶部“本文目录”查看章节。

## 构建

运行：

```powershell
hugo --minify
```

生成的 `public/` 可部署到静态网站托管服务。首次构建需要联网获取 Hextra 模块和搜索脚本。自动部署流程固定使用已验证的 Hugo Extended 0.157.0，并按 `go.mod` 安装 Go。源码中的 `baseURL` 已设置为 GitHub Pages 地址，Actions 构建时还会使用 Pages 返回的实际地址。

`public/`、`.tools/` 和缓存目录不会提交到仓库。发布无需个人访问令牌或服务器 SSH 密钥，使用 GitHub Actions 自带的临时部署凭据。
