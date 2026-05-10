---
title: "PID Flight Lab"
layout: post
tag: [teaching, controls, simulation, react]
projects: true
image: null
hide_date: true
headerImage: false
description: "An interactive teaching tool for building intuition about PID controllers through drone simulations."
category: project
author: sriram
externalLink: false
---

# Overview

PID Flight Lab, at <a href="/pid" target="_blank">sriramsami.com/pid</a>, is an interactive teaching tool I built to help students develop intuition for PID control. Rather than starting with equations, it puts learners inside small control problems and lets them feel why each part of a controller is needed.

The tool currently has an **Drone altitude control** simulation where students try to hold a drone at a target height while gravity, wind, and changing targets disturb the system.


Over time, the tool introduces more control authority. Students start with manual control, move through simple automatic controllers, and then tune P, I, and D terms in focused scenarios before reaching a full PID sandbox. This was intended to go alongside a small micro-teaching lecture on PID control, but it can also be used as a standalone learning resource.


# Try it

You can open the live tool here:

<p>
  <a href="/pid" target="_blank"><strong>Launch PID Flight Lab</strong></a>
</p>
