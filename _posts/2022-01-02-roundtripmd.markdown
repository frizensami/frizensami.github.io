---
title: "Round Trip, MD"
layout: post
tag: [website, pathfinding, graphs, medical]
projects: true
image: null
hide_date: true 
headerImage: false
#hidden: true 
description: "A route planner for doctors' rounds within Singapore General Hospital"
category: project
author: sriram
externalLink: false
---



# Overview

Round Trip MD (at <a href="https://roundtrip.sriramsami.com/" target="_blank">roundtrip.sriramsami.com</a>) attempts to ease the pressure of junior doctors having to lead senior doctors on rounds around unfamiliar / complex environments. Given a list of wards to visit in the hospital, it returns the most efficient route (by time). I made this in collaboration with a medical student friend who helped to map out <a href="https://www.sgh.com.sg/" target="_blank">Singapore General Hospital</a> (SGH) and its wards.


# Interesting things

- The solver includes both an *exact* solver (for a bruteforce search when the number of stops in the rounds are low) and *genetic* solver (for a heuristic search if there are many stops).
- It includes details about lift lobbies and staircases and their expected "costs" in terms of time when taking these routes 
- However, it doesn't account for "effort", i.e., that stairs are harder to climb than lifts. Another issue is that taking one set of stairs is fine, but taking many in succession is not, but it's really hard to think of a way to quantify and represent this.
- The brute force solver just generates all possible permutations of node orders, and computes the cost for the whole route. A nice optimization here is that the cost of the route is the sum of the cost of individual shortest paths, so we can just cache the shortest paths we find along the way between combinations of two nodes.
- The route is *directed* -- some areas in the hospital are one-way only! This complicates things for the sake of a few edges, but it's necessary since these situations apparently happen very often.