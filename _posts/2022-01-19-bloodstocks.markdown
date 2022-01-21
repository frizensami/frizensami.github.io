---
title: "I Don't Understand Singapore's Blood Supply Fluctuations"
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
published: true
category: blog
author: sriram
description:
---

**I collected the following data over more than 200 days. I don't fully understand the trends below, and I'd love opinions from better-informed people.**{: style="color: red;" }

{:refdef: style="text-align: center;"}

![Graph of Singapore Blood Stocks over 219 days](/assets/images/bloodstocks/bloodstocks.png){:height="auto"}

If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

-   [Disclaimers](#disclaimers)
-   [Context](#context)
    -   [Why did I do this?](#why-did-i-do-this)
    -   [Where do you get exact blood stock levels?](#where-do-you-get-exact-blood-stock-levels)
-   [Analyzing the data](#analyzing-the-data)
    -   [Pre-processing](#pre-processing)
    -   [Graph format and data frequency](#graph-format-and-data-frequency)
    -   [Possible interplay of factors from existing research](#possible-interplay-of-factors-from-existing-research)
    -   [Observations](#observations)
        -   [AB blood types stocks are lower than the rest](#ab-blood-types-stocks-are-lower-than-the-rest)
        -   [Negative blood types are harder to keep fully stocked](#negative-blood-types-are-harder-to-keep-fully-stocked)
    -   [Questions without answers](#questions-without-answers)
-   [Wrapping up](#wrapping-up)
-   [Resources](#resources)

<!-- markdown-toc end -->

## Disclaimers

-   This is all for personal curiosity and a side-effect of making a (hopefully) useful tool.
-   I don't know if it's a good idea to donate blood only when blood stocks dip below 100%. None of this is advice.
-   I'm not an expert in any related field.
-   While it's a strong hypothesis, I make no guarantees that the blood stock levels are accurate. Read [Where do you get exact blood stock levels?](#where-do-you-get-exact-blood-stock-levels) for more.

## Context

### Why did I do this?

I was looking to donate my blood sometime in April 2021. When I checked the [Singapore Red Cross website](https://redcross.sg/){:target="\_blank" rel="noopener"} (scroll down there to see blood stocks), my blood type's **stocks always looked completely full**. It didn't seem like the most useful time to donate, so I decided to wait.

The (happy) problem was, every time I checked for a while, my stock level was full. When was the best time to donate?

I decided to make a **Telegram bot** [(try @sgbloodstocksbot here!)](https://t.me/sgbloodstocksbot){:target="\_blank" rel="noopener"} that scrapes data from the Red Cross website and pings me when my blood type's stocks change.

I then heard about [Datascape Singapore](https://github.com/datascapesg/){:target="\_blank" rel="noopener"}, a project to save Singapore-related data into ["Flat Data" files on GitHub](https://next.github.com/projects/flat-data){:target="\_blank" rel="noopener"}. I used the same code from the Telegram bot to scrape and **save the blood stock data daily**, from 14th June 2021 onward, into [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"} (see `blood-stocks.json` for the latest scraped data).

Thanks to this strange sequence of events, I have more than 200 days of blood stock data that we can look at.

### Where do you get exact blood stock levels?

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

**TLDR: I hypothesize that the image fill levels are accurate and precise blood stock levels**.

## Analyzing the data

### Pre-processing

The blood stock data is stored in [this repository](https://github.com/datascapesg/red-cross-blood-stocks){:target="\_blank" rel="noopener"}, but each update is a separate [git commit](https://www.atlassian.com/git/tutorials/saving-changes/git-commit){:target="\_blank" rel="noopener"}. We first have to download all versions of `blood-stocks.json` across all commits. The code to download and analyze the most up-to-date data is [here](https://github.com/frizensami/bloodstock_analysis){:target="\_blank" rel="noopener"}, feel free to give it a go!

**You can also download just the data from 14th June 2021 to 19th January 2022 [here](https://github.com/frizensami/frizensami.github.io/releases/download/v0.1/data.zip)**.

{:refdef: style="text-align: center;"}
![Graph of Singapore Blood Stocks over 219 days](/assets/images/bloodstocks/bloodstocks.png){:height="auto"}
If you're on mobile, you can press and hold on this image and open it in a new tab.
{: refdef}

### Graph format and data frequency

-   The **x-axis** represents **time**, starting on 14th June 2021 and ending on 19th January 2021.

-   The **y-axis** represents the **reported blood stock level**, from 0% to 100%. In this observation period, the stocks never hit 0%, but a few blood types spent a significant amount of time at 100%.

-   **Each dot** on each line represents **one observation**.
    -   Notice that the dots are not evenly spaced. The blood stocks only **update on weekdays**! They also don't seem to update on public holidays. For instance, 4th November 2021, Thursday, the day of Deepavali, is missing. This probably points to a human-in-the-loop system.

### Possible interplay of factors from existing research

<style>
table, td, th {
        border: 1px solid black;
        }
</style>

| Factor                                                                                                                   | Effect                                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Frequency of blood type in population (1% has A- compared to 40% with O+)                                                | Higher supply of O-type blood than AB type blood, for e.g.                    |
| O- blood can be given to anyone and is often used in emergencies when blood typing can't be done fast enough             | Demand for O- blood is high.                                                  |
| Type AB plasma can be transfused to patients of all blood types AND only a small fraction of the population has AB blood | Demand for AB plasma is high.                                                 |
| Red blood cells must be used within 42 days                                                                              | When supply and demand slows down, older blood donations can start to expire. |
| Platelets must be used within 5 days                                                                                     | When supply and demand slows down, older blood donations can start to expire. |

### Observations

#### AB blood types stocks are lower than the rest

Two possible factors: (1) AB blood types only make up ~4% of the population, and (2) AB type plasma is "universal donor" plasma i.e., everyone can accept it.

#### Negative blood types are harder to keep fully stocked

Negative blood types are less common in the population and can donate to more people (e.g., A+ can give to A+, AB+ but A- can give to A-, A+, AB-, AB+).

### Questions without answers

**What does the blood stock level actually represent?**

Is this to do with red blood cells? Plasma?

**What does "100%" blood stock level represent?**

Does 100% represent the same amount of stored blood for all blood types? Is it some demand-corrected amount?

**Why do the positive blood types' stock level decrease significantly from mid-October 2021?**

Is this COVID related? Is it a supply (not enough people donating) or demand (too much blood requested) problem?

**Why does the B- blood stock level decrease significantly from mid-November 2021?**

This seems pretty random.

**Does blood demand or blood supply fluctuate more?**

i.e., are the fluctuations mostly to do with large variances in the number of people donating blood?

**How can we model blood stocks as a function of time?**

Is this even in the right ballpark or useful?

```
blood_stock_level(blood_type, day) =
    blood_stock_level(blood_type, day - 1)
        + blood_donations(blood_type, day)
        - blood_demand(blood_type, day)
        - blood_expiry(blood_type, day)
```

**What are the effects of blood donation drives? Which ones are most useful?**

Blood donation drives are conducted frequently. It would be interesting to overlay them with their impact on overall blood stocks.

## Wrapping up

This data raises more questions than it answers, but hopefully these are interesting questions. I'm not qualified to answer them, but maybe others are!

All this data was generated as a side-effect of [@sgbloodstocksbot](https://t.me/sgbloodstocksbot), so hopefully that turns out to be a useful tool.

## Resources

-   [Singapore Blood Stocks Bot on Telegram](https://t.me/sgbloodstocksbot)
-   [Scraper for blood stocks on Datascape SG](https://github.com/datascapesg/scrapers/blob/develop/netlify/functions/redcross-bloodstocks.js)
-   [All blood stock data (Github Flat Data format)](https://github.com/datascapesg/red-cross-blood-stocks)
-   [Download data from 14th June 2021 to 19th January 2022 (zip of .json files)](https://github.com/frizensami/frizensami.github.io/releases/download/v0.1/data.zip)
-   [Bloodstock analysis scripts used for this post](https://github.com/frizensami/bloodstock_analysis)
