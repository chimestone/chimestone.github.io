---
title: "Parallel and Sequential Algorithms: Study Notes"
description: "Work and span, functional computation, sequence operations, algorithm design, and Standard ML practice."
date: 2026-11-13
categories:
  - 算法与数据结构
tags:
  - Parallel Algorithms
  - Sequences
  - Standard ML
contentLanguage: en
toc: true
---

These notes bring together my introductory parallel-algorithms notes and Standard ML lab notes. The central question is how to describe an algorithm's computation, identify independent tasks, and analyze the cost of executing them.

The sequence chapter is the most developed part. The randomized-algorithms section remains an introductory outline, and graph search has not yet been written. Definitions, notation, and code have been edited for consistency; short clarifications and worked examples accompany the original material where needed.

## 1. Work, Span, and Parallelism

An algorithm can be represented by a directed acyclic graph of computational steps. An edge records a dependency: the destination step must wait for its predecessor.

**Work**, written $W$, counts the total computation under a chosen cost model. **Span**, written $S$, measures the longest dependency chain, also called the critical path. With unit-cost steps, work counts all vertices and span counts the vertices on a longest path.

These quantities answer different questions:

- Work: how much computation must be performed altogether?
- Span: how much computation must remain sequential, even with unlimited processors?

For two computations with costs $(W_1,S_1)$ and $(W_2,S_2)$, ignoring constant coordination overhead:

| Composition | Work | Span |
| --- | --- | --- |
| Run one after the other | $W_1+W_2$ | $S_1+S_2$ |
| Run independently in parallel, then join | $W_1+W_2$ | $\max(S_1,S_2)$ |

### Available parallelism

For a nonempty computation with positive span, its **average parallelism** is

$$
\rho=\frac{W}{S}.
$$

Let $P$ be the number of processors and $T_P$ the running time in the idealized model. Two necessary lower bounds are

$$
T_P\geq\frac{W}{P},\qquad T_P\geq S.
$$

The first comes from distributing all work over $P$ processors; the second comes from dependencies. The ratio $W/S$ describes available parallelism, rather than a promise of measured speedup on real hardware.

For example, a balanced reduction of eight numbers uses seven additions across three dependent levels. Counting only additions gives $W=7$, $S=3$, and $\rho=7/3$. An actual implementation also pays for accessing data and coordinating tasks.

Work does **not** mean energy consumption, peak memory, and elapsed time combined. Those are separate resources. Work and span are useful abstractions, while memory traffic, scheduling overhead, and hardware behavior still affect execution.

## 2. Functional Computation and SPARC

### From lambda calculus to a course language

The lambda calculus provides a small vocabulary for expressing computation:

| Form | Meaning |
| --- | --- |
| $x$ | A variable |
| $\lambda x.e$ | A function with parameter $x$ and body $e$ |
| $e_1\ e_2$ | Application of one expression to another |

SPARC is the strict functional language used in the course material to describe parallel algorithms. Here the name refers to that teaching language. Syntax specifies which expressions are valid; semantics specifies what those expressions mean and how they evaluate.

A binding associates a name with a value. In Standard ML, a local binding has this shape:

```sml
let
  val x = 3
in
  x * x
end
```

This is an SML example, rather than a complete description of SPARC syntax.

### Fork–join and nested parallelism

A fork exposes independent computations, and a join waits for their results. A task may itself fork more tasks, producing **nested parallelism**.

For example, two independent recursive subproblems can be evaluated in parallel before their answers are combined. They cannot be treated as independent if one needs the other's result or if they interact through conflicting side effects.

**Concurrency** describes computations whose progress can overlap. **Parallel execution** means computations actually run simultaneously. A concurrent program can still execute on one processor by interleaving its tasks.

Pure functions make dependencies easier to reason about: evaluating a function does not modify shared state. However, functional syntax alone does not make a program execute in parallel. The language, library, and runtime must support the intended execution model.

## 3. Algorithm Analysis

### Asymptotic notation

Asymptotic analysis describes how a cost grows as the input size increases, abstracting away constant factors and lower-order terms.

| Notation | Meaning |
| --- | --- |
| $O(g(n))$ | An asymptotic upper bound |
| $\Omega(g(n))$ | An asymptotic lower bound |
| $\Theta(g(n))$ | Matching asymptotic upper and lower bounds |

For instance, $3n^2+5n+2=\Theta(n^2)$. Big-O does not by itself mean “worst case,” and big-Omega does not mean “best case”: either notation can describe a separately defined best-case, worst-case, or expected-cost function.

### Cost models

| Model | Main abstraction |
| --- | --- |
| RAM | Sequential computation with explicitly chosen primitive-operation costs |
| PRAM | Multiple processors operating on shared memory; simultaneous-access rules depend on the variant |
| Work–span | Total computation and the dependency chain that limits parallel execution |

Choose the model before assigning costs. For example, arbitrary-precision integer multiplication cannot generally be counted as constant time if integer bit lengths grow with the input.

### Recurrences

A recursive algorithm often leads to a recurrence. If two equal-sized subproblems run in parallel, their work adds, while their contribution to span is the larger of their spans.

Consider a balanced reduction over $n$ values, with constant-cost combination and a constant-cost split. For powers of two, a simplified analysis is

$$
W(n)=2W(n/2)+\Theta(1)=\Theta(n),
$$

$$
S(n)=S(n/2)+\Theta(1)=\Theta(\log n),
$$

with constant base-case costs. If the recursive calls execute sequentially, their spans add instead.

The **recursion-tree method** sums the total cost at each level. Costs that decrease geometrically down the tree are root-dominated; costs that increase geometrically are leaf-dominated. If every level contributes roughly the same amount, the number of levels matters. Comparing an individual parent with one child is insufficient: compare the parent with the total contribution of all its children.

The **substitution method** guesses a bound and proves it by induction, including suitable constants and base cases. For the recurrence above, assuming $W(n/2)\leq c(n/2)-d$ gives $W(n)\leq cn-2d+k$ when the local cost is at most $k$. Choosing $d\geq k$ and a sufficiently large $c$ completes an upper-bound argument.

## 4. Sequences

### Definition and notation

A finite sequence of length $n$ over an element type $\alpha$ can be viewed as a function

$$
s:\{0,1,\ldots,n-1\}\longrightarrow\alpha.
$$

The domain is the set of valid indices. The codomain is $\alpha$; the values actually present form the image. A sequence preserves order and permits repeated elements, so an ordinary set does not capture its structure.

Write $S_\alpha$ for the type of sequences whose elements have type $\alpha$. For example, $\langle 10,20,10\rangle$ has length three and its element at index one is $20$.

### Constructing, accessing, and transforming sequences

The notation below describes operations conceptually. Concrete library signatures can use tuples, curried arguments, or a `unit` argument for construction.

| Operation | Purpose | Example |
| --- | --- | --- |
| `length` | Count elements | `length ⟨1,2,3⟩ = 3` |
| `nth` | Access a valid zero-based index | `nth ⟨10,20,30⟩ 1 = 20` |
| `empty` | Construct an empty sequence | `⟨⟩` |
| `singleton` | Construct a one-element sequence | `singleton 5 = ⟨5⟩` |
| `tabulate` | Compute the element at each index | Squares at indices 0 through 3 give `⟨0,1,4,9⟩` |
| `map` | Transform elements independently | Squaring `⟨1,2,3⟩` gives `⟨1,4,9⟩` |
| `subseq` | Take a contiguous slice by start and length | Start 1, length 2 in `⟨10,20,30,40⟩` gives `⟨20,30⟩` |
| `append` | Concatenate two sequences | `⟨1,2⟩ ++ ⟨3,4⟩ = ⟨1,2,3,4⟩` |
| `filter` | Keep matching elements in their original order | Positive elements of `⟨~1,2,~3,4⟩` give `⟨2,4⟩` |
| `flatten` | Concatenate a sequence of sequences | `⟨⟨1,2⟩,⟨3⟩⟩` becomes `⟨1,2,3⟩` |
| `update` | Produce a sequence with one replaced element | Replacing index 1 with 9 in `⟨1,2,3⟩` gives `⟨1,9,3⟩` |
| `inject` | Apply a sequence of indexed replacements | Multiple updates in one operation |
| `isEmpty` | Test whether the length is zero | True for `⟨⟩` |
| `isSingleton` | Test whether the length is one | True for `⟨5⟩` |

In the linked CMU interface, emptiness and singleton checks can be expressed through `length`; they are not exported under those two predicate names. For `inject`, repeated target indices do not imply a portable “last update wins” rule. The documented interface permits a nondeterministic choice among conflicting updates.

Some useful conceptual types are

$$
\operatorname{map}:(\alpha\to\beta)\to S_\alpha\to S_\beta,
$$

$$
\operatorname{tabulate}:(\mathbb{N}\to\alpha)\to\mathbb{N}\to S_\alpha.
$$

### Grouping with collect

`collect` groups values by their keys using a key-ordering function. Its output contains a sequence of values for each key:

```text
input:  ⟨(a,1), (b,2), (a,3)⟩
output: ⟨(a,⟨1,3⟩), (b,⟨2⟩)⟩
```

The relevant output shape is $S_{\alpha\times S_\beta}$, rather than $S_\alpha\times S_\beta$. Each output element pairs one key with its own group.

### Iterate, reduce, and scan

**Iteration** threads an accumulator through a sequence in order. Its conceptual type is

$$
(\beta\times\alpha\to\beta)\to\beta\to S_\alpha\to\beta.
$$

Each accumulator value may depend on the preceding value, creating a sequential chain.

**Reduction** combines elements into one answer. An associative operation with an identity supports regrouping into a tree without changing the mathematical result. Commutativity is unnecessary when the algorithm preserves element order. Floating-point addition requires care because it is not exactly associative.

For addition with identity zero:

```text
reduce (+) 0 ⟨1,2,3,4⟩ = 10
```

**Scan** computes prefix results. There are two conventions:

| Convention | Result for addition over `⟨1,2,3,4⟩` |
| --- | --- |
| Exclusive prefixes | `⟨0,1,3,6⟩` |
| Inclusive prefixes | `⟨1,3,6,10⟩` |

The CMU SML interface's `scan` returns the exclusive prefixes together with the total: `(⟨0,1,3,6⟩, 10)`. Its `scanIncl` returns the inclusive sequence. An example and its type must use the same convention.

### Representation and cost

The sequence abstract data type specifies behavior; array, tree, and list implementations can have different costs. Direct access to an array element is constant time in the usual RAM model, whereas finding an element by index in a linked list may require traversal.

For $n\geq2$, the linked CMU `ArraySequence` specification gives these bounds under its parallel cost model and constant-cost callbacks:

| Operation | Work | Span |
| --- | --- | --- |
| `nth`, `length`, `subseq` | $O(1)$ | $O(1)$ |
| `map`, `tabulate` | $O(n)$ | $O(1)$ |
| `filter` | $O(n)$ | $O(\log n)$ |
| `reduce`, `scan` | $O(n)$ | $O(\log n)$ |

These are library-model bounds. They should not be transferred automatically to an implementation that explicitly charges for a binary fork tree or copies every slice. If callbacks do substantial work, their costs must also be included.

## 5. Algorithm Design

### Reduction and brute force

An algorithmic reduction turns an instance of one problem into an instance of another, then uses the second problem's solution to solve the first.

If solving $B$ would efficiently solve $A$, a lower bound or hardness result for $A$ may transfer to $B$ under the appropriate reduction. The reduction's own cost matters. Simply calling $A$ “hard” does not establish a formal lower bound for every version of $B$.

Brute force systematically explores candidate solutions. It can provide a useful correctness baseline even when its cost makes it unsuitable for large inputs.

### Divide and conquer

The structure is:

1. Solve a sufficiently small instance directly.
2. Divide a larger instance into smaller subproblems.
3. Solve those subproblems recursively.
4. Combine their results.

The base case returns the **solution** to the small instance, not necessarily the instance itself. Independent subproblems expose parallelism, but the division and combination stages can still dominate span.

### Contraction

Contraction compresses an instance into a smaller representative instance, solves it recursively, and expands the answer back to the original instance:

```text
contract → solve → expand
```

For example, adjacent values can be paired and combined to shorten the sequence before a recursive aggregation. Recovering prefix answers requires an expansion step that reconstructs the positions removed by contraction.

The useful question is what information must survive compression so that the expanded result remains correct. Merely making the input smaller is insufficient.

## 6. Randomized Algorithms: An Introductory Outline

A randomized algorithm makes random choices during execution. Depending on the algorithm, randomness may simplify the design, improve expected performance, or make it harder for a fixed input pattern to trigger poor behavior. None of these benefits is automatic.

The current notes introduce two kinds of guarantee:

- An **expected bound** describes an average over the algorithm's random choices, under the stated assumptions.
- A **high-probability bound** controls the chance that the cost exceeds a threshold. The failure probability and its dependence on input size must be specified.

An expected bound alone does not establish a high-probability bound of the same order. This section does not yet contain a worked randomized algorithm or a probability analysis.

## 7. Graphs and Graph Search: Not Yet Written

The source entry contains a chapter title and a study timer, but no substantive graph-search notes. There is no translated chapter to include yet. Graph representations, traversal algorithms, and their work–span analyses remain future additions.

## 8. Standard ML Lab Notes

### Values and output

The original lab examples use `printInt`, `printReal`, `printString`, `getInt`, and `getIntInf`. These names require course-provided helpers or local definitions; they are not the portable Basis interface.

The following examples use Basis operations:

```sml
val () = TextIO.print (Int.toString 100 ^ "\n");
val () = TextIO.print (Real.toString 3.5 ^ "\n");
val () = TextIO.print "Hello, world!\n";
```

`^` concatenates strings. `TextIO.print` returns `unit` and does not add a newline automatically.

To read one integer from the next whitespace-delimited input token:

```sml
fun readIntInf () : IntInf.int =
  case TextIO.scanStream (IntInf.scan StringCvt.DEC) TextIO.stdIn of
      SOME n => n
    | NONE => raise Fail "Expected an integer";
```

This scanner reads an integer prefix; it is not a strict validator for an entire input line. EOF or an unparseable next value produces the `NONE` case.

### Function definitions and Euclid's algorithm

```sml
(* Intended for nonnegative arbitrary-precision integers. *)
fun gcd (n : IntInf.int, m : IntInf.int) : IntInf.int =
  if m = 0 then n else gcd (m, n mod m);

val gcdExample = gcd (48, 18);  (* 6 *)
```

SML is case-sensitive: the structure is `IntInf`, not `intInf`. Comments use `(* ... *)`; a line beginning with `#` is not a comment.

### Recursive input accumulation

This function reads exactly `n` integers, provided valid input is available:

```sml
fun sumInputs (n : int) : IntInf.int =
  if n < 0 then raise Domain
  else if n = 0 then 0
  else
    let
      val x = readIntInf ()
    in
      x + sumInputs (n - 1)
    end;
```

The recursive call is not in tail position: addition still has to happen after it returns.

### Ordinary recursion and tail recursion

Both versions below compute a list's product, with the empty product equal to one:

```sml
fun product (xs : IntInf.int list) : IntInf.int =
  case xs of
      [] => 1
    | x :: rest => x * product rest;

fun productTail (xs : IntInf.int list) : IntInf.int =
  let
    fun loop ([], acc : IntInf.int) = acc
      | loop (x :: rest, acc) = loop (rest, acc * x)
  in
    loop (xs, 1)
  end;

val productExample = product [2, 3, 4];          (* 24 *)
val productTailExample = productTail [2, 3, 4];  (* 24 *)
```

A tail call is the final operation of its branch. The accumulator carries the intermediate result into the next call, leaving no multiplication pending in the caller. A compiler with proper tail-call support can reuse control-stack space; the accumulator and arbitrary-precision values may still require growing memory.

Both versions above follow a sequential dependency chain. Tail recursion alone does not create parallelism. A parallel product would need an appropriate parallel execution mechanism, such as a balanced reduction over a sequence.

## 9. References and Editorial Scope

The article is an English consolidation of my notes, not a reproduction of the course textbook. Study timers and note-taking metadata were removed. The graph placeholder was kept as a coverage note, and missing chapters were not filled with an invented course summary.

The following primary references were used to check terminology, operation semantics, and the corrected SML examples:

- [CMU 15-210 course schedule](https://www.cs.cmu.edu/afs/cs/academic/class/15210-f15/www/schedule.html): SPARC and the course's sequence and algorithm-design topics.
- [Algorithms: Parallel and Sequential, by Umut A. Acar and Guy E. Blelloch](https://www.cs.cmu.edu/afs/cs/academic/class/15210-f24/www-s25/docs/book.pdf): work–span analysis and the conceptual background.
- [CMU SEQUENCE interface](https://www.cs.cmu.edu/afs/cs/academic/class/15210-f18/www/docs/sig/sequence/SEQUENCE.html): grouping, indexed updates, reduction, and prefix conventions. Interface details can differ between course versions.
- [CMU ArraySequence cost specification](https://www.cs.cmu.edu/afs/cs/academic/class/15210-f18/www/docs/cost/sequence/ArraySequence.html): implementation-specific work and span bounds.
- [Standard ML Basis: TextIO](https://smlfamily.github.io/Basis/text-io.html), [INTEGER](https://smlfamily.github.io/Basis/integer.html), and [IntInf](https://smlfamily.github.io/Basis/int-inf.html): input, output, conversion, and arbitrary-precision integers.
