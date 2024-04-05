---
title: "Offline Plagiarism Detector"
layout: post
tag: [rust, plagiarism, education]
projects: true
image: null
hide_date: true 
headerImage: false
#hidden: true 
description: "Offline quick-and-dirty text plagiarism checker written in Rust"
category: project
author: sriram
externalLink: false
---



# Overview

Online plagiarism detection tools usually come with a few constraints. It could be a paid-only service, the number of characters to check could be artificially limited, etc. This tool aims to fill a gap where:

1. Plagiarism cases are usually simple copy-paste jobs of a few text phrases with minor edits,
2. Paying for an online tool is unpalatable,
3. The source texts that might be copied from can be put together manually by the user into a few files (i.e. the Internet is not automatically searched by the tool), or the only concern is people copying from each other, and
4. Running a command-line tool is simple enough for the user

The tool is written in Rust, and it's a quick-and-dirty implementation that uses either an equality check between sets of words or Levenshtein distance to detect plagiarism. It's parallelized with Rayon to make Levenshtein distance calculations faster, specifically.

The Rust crates can be found here:

[![Crates.io Version](https://img.shields.io/crates/v/plagiarism-basic?label=PlagiarismBasic%20Executable
)](https://crates.io/crates/plagiarism-basic)
[![Crates.io Version](https://img.shields.io/crates/v/plagiarismbasic_lib?label=PlagiarismBasic%20Library
)](https://crates.io/crates/plagiarismbasic_lib)

and the [GitHub repository here](https://github.com/frizensami/plagiarism-basic):



## Interesting things

- We generate a HTML file using Handlebars and style it with Semantic UI. This is auto-opened by default using `xdg-open`. 