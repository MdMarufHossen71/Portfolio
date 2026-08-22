---
title: What I Am Learning While Building for the Web
description: A first-year maths student's running notes on picking up frontend work — what transferred from studying proofs, what did not, and what I am deliberately not learning yet.
date: 2026-08-22
tags: [Learning, Web]
starter: true
published: true
---

## Where I am starting from

I am a first-year Mathematics student in Gazipur, and I came to the web from design
work rather than from a computer science course. That order matters: I knew what I
wanted a page to look like well before I knew how to make a browser produce it.

About six months of freelance work in, this is what I have actually noticed. It is
not advice — I am too early for that. It is a record I expect to disagree with later.

## What transferred from maths

More than I expected, though not the parts I assumed.

- **Precision about definitions.** In a proof, an undefined term is a hole. In code it
  is the same: most bugs I chase turn out to be two parts of a program using one word
  for two different things.
- **Working out from the invariant.** "What must be true here, no matter what?" is a
  useful question in both. It is how I decide what belongs in a type and what belongs
  in a check.
- **Tolerance for being stuck.** Sitting with a problem that does not move for an hour
  is normal in one and, it turns out, normal in the other.

What did _not_ transfer: the expectation that there is one correct answer waiting to
be found. Frontend work is full of choices that are defensible in several directions
and wrong only in retrospect.

## What I underestimated

**Layout is harder than logic.** I can reason about a data transformation. Making a
card behave sensibly at 320 pixels and at 1440 pixels, on a touch screen and with a
keyboard, is a different kind of difficulty — one with more variables than I can hold
in my head at once. I now check narrow widths first, because the desktop version
almost always survives the trip down and the reverse is not true.

**Accessibility is not a pass at the end.** The first time I tried to "add
accessibility" to something already built, I ended up rebuilding it. A card whose
entire surface is a link cannot be fixed with an attribute; the element choice was
the mistake. Getting the element right first is cheaper and it is also just less work.

**Naming is most of the design.** When I cannot name a component, it is usually
because it is doing two things.

## What I am deliberately not learning yet

This is the part I think about most. There is a strong pull to collect tools —
another framework, another state library, another build system — because collecting
feels like progress and is much easier than getting good at what I already have.

So, for now, and with the intention of revisiting this: no backend, no ORM, no
deployment platform beyond static hosting. Depth over surface area. I would rather be
genuinely reliable with HTML, CSS, TypeScript and React than superficially aware of
twelve things.

## The habits that are sticking

- **Read the error message all the way to the end.** Embarrassingly effective.
- **Make the honest version first.** A placeholder that says `[Add description]` is
  better than filler text, because filler text has a way of shipping.
- **Keep a note of what I do not understand.** Every entry eventually gets crossed
  off, and the list is a better map of my progress than anything I have built.

---

_This is a starter draft._ It will be rewritten as the answers change — and the point
of dating it is that they will. If a claim here still reads as true in a year, I
probably stopped paying attention.
