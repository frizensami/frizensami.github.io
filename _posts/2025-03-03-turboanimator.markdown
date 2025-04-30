---
title: "TurboAnimator"
layout: post
tag: [extension, google-slides, animation, productivity]
projects: true
image: null
hide_date: true 
headerImage: false
#hidden: true 
description: "Browser extension to automate tedious animation tasks in Google Slides with a single keyboard shortcut.
"
category: project
author: sriram
externalLink: false
---



# Overview

TurboAnimator (at <a href="https://turboanimator.com" target="_blank">turboanimator.com</a>) is a browser extension I made to automate tedious animation tasks in Google Slides with a single keyboard shortcut. I made it because I use a lot of animations in my Google Slides for teaching, and it's pretty tedious. There's no default way to change the default animation style and delay, and you need many clicks to add, delete, and modify animations. 

The extension simulates the clicks you would make to do these tasks, and does them for you. It's saved me a lot of time, and I hope it can save you time too.

It's free and available for Chrome and Firefox.

<div class="d-flex flex-column flex-lg-row align-items-center">
    <a href="https://chrome.google.com/webstore/detail/turboanimator-for-google/mhdmaokphjlbobmlioagngakkofbchdo" target="_blank"><img class="app-badge" style="height: 10vh" src="/assets/images/chrome_store.png" alt="TurboAnimator on the Chrome Web Store" /></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/slides-animator/" target="_blank"><img class="app-badge" style="height: 10vh" src="/assets/images/firefox.webp" alt="TurboAnimator at Firefox Browser Add-Ons" /></a>
</div>


# Interesting things

- UI interaction on Google Slides isn't entirely straightforward. Some elements need to be "clicked" multiple times via Javascript, but they require only one click in "real life". 
- A particularly interesting effect is that if we add animations too fast (specifically, if we add an animation and set the delay slider, then immediately create a new animation), the delay value is incorrectly for the previous animation. This is because the slider hasn't finished updating yet in some internal method. A minimum delay of around 0.5s (not tested rigorously) is required to avoid this issue.
- I just like this idea in general because of how much time it genuinely saved - both across teaching and research, since well-animated slides are important for piecemeal content delivery.