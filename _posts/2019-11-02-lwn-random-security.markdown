---
title: "Go to a Random LWN (Linux Weekly News) Article on Security"
layout: post
date: 2018-11-02 17:30
image: /assets/images/markdown.jpg
headerImage: false
tag:
- lwn
- random
- security
star: false
published: true
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


# Loading Random LWN Security Article.....

<center>
<div id="loader" class="loader"></div>
</center>

<br>

<ol>
<li id='l1' style="color: red"> Retrieving LWN.net's Security Articles Index page... </li>
<li id='l2' style="color: red"> Parsing and collating article links... </li>
<li id='l3' style="color: red"> Setting link... </li>
</ol>

<br>

<center>
<input id="go" type="button" disabled value="Go to Random LWN Article" />
</center>


<br>
<br>
<br>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<script>
var regex = /\/Articles\/(.*?)\//g;

function change_color(element_id, color) {
    document.getElementById(element_id).style.color = color;
}

function add_time(element_id, time) {
    var elem = document.getElementById(element_id);
    elem.innerHTML = elem.innerHTML + " (" + Math.floor(time) + " ms)";
}

change_color('l1', 'orange');
var start_retrieve = performance.now();
$.getJSON('http://api.allorigins.win/get?url=' + encodeURIComponent('https://lwn.net/Security/Index') + '&callback=?', function(data){
    var end_retrieve = performance.now();
    change_color('l1', 'green');
    change_color('l2', 'orange');
    add_time('l1', end_retrieve - start_retrieve);

    start_retrieve = performance.now();    
    var lwn_content = data.contents;
    console.log(lwn_content);
    var matches = lwn_content.match(regex);
    end_retrieve = performance.now();    
    change_color('l2', 'green');
    change_color('l3', 'orange');
    add_time('l2', end_retrieve - start_retrieve);

    var rand_int = Math.floor((Math.random() * (matches.length - 1)) + 0);
    console.log(matches[rand_int]);
    change_color('l3', 'green');

    var button = document.getElementById('go');
    button.onclick = function() { window.open("https://lwn.net" + matches[rand_int] , '_blank'); };
    button.disabled = false;
    var loader = document.getElementById('loader');
    loader.parentNode.removeChild(loader);
});
</script>


