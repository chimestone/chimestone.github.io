---
title: Git 操作笔记：分支、合并与撤销
description: 从分支切换到撤销提交，理清 branch、merge、rebase、reset 和 revert 的区别。
date: 2026-10-28
tags:
  - Git
aliases:
  - /blog/hello/
---

这份笔记把常见的 Git 操作串起来：先创建分支，再整合改动，最后区分几种容易混淆的撤销方式。

## 创建与切换分支

创建分支和切换分支是两件事：

```sh
git branch topic       # 创建分支，仍留在当前分支
git switch topic       # 切换到 topic
git switch -c new-topic  # 创建并切换到新分支
```

原来记下的 `git checkout topic` 和 `git checkout -b new-topic` 也可以完成对应的切换操作。这里用 `switch`，让命令的用途更直观。

## 合并与变基

假设当前在 `topic` 分支，要整合 `main` 的更新：

```sh
git merge main
```

`merge` 把指定分支的历史合入当前分支。若两条分支已经分叉，通常会产生一个合并提交；如果可以快进，则可以只移动分支指针。

另一种方式是：

```sh
git rebase main
```

`rebase` 会将当前分支上需要重放的提交，依次应用到新的基点上。历史通常因此更线性，但重放后的提交身份也可能改变。

两者不能简单理解为“效果一样”：合并保留分叉关系，变基会改写相关提交的历史。对于已经共享、有人基于它继续工作的提交，变基前需要先协调。

## 用相对引用定位提交

不必每次都输入提交哈希，可以从 `HEAD` 出发：

| 写法 | 含义 |
| --- | --- |
| `HEAD` | 当前检出的提交 |
| `HEAD^` | 当前提交的第一个父提交 |
| `HEAD~2` | 沿第一个父提交连续向前两代 |
| `HEAD^2` | 当前提交的第二个父提交，常见于合并提交 |

`^2` 和 `~2` 并不是一回事：前者选父提交，后者沿第一父链走两代。

## reset：移动当前分支

下面讨论带提交参数的 `reset`。例如退回一代时，不同模式对文件的影响不同：

| 命令 | 暂存区 | 工作区 |
| --- | --- | --- |
| `git reset --soft HEAD~1` | 保持原样 | 保持原样 |
| `git reset --mixed HEAD~1` | 恢复到目标提交 | 保持原样 |
| `git reset --hard HEAD~1` | 恢复到目标提交 | 也恢复到目标提交 |

三者都会把当前分支移到目标提交。不指定模式时默认 `--mixed`，所以不能笼统地说“reset 总会保留文件改动”。`--hard` 可能丢掉尚未提交的改动，执行前先确认工作区状态。

## revert：用新提交抵消改动

```sh
git revert HEAD
```

在普通提交的场景下，这会用一个新提交抵消 `HEAD` 引入的改动，原提交仍保留在历史中。撤销已经共享的提交时，这种方式通常更容易协作；遇到冲突仍需要处理。

回头看，这几个命令最需要分清的是：当前在哪个分支、是否改写提交历史，以及改动会留在暂存区还是工作区。

## 参考

本文由个人 Git 笔记整理，命令行为对照官方文档校正：

- [创建分支](https://git-scm.com/docs/git-branch)与[切换分支](https://git-scm.com/docs/git-switch)
- [merge](https://git-scm.com/docs/git-merge) 与 [rebase](https://git-scm.com/docs/git-rebase)
- [相对引用](https://git-scm.com/docs/git-rev-parse#_specifying_revisions)
- [reset](https://git-scm.com/docs/git-reset) 与 [revert](https://git-scm.com/docs/git-revert)
