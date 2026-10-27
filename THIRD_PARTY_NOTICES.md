# Third-party notices

## User-provided cat reference

`static/images/cat-reference-transparent.png` was extracted from the user's attached
reference at their explicit request on 2026-10-27 using imagegen background removal.
The black background, bee and horizontal ledge were removed. The cat outline is
rendered as a raster image; independent SVG eye layers provide cursor tracking.
This replaces the previous Tabler cat; no Tabler artwork is used by the current page.

The screenshot does not establish the original artist or license. This repository
does not claim an MIT license for the supplied artwork. Asset details and the
editing prompt are recorded in `docs/assets/cat-reference.md`.

## Cursor-eye movement reference

Adapted direction-and-bounds technique from Takane Ichinose's “Cat eye following mouse pointer”:
https://codepen.io/takaneichinose/pen/MRWeoY
Retrieved: 2026-10-27. Public Pen MIT licensing policy: https://blog.codepen.io/documentation/licensing/

Copyright (c) Takane Ichinose

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

The adaptation uses SVG-local pupil offsets, each eye's actual screen position, event-driven requestAnimationFrame interpolation, and static fallback for reduced motion/coarse pointers. No Wallpaper Engine scene package is extracted or distributed.
