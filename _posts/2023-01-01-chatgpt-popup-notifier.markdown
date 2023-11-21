---
title: "ChatGPT Popup Notifier"
layout: post
tag: [extension, chatgpt, productivity]
projects: true
image: null
hide_date: true 
headerImage: false
#hidden: true 
description: "Browser extension that notifies you when ChatGPT finishes generating your response (and more)."
category: project
author: sriram
externalLink: false
---



# Overview

I made ChatGPT Popup Notifier since I always ask ChatGPT something that takes a while to process, switch to another tab, and sometimes forget about ChatGPT for hours. This extension notifies you when ChatGPT finishes generating your response, so you can get back to it immediately, including immediately notifying you if ChatGPT returned an error (which happens often!). For those of us using DALL-E, which takes ages to complete generating a picture, this also works.  

The extension simulates the clicks you would make to do these tasks, and does them for you. It's saved me a lot of time, and I hope it can save you time too.

It's free and available for Chrome.

<div class="d-flex flex-column flex-lg-row align-items-center">
    <a href="https://chromewebstore.google.com/detail/chatgpt-popup-notifier/ljhchoofdnmgnjgpclaofcedbfmbcmgp" target="_blank"><img class="app-badge" style="height: 10vh" src="/assets/images/chrome_store.png" alt="TurboAnimator on the Chrome Web Store" /></a>
</div>


## Interesting things

- The extension includes `hacktimer.js`, which is a library that allows you to speed up ChatGPT responses even if you navigate away from the ChatGPT tab -- this slowdown happens because browsers "throttle" background tabs. While I haven't tested it comprehensively, it seemed faster with `hacktimer.js` than without it.