---
title: 从 C 代码到可执行文件
description: 用一个 Hello World，串起预处理、编译、汇编和链接四个阶段。
date: 2026-10-28
tags:
  - C
  - 计算机系统
---

最开始，我对代码的理解就是 IDE 里的一段文本。比如这个最简单的程序：

```c
#include <stdio.h>

int main(void)
{
    printf("hello world!\n");
    return 0;
}
```

保存为 `hello.c` 后，它还不是可以直接运行的程序。以 GCC 的常见流程为例，中间会经过预处理、编译、汇编和链接。

## 预处理：展开头文件与宏

```sh
gcc -E hello.c -o hello.i
```

这一阶段处理 `#include`、宏展开、条件编译等。`stdio.h` 中的相关内容会被包含进预处理结果；其中有使用 `printf` 所需的声明，并不等于把这个库函数的完整实现贴进源文件。

## 编译：生成汇编代码

```sh
gcc -S hello.i -o hello.s
```

编译器分析预处理后的 C 代码，生成目标平台的汇编代码。得到的 `hello.s` 仍然是文本形式，具体内容会受到平台与编译选项影响。

## 汇编：生成目标文件

```sh
gcc -c hello.s -o hello.o
```

汇编阶段把汇编代码转成目标文件中的机器代码，并保留链接需要的符号、重定位等信息。`hello.o` 还需要经过链接，不能把它直接当作最终程序。

## 链接：组成可执行程序

```sh
gcc hello.o -o hello
```

链接阶段组合目标文件与所需的库，解析符号引用，生成可执行文件。这里的 `printf` 由 C 库提供；它不是定义在 `stdio.h` 中的普通函数实现。

库可以采用静态或动态链接方式，所以也不能一概说“所有库代码都被打包进最终文件”。

在具有 GCC 的常见 Unix 环境中，可以运行：

```sh
./hello
```

## 把四步连起来

```text
hello.c → hello.i → hello.s → hello.o → hello
          预处理     编译       汇编      链接
```

平时直接执行 `gcc hello.c -o hello`，编译器驱动就会完成这些阶段，不要求把每个中间文件都保存在磁盘上。拆开来看，是为了理解代码如何走到可执行程序这一步。

以上命令以 GCC 与常见 Unix 环境为例；不同操作系统、工具链下，文件扩展名和运行方式可能不同。

## 参考

本文由个人计算机系统笔记整理，补充命令示例并校正头文件与库的关系：

- [GCC：控制输出阶段的选项](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [GCC 预处理器：头文件](https://gcc.gnu.org/onlinedocs/cpp/Header-Files.html)
- [GNU C Library：头文件与声明](https://sourceware.org/glibc/manual/latest/html_node/Header-Files.html)
