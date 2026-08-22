---
title: Building a Privacy-First Browser Workbench
description: Notes on why Tools & Games keeps everything in your own browser, what that buys you, and the three places where the promise needs an asterisk.
date: 2026-08-22
tags: [Web, Privacy, Tools]
starter: true
published: true
---

## Why I started it

Most small online utilities work the same way. You paste something in — a block of
text, a spreadsheet column, an image, sometimes a document you would never email to
a stranger — and it disappears to a server you know nothing about. You get your
result back. What happened in between is not shown to you.

For the overwhelming majority of those tools, the trip to a server is not doing any
work. Counting words, converting a colour, formatting JSON, resizing an image,
generating a QR code — a browser can do all of that on its own. The server is there
because that is how web apps are usually built, not because the task requires it.

So the starting rule for [Tools &
Games](https://github.com/MdMarufHossen71/Tools-Games) was simple: if the browser
can do it, the browser does it. Nothing leaves the tab.

## What "privacy-first" actually means here

It is worth being precise, because the phrase gets used loosely.

- **Your input stays local.** Text, files, and preferences are processed in the page
  and stored, when they need to persist, in your own browser's storage.
- **There is no account.** Nothing to sign up for means nothing to link your usage
  to, and no password of yours for me to store badly.
- **No analytics or tracking code ships with the app.** I do not know which tools
  you used, or that you were there at all.

That last one has a cost I accepted deliberately: I have no usage data, so I cannot
tell which tools people actually want. I would rather guess.

## The three asterisks

A privacy claim with hidden exceptions is worse than a modest, complete one, so
here are the exceptions, in the open:

1. **Some fields are deliberately excluded from input memory.** The app can remember
   what you typed so a refresh does not lose your work — but anything that looks
   like a password or a key is left out of that, on purpose.
2. **The AI features are bring-your-own-key.** If you use them, your key and your
   prompt go to that provider, under that provider's terms. That is a real network
   request to a third party, and the app says so at the point of use rather than
   burying it here.
3. **File sharing needs a signalling server.** Getting a file from one device to
   another requires the two devices to find each other, and that introductory step
   goes through third-party infrastructure. The file contents travel directly; the
   introduction does not.

None of those are things I would have discovered by reading my own marketing copy.
They came from asking, feature by feature, "does this one still hold?"

## What I would tell someone starting the same thing

- **Decide the constraint first, then design inside it.** "No server" is annoying
  early and liberating later. It removed entire categories of decision — auth,
  sessions, rate limits, a database, a privacy policy with teeth in it.
- **Build the directory before the tools.** A catalogue of named, routed, searchable
  slots turned out to be the actual product. Each tool behind a slot is small; the
  thing that makes them findable is not.
- **Write down the exceptions as you create them.** The list above was much easier to
  assemble because I noted each one when I added the feature, rather than
  reconstructing it afterwards from the code.

---

_This is a starter draft._ The structure and the claims are accurate as of writing,
but the specifics — how the storage layer ended up, what broke, what I would rebuild
— get filled in as the project moves. I would rather publish an honest outline than a
polished piece about work that has not finished happening.
