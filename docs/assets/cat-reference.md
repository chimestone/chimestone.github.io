# 背景猫素材记录

日期：2026-10-27。来源：用户在本次对话中提供的黑底白线猫截图；用户明确要求以此图片转透明底。

交付素材：`static/images/cat-reference-transparent.png`，1774 × 887，RGBA PNG。已检查外部背景与猫头内部存在 alpha=0 的像素，眼睛保留深色瞳孔。移除截图中的蜜蜂与横线，网页通过 SVG viewBox 裁切透明留白。SVG 中仅眼球和瞳孔是交互图层，猫头轮廓来自透明 PNG。

处理使用内置 imagegen 编辑工具。它属于图像编辑输出，不能保证逐像素等同于原截图。原作者及原图许可无法由截图确认，不将本素材声明为 Tabler 或 MIT 图标。

使用的编辑提示词：

> Edit the USER ATTACHED reference screenshot of the hand-drawn white outline peeking cat on a black background, with huge round eyes near the bottom and a tiny bee above (not any screenshots of the blog webpage). This is background removal / extraction, NOT illustration generation: preserve the original cat silhouette, irregular white pen strokes, ear shapes and eye placement faithfully. Extract only the cat from that reference. Remove the flat black background, make the black interior of the cat transparent as well, retain the white outline and the white eye discs with black pupils and small white highlights. Remove the tiny bee above and remove the straight horizontal ledge line below. Crop close around the cat head, with just a small transparent margin, and retain its peeking crop at the bottom. Output a real transparent RGBA PNG, no checkerboard, no new styling, no replacement cat, no text.

维护：猫模板位于 `layouts/_partials/notes/cat.html`；视口位置、尺寸、透明度位于 `assets/css/custom.css`；瞳孔移动范围由每只眼睛的 `data-travel` 控制，移动半径与瞳孔半径之和小于眼白半径。

2026-11-13：浅色主题使用 SVG 颜色矩阵将现有轮廓映射为橘猫色 `#be7a38`，保留原图透明度；眼白改为奶油色、瞳孔改为棕色。仅改变网页渲染配色，PNG 原文件与深色主题的白色线稿保持不变。

2026-11-13 后续调整：按用户要求，将浅色主题改成有实体填充的橘猫。新增 `static/images/cat-ginger-filled.png`，基于原透明 PNG 使用内置 imagegen 编辑生成；保留 1774 × 887 画布、探头构图和眼睛位置，猫头内部填入橘色、耳内奶油色、额头淡条纹，外部保持透明。它是原参考的生成式衍生图，细节不保证逐像素相同，来源与许可限制仍沿用上述记录。网页用独立 SVG 眼睛覆盖以维持鼠标跟随；只在浅色主题显示新素材，移除旧的颜色矩阵。

本次编辑提示词：

> Edit the existing transparent peeking-cat PNG for the light-theme variant. Fill the entire cat head, including both ears, with warm muted ginger orange (#e7ab69); use a slightly darker contour, subtle forehead stripes and cream inner ears. Preserve the original silhouette, proportions, 2:1 canvas, transparent margins, bottom crop, and eye locations and sizes. Keep cream eye whites, brown pupils and highlights. The head interior must be opaque; everything outside must remain alpha-transparent. No backdrop, shadow, text, mouth, nose, whiskers, or new objects. Keep the illustration minimal for a quiet pale blog background.
