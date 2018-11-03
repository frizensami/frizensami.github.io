---
title: "A Random LWN Article (Security)"
layout: post
date: 2018-11-02 17:30
image: /assets/images/markdown.jpg
headerImage: false
tag:
- lwn
- random
- security
star: false
category: blog
author: sriram
description: A Random LWN Article (Security Category)
---


<style>
.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>


# Loading Random LWN Security Article .....

<center>
<div class="loader"></div>
</center>

<br>
<br>
<br>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script>
var regex = /\/Articles\/(.*?)\//g;

$.getJSON('https://allorigins.me/get?url=' + encodeURIComponent('https://lwn.net/Security/Index') + '&callback=?', function(data){
    var lwn_content = data.contents;
    console.log(lwn_content);
    var matches = lwn_content.match(regex);
    var rand_int = Math.floor((Math.random() * (matches.length - 1)) + 0);
    console.log(matches[rand_int]);
    window.location.href = "https://lwn.net" + matches[rand_int];
});
</script>




