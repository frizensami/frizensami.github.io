---
title: "NUS Timetable Optimizer"
layout: post
tag: [timetable, nus, optimization]
projects: true
image: null
hide_date: true 
headerImage: false
#hidden: true 
description: "A free and efficient tool to find the best timetable for your NUS modules."
category: project
author: sriram
externalLink: false
---



# Overview

NUS Timetable Optimizer (at <a href="https://nus-optimizer.com/" target="_blank">nus-optimizer.com</a>) is a free and efficient tool to find the best timetable for your NUS modules. This project is the culmination of many years of work and failed attempts to try to realize the idea, and in many ways, I consider it to be one of my best achievements :)


While there's more info at <a href="https://nus-optimizer.com/about" target="_blank">nus-optimizer.com/about</a> and on <a href="https://github.com/frizensami/nus-timetable-optimizer" target="_blank">GitHub</a>, the core technology is to use a "SMT Solver" e.g., <a href="https://github.com/Z3Prover/z3" target="_blank">Z3</a> to find the best timetable for you. This is a very powerful tool that can solve constraint problems as long as they are posed a certain way.

One of the critical things I'm proud of is that this runs **entirely on the browser**. Because of the CPU intensive nature of the problem, running a server to spawn threads to solve individua timetables at 100% CPU was a cost I did not want to pay (unlike other approaches to solve this). I had to use a WebAssembly version of Z3, which is a bit of a pain to set up, but ultimately let me host it for free.

# Interesting things

- These are the attempts I made before I finally got it right:
    - **Attempt 1 (August 2015, 6 years before final version)**: "Week 0" of my first semester at NUS -- I worked together with a few friends to build a brute-force heuristic solver that would try to find the best timetable for you. It was fun, but also very slow and not very accurate. That code is still up at <a href="https://github.com/frizensami/corsai" target="_blank">GitHub</a> but I can't say the implementation is anything to be proud of.
    - **Attempt 2 (March 2016, 5 years before final version)**: NUS School of Computing flagship 24-hour hackthon "Hack-N-Roll" -- four of us worked together to build a more efficient solver that would use a set of smarter heuristics. I don't recall anything about the actual approach at this point, but I do recall it not really working that well when the judges came by to judge the hackathon results -- again, too slow, too CPU intensive. 
    - **The drought**: After consulting some of the faculty in NUS, I'd pretty much given up on the idea of building a solver that would work in a reasonable amount of time. Also, I had other things to do, like graduate.
    - **Initial inspiration (2018, 3 years before the final version)**: I heard that two students from NUS might have solved the problem by using a SAT solver (<a href="https://github.com/raynoldng/nusmods-planner" target="_blank">on GitHub</a>). I visited the website they had set up, and it looked good! So I figured the problem was solved, and decided to put it to rest.
    - **Attempt 3 (2021, the final version)**: I realized that the website I'd seen in 2018 was no longer up, and my understanding was that hosting costs were likely an issue. I decided to try and tackle the issue and also solve the problem of scalable hosting of this solver so that I wouldn't have to fund the deployment out of my own pocket. After a few months of work, I finally got it working, and it's been happily running with minimal interference since then :)