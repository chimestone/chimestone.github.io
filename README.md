# 我的博客

基于 Hugo 和 Hextra 的中文个人博客，使用主题原装的文档布局：左侧文章导航、正文、右侧章节目录。默认使用黑色深色模式，可通过左侧底部的主题开关切换。

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

在生成的 Markdown 文件中填写标题、正文、`description`（摘要）和 `tags`（标签），可用 `weight` 调整左侧导航顺序。发布时将 `draft: true` 改为 `draft: false`，并确认日期不是未来时间。新文章会自动出现在左侧导航中；如需在博客索引正文中展示链接，可同时编辑 `content/blog/_index.md`。

## 修改内容与样式

- `hugo.yaml`：站名、导航、站点介绍及域名。
- `content/_index.md`：首页介绍。
- `content/blog/_index.md`：博客索引与文章链接。
- `content/about.md`：关于页面。

页面布局与配色直接使用 Hextra 原装样式。`content/_index.md` 的 `cascade.type: docs` 会让所有内容页使用文档布局，`hugo.yaml` 的 `params.theme.default: dark` 设置默认深色模式。浏览器会记住手动选择的主题；如果仍显示浅色，通过侧栏底部切换到深色即可。

## 构建

运行：

```powershell
hugo --minify
```

生成的 `public/` 可部署到静态网站托管服务。首次构建需要联网获取 Hextra 模块和搜索脚本。自动部署流程固定使用已验证的 Hugo Extended 0.157.0，并按 `go.mod` 安装 Go。源码中的 `baseURL` 已设置为 GitHub Pages 地址，Actions 构建时还会使用 Pages 返回的实际地址。

`public/`、`.tools/` 和缓存目录不会提交到仓库。发布无需个人访问令牌或服务器 SSH 密钥，使用 GitHub Actions 自带的临时部署凭据。
