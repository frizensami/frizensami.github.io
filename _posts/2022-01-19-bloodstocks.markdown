---
title: "Understanding Singapore's Blood Supply Fluctuations"
layout: post
date: 2022-01-19 12:26
image: /assets/images/markdown.jpg
headerImage: false
tag:
    - redcross
    - bloodbank
    - data-analysis
    - scraping
star: true
published: false
category: blog
author: sriram
description:
---

{:refdef: style="text-align: center;"}
![Graph of Singapore Blood Stocks over 219 days](/assets/images/bloodstocks/bloodstocks.png){:height="auto"}

If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

-   [Disclaimers](#disclaimers)
-   [Context](#context)
-   [Why did I do this?](#why-did-i-do-this)
-   [How did I get the exact blood stock levels?](#how-did-i-get-the-exact-blood-stock-levels)
-   [Analyzing the data](#analyzing-the-data)
-   [Resources](#resources)

<!-- markdown-toc end -->

## Disclaimers

-   This is all for personal curiosity and to make a (hopefully) useful tool.
-   I don't know if it's a good idea to donate blood only when blood stocks dip below 100%. None of this is advice.
-   I'm not an expert in any related field.
-   While it's a strong hypothesis, I make no guarantees that the blood stock levels are accurate. Read [How did I get the exact blood stock levels?](#how-did-i-get-the-exact-blood-stock-levels) for more.

## Context

If you just want to look at the data, skip to [Analyzing the data](#analyzing-the-data)

### Why did I do this?

I was looking to donate my blood sometime in April 2021. When I checked the [Singapore Red Cross website](https://redcross.sg/){:target="\_blank" rel="noopener"} (scroll down there to see blood stocks), my blood type's **stocks always looked completely full**. It didn't seem like the most useful time to donate, so I decided to wait.

The (happy) problem was, every time I checked for a while, my stock level was full. When was the best time to donate?

I decided to make a **Telegram bot** [(try @sgbloodstocksbot here!)](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"} that scrapes data from the Red Cross website and pings me when my blood type's stocks change.

I then heard about [Datascape Singapore](https://github.com/datascapesg/){:target="\_blank" rel="noopener"}, a project to save Singapore-related data into ["Flat Data" files on GitHub](https://next.github.com/projects/flat-data){:target="\_blank" rel="noopener"}. I used the same code from the Telegram bot to scrape and **save the blood stock data daily**, from April 14th 2021 onward, into [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"} (see `blood-stocks.json` for the latest scraped data).

Thanks to this strange sequence of events, I have more than 200 days of blood stock data that we can look at.

### How did I get the exact blood stock levels?

This is where it gets somewhat speculative. The Red Cross reports blood stock levels like this:

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

**TLDR: I hypothesize that the image fill levels reported by the Red Cross are accurate and precise blood stock levels**.

## Analyzing the data

### Pre-processing

The blood stock data is stored in [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"}, but each update is a separate [git commit](https://www.atlassian.com/git/tutorials/saving-changes/git-commit){:target="\_blank" rel="noopener"}. We first have to download all versions of `blood-stocks.json` across all commits. The code to download and analyze the data is [here](https://github.com/frizensami/bloodstock_analysis){:target="\_blank" rel="noopener"}, feel free to give it a go!

{:refdef: style="text-align: center;"}
![Graph of Singapore Blood Stocks over 219 days](/assets/images/bloodstocks/bloodstocks.png){:height="auto"}
If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

### Graph format and data frequency

-   The **x-axis** represents **time**, starting on 14th August 2021 and ending on 19th January 2021.
    -   As more time passes, more data will be available.
-   The **y-axis** represents the **reported blood stock level**, from 0% to 100%. In this observation period, the stocks never hit 0%, but a few blood types spent a significant amount of time at 100%.
    -   We have to assume that 100% stock level represents the same amount of blood for all blood types, or some supply-and-demand-corrected amount.
-   **Each dot** on each line represents **one observation**.
    -   Notice that the dots are not evenly spaced. The blood stocks only **update on weekdays**! They also don't seem to update on public holidays. For instance, 4th November, Thursday, the day of Deepavali, is missing. This probably points to a human-in-the-loop system.

### Possible interplay of factors from existing research

<style>
table, td, th {
        border: 1px solid black;
        }
</style>

| Factor                                                                                                                   | Effect                                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Frequency of blood type in population (1% has A- compared to 40% with O+)                                                | Higher supply of O-type blood than AB type blood, for e.g.                    |
| O- blood can be given to anyone and is often used in emergencies when blood typing can't be done fast enough             | O- blood is usually in short supply                                           |
| Type AB plasma can be transfused to patients of all blood types AND only a small fraction of the population has AB blood | AB plasma is usually in short supply.                                         |
| Red blood cells must be used within 42 days                                                                              | When supply and demand slows down, older blood donations can start to expire. |
| Platelets must be used within 5 days                                                                                     | When supply and demand slows down, older blood donations can start to expire. |

### Observations

#### AB blood types stocks are lower than the rest

Two possible factors: (1) AB blood types only make up ~4% of the populations, and (2) AB type plasma is "universal donor" plasma i.e., everyone can accept it.

#### Negative blood types are harder to keep fully stocked

Negative blood types are less common in the population and can donate to more people (e.g., A+ can give to A+, AB+ but A- can give to A-, A+, AB-, AB+).

## Resources

-   [Singapore Blood Stocks Bot on Telegram](https://t.me/sgbloodstocksbot])
-   [Scraper for blood stocks on Datascape SG](https://github.com/datascapesg/scrapers/blob/develop/netlify/functions/redcross-bloodstocks.js)
-   [All blood stock data since April 14th 2021 (Github Flat Data format)](https://github.com/datascapesg/red-cross-blood-stocks)
