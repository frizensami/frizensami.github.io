---
title: "(Maybe) Tracking Singapore's Blood Stock Fluctuations"
layout: post
date: 2022-05-26 12:26
image: /assets/images/markdown.jpg
headerImage: false
tag:
    - redcross
    - bloodbank
    - data-analysis
    - scraping
star: true
published: true
category: blog
author: sriram
---

## TLDR

1. I wrote a Telegram bot to track Singapore's blood stock levels ([@sgbloodstocksbot](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"}). Users can subscribe to the bot to be notified about changes in their blood type's stock levels (or any changes at all).
1. The stock data from 14th June 2021 onwards (constantly updated with new data) is available [in this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"} in the ["Flat Data" format](https://next.github.com/projects/flat-data){:target="\_blank" rel="noopener"}.

{:refdef: style="text-align: center;"}

![Graph of Singapore Blood Stocks since June 2021](/assets/images/bloodstocks/bloodstocks-jun21-aug22.png){:height="auto"}

If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

-   [Disclaimers](#disclaimers)
-   [Why did I do this?](#why-did-i-do-this)
-   [Where do I get exact blood stock levels?](#where-do-i-get-exact-blood-stock-levels)
-   [Is this okay?](#is-this-okay)
-   [Overview of the data](#overview-of-the-data)
    -   [Downloading and plotting](#downloading-and-plotting)
    -   [Graph format and data frequency](#graph-format-and-data-frequency)
    -   [Some questions](#some-questions)
-   [Wrapping up](#wrapping-up)
-   [Resources](#resources)

<!-- markdown-toc end -->

## Disclaimers

-   This is all for personal curiosity and a side-effect of making a (hopefully) useful tool. I am not an expert in any related field.
-   I don't know if it's a good idea to donate blood only when blood stocks dip below 100%. None of this is advice.
-   While it's a strong hypothesis, there is no strict guarantee that the blood stock levels are accurate. Read [Where do you get exact blood stock levels?](#where-do-you-get-exact-blood-stock-levels) for more.

## Why did I do this?

I was looking to donate my blood sometime in April 2021. Each time I checked the [Singapore Red Cross website](https://redcross.sg/){:target="\_blank" rel="noopener"} (scroll down there to see blood stocks), my blood type was fully stocked. It didn't seem like the most useful time to donate, so I decided to wait.

The (happy) problem was, every time I checked for a while, my stock level was full. **When was the best time to donate?**.

I decided to make a Telegram bot [(try @sgbloodstocksbot here!)](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"} that scrapes data from the Red Cross website and pings me when my blood type's stocks change.

I then heard about [Datascape Singapore](https://github.com/datascapesg/){:target="\_blank" rel="noopener"}, a project to save Singapore-related data into ["Flat Data" files on GitHub](https://next.github.com/projects/flat-data){:target="\_blank" rel="noopener"}. I used the same code from the Telegram bot to scrape and **save the blood stock data daily**, from 14th June 2021 onward, into [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"} (see `blood-stocks.json` for the latest scraped data).

## Where do I get exact blood stock levels?

This is where the (maybe) comes from. There is no official API or data source that I am aware of, so scraping is the only option. The Red Cross reports blood stock levels like this on their website:

![Red Cross blood stock reporting](/assets/images/bloodstocks/redcross_stock.png){:height="auto"}

It seems like there are only four preset levels for each blood type: **Healthy/Moderate/Low/Critical**. That seemed fine at first. I could just report the broad category of blood stock level. However, if you look closer, you'll notice something curious.

|                                            A- Blood Type                                            |                                            O- Blood Type                                            |
| :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![Bloodstock picture for A- type](/assets/images/bloodstocks/bloodstock_aminus.png){:height="auto"} | ![Bloodstock picture for O- type](/assets/images/bloodstocks/bloodstock_ominus.png){:height="auto"} |

Two blood types, both reported as "Low", have different "fill levels" in the image. Specifically, the HTML representing each image was (note the `height` parameter):

```html
<!-- A- blood type -->
<div class="fill_humam" style="height: 45%; background: #ffc000;"></div>

<!-- 0- blood type -->
<div class="fill_humam" style="height: 35%; background: #ffc000;"></div>
```

So maybe there are more presets than expected (increments of 5% each time?). But if we look at the `height` parameters of some of the other blood level images:

```html
<!-- A+ blood type -->
<div class="fill_humam" style="height: 59%; background: #ffff00;"></div>

<!-- AB- blood type -->
<div class="fill_humam" style="height: 18%; background: #ff0000;"></div>
```

These blood stock levels seem to be **updated to a precision of 1%**. One last piece of evidence:

![Bloodstock update on Telegram](/assets/images/bloodstocks/telegram_update.png){:height="auto"}

[@sgbloodstocksbot](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"} pings all subscribers when blood stock levels change (you can watch for a specific blood type or any of them). Notice that the O+ blood type changes only by 1%. Visually, no website user will see a 1% change in the image fill level, so this must be some semi-automated and precise process.

**TLDR: I hypothesize that the image fill levels are accurate and precise blood stock levels**.

### Is this okay?

I get asked sometimes if the blood stock levels are sensitive information and whether I should be publicly broadcasting them. In my view, if the stock levels are accurate, and are already publicly updated by the Red Cross to within 1% (even if it's encoded within an image), then I'm just using public data. My only intention is to create a useful service to know when to donate blood.

## Overview of the data

### Downloading and plotting

The blood stock data is stored in [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"}, but each update is a separate [git commit](https://www.atlassian.com/git/tutorials/saving-changes/git-commit){:target="\_blank" rel="noopener"}. We first have to download all versions of `blood-stocks.json` across all commits. The code to download and analyze the most up-to-date data is [here](https://github.com/frizensami/bloodstock_analysis){:target="\_blank" rel="noopener"}, feel free to give it a go!

{:refdef: style="text-align: center;"}
![Graph of Singapore Blood Stocks](/assets/images/bloodstocks/bloodstocks-jun21-aug22.png){:height="auto"}
If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

### Graph format and data frequency

-   The **x-axis** represents **time**.

-   The **y-axis** represents the **reported blood stock level**, from 0% to 100%. In this observation period, the stocks never hit 0%, but a few blood types spent a significant amount of time at 100%.

    -   One thing we don't know if 100% represents the same number of units of blood for every blood type. Since the demand for blood varies across blood types, maybe the target 100% amount is different for each?

-   **Each dot** on each line represents **one observation**.
    -   Notice that the dots are not evenly spaced. The blood stocks only **update on weekdays**! They also don't seem to update on public holidays. For instance, 4th November 2021, Thursday, the day of Deepavali, is missing. This probably points to a human-in-the-loop system.

### Some questions

Disclaimer again that I'm not an expert. The Red Cross has [facts and figures here](https://www.hsa.gov.sg/blood-donation/blood-facts-and-figures){:target="\_blank" rel="noopener"} and an infographic of 2021 blood usage [here](https://www-hsa-gov-sg-admin.cwp.sg/docs/default-source/bsg/big-blood-picture-2021.pdf){:target="\_blank" rel="noopener"}.

These are just some layman questions:

-   Is blood demand / supply seasonal? How best can we understand these trends?
-   What changed in Mid-Oct 2021 to lower positive-type blood supply so much?
-   What happened to B- stock in Nov 2021?
-   How much do blood drives affect stock levels?
-   and many others

Please feel free to download and analyze this data as well.

## Wrapping up

This data is all a side effect of [@sgbloodstocksbot](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"}, so hopefully both the data and bot turn out to be useful. Please feel free to drop me a message if you're interested in anything related to this :)

## Resources

-   [Singapore Blood Stocks Bot on Telegram](https://t.me/sgbloodstocksbot), code is [here](https://github.com/frizensami/sg-blood-stocks-bot)
-   [Scraper for blood stocks on Datascape SG](https://github.com/datascapesg/scrapers/blob/develop/netlify/functions/redcross-bloodstocks.js)
-   [All blood stock data (Github Flat Data format)](https://github.com/datascapesg/red-cross-blood-stocks)
-   [Bloodstock analysis scripts used for this post](https://github.com/frizensami/bloodstock_analysis)
