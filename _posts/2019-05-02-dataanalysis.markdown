---
title: "Computer Aided Data Analysis: A Conceptual Overview"
layout: post
date: 2019-05-02 10:00
image: /assets/images/markdown.jpg
headerImage: false
star: false
category: blog
author: sriram
description: "Computer Aided Data Analysis: A Conceptual Overview"
---
<style>
table {
  padding: 0; 
  border-collapse: collapse;
  border-spacing: 0px; }
  table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0; }
    table tr:nth-child(2n) {
      background-color: #f8f8f8; }
    table tr th {
      font-weight: bold;
      border: 1px solid #cccccc;
      text-align: left;
      margin: 0;
      padding: 6px 13px;
    }
    table tr td {
      border: 1px solid #cccccc;
      text-align: left;
      margin: 0;
      padding: 6px 13px; }
    table tr th :first-child, table tr td :first-child {
      margin-top: 0; }
    table tr th :last-child, table tr td :last-child {
      margin-bottom: 0; }
</style>
<!-- TOC depthFrom:2 -->

- [1. Motivation](#1-motivation)
- [2. Checking One Group (and intro to Hypothesis Testing)](#2-checking-one-group-and-intro-to-hypothesis-testing)
    - [2.1. One-sample tests](#21-one-sample-tests)
        - [2.1.1. Values are normally distributed](#211-values-are-normally-distributed)
        - [2.1.2. Values are not normally distributed / unknown distribution](#212-values-are-not-normally-distributed--unknown-distribution)
- [3. Comparing Two Groups (Two-sample tests)](#3-comparing-two-groups-two-sample-tests)
    - [3.1. Groups are independant of each other](#31-groups-are-independant-of-each-other)
        - [3.1.1. Values are normally distributed](#311-values-are-normally-distributed)
        - [3.1.2. Values are not normally distributed / unknown distribution / ordered categories](#312-values-are-not-normally-distributed--unknown-distribution--ordered-categories)
    - [3.2. Groups are dependent on each other](#32-groups-are-dependent-on-each-other)
        - [3.2.1. Values are normally distributed](#321-values-are-normally-distributed)
        - [3.2.2. Values are not normally distributed / unknown distribution](#322-values-are-not-normally-distributed--unknown-distribution)
- [4. Comparing Multiple Groups (> 2)](#4-comparing-multiple-groups--2)
    - [4.1. Pre-requisite for ANOVA tests: do all groups have equal variances?](#41-pre-requisite-for-anova-tests-do-all-groups-have-equal-variances)
    - [4.2. Pre-requisite for ANOVA tests: are all errors independant and normally distributed?](#42-pre-requisite-for-anova-tests-are-all-errors-independant-and-normally-distributed)
    - [4.3. One-Way ANOVA: Equal Variances over data, Normal Distribution of errors](#43-one-way-anova-equal-variances-over-data-normal-distribution-of-errors)
        - [4.3.1. After running ANOVA: Least Significant Difference Test (Post-Hoc)](#431-after-running-anova-least-significant-difference-test-post-hoc)
        - [4.3.2. After running ANOVA: Contrast Analysis](#432-after-running-anova-contrast-analysis)
    - [4.4. If cannot run ANOVA (assumptions failed)](#44-if-cannot-run-anova-assumptions-failed)
    - [4.5. Concepts behind the ANOVA model](#45-concepts-behind-the-anova-model)
- [5. Displaying Data](#5-displaying-data)

<!-- /TOC -->


## 1. Motivation
This is a conceptual overview of the ideas covered in NUS's ST2137: Computer Aided Data Analysis. It is meant to give me a standard starting point when I next encouter a non-trivial data set that requires analysis.  

## 2. Checking One Group (and intro to Hypothesis Testing)
We have some data, and we want to test something about a particular property of the data sample. Usually, this is the **mean** value of something in the sample.

### 2.1. One-sample tests
These data samples are continually distributed and have a single dimension. Think: 

Height (m) |
--- |
1.7 |
1.65 |
1.76 |
2.01 |
1.55 |
... |

Usually, we want to test one of three things about the **mean** value of the data.
- Is the mean equal to some value? `(mu = mu0)`?
- Is the mean more than some value? `(mu > mu0)`?
- Is the mean less than some value? `(mu < mu0)`?

Before deciding on a test, we need to have information about the underlying **distribution** of the values.

#### 2.1.1. Values are normally distributed
If the population that this sample is extracted from follows a **normal** distribution, we can use
- The **One-Sample T-Test**

#### 2.1.2. Values are not normally distributed / unknown distribution 
We don't know or assume anything about the underlying distribution. We can then use: 
- The **Sign Test**
- The **Wilcoxon Signed-Rank Test**

## 3. Comparing Two Groups (Two-sample tests)
Instead of a single sample, we have two samples that may or may not be dependent on each other. 
### 3.1. Groups are independant of each other
Think:

Control group: Lifetime change in Height without Drug(TM) | Treatment Group: Lifetime change in Height with Drug(TM)
--- | --- |
1.7 | 1.66 |
1.65 | 1.67 |
1.76 | 1.77 |
2.01 | 1.99 |
1.55 | 1.99 |
... | ... |


Here, the control group and the treatment group are independent of each other (as long as the experiment is controlled correctly). 

We want to check if the **the mean values of both groups are equal**.

#### 3.1.1. Values are normally distributed
Use
- **Two Sample T-Test**
  - If the **variances are equal** (use the F-test to determine this!): this is the standard situation that uses the **pooled variance** to estimate the degrees of freedom for the test.
  - If the **variances are different** (use the F-test to determine this!): use the **Welch Two Sample T-Test** (uses the "Welch estimate" of the degrees of freedom is used)

#### 3.1.2. Values are not normally distributed / unknown distribution / ordered categories
Use 
- **Wilcoxon Rank-Sum Test** (also called Mann-Whitney U-test)

### 3.2. Groups are dependent on each other

Height before treatment | Height after treatment
--- | --- |
1.7 | 1.66 |
1.65 | 1.67 |
1.76 | 1.77 |
2.01 | 1.99 |
1.55 | 1.99 |
... | ... |

Here, we have a list of **pairs** of samples: each row represents a single person before and after a treatment, so the two values are related and dependent on each other. We can similarly test the mean values between the pairs. 


#### 3.2.1. Values are normally distributed
Use
- **Paired T-Test**

#### 3.2.2. Values are not normally distributed / unknown distribution 
Use
- **Sign Test**
- **Wilcoxon Signed-Rank Test**

## 4. Comparing Multiple Groups (> 2)
We want to check if the means of **many** groups are **all equal to each other** (alternate hypothesis, one of the groups has a different mean as compared to some other group). We could do this by running many pair-wise T-tests, but this increases the **family-wise error rate** as we do more and more tests. This means we have a higher and higher chance of getting a false result as we run many more separate tests. 

### 4.1. Pre-requisite for ANOVA tests: do all groups have equal variances?
Can use either of
- **Bartlett Test**
- **Levene's Test**

### 4.2. Pre-requisite for ANOVA tests: are all errors independant and normally distributed?
The concept of a **residual**: the **difference** between the **observed value** of the variable and the **predicted value**. Here, the **observed value** would be the data itself, and the **predicted value** would be the normal distribution.

To check this condition:  
- A normality test on the residuals (**Kolmogorov-Smirnov Test**), or
- Do residul plots (**QQPlot on residuals** OR **plot the residuals against the groups**)

### 4.3. One-Way ANOVA: Equal Variances over data, Normal Distribution of errors 
Requirements
- Data in each group is normally distributed
- Population variance in each group is equal
- Independance of observations (depends on how the study was run)

Note: the ANOVA test is robust against non-normal data (with skew / kurtosis), but has an increase in error rate.

#### 4.3.1. After running ANOVA: Least Significant Difference Test (Post-Hoc)
If the ANOVA test **finds differences between groups** - it cannot tell which groups had the difference. A **post-hoc** test is required to find this out. 

There is a formula to calculate the **Least Significant Difference value** between two groups i and j. We then check if the **absolute difference in means between groups i and j exceeds the LSD value**. If so, those two groups are different. 

Other tests of the same nature
- Duncan’s multiple-range test
- Student-Newman-Keul’s multiple-range test
- Scheffe's multiple-comparison procedure

#### 4.3.2. After running ANOVA: Contrast Analysis
Similarly to the LSD, we want to check which groups are different from each other (given that the ANOVA has shown that at least one pair is different from each other). **Contrasts** allow us to 

A **contrast** is a **linear combination of the variables** such that **all the coefficients add up to 0**. This is potentially able to check questions like **Is (mean of X) different from (mean of Y AND Z together)**. Examples:
- 0mu_x - 1mu_y + 1mu_z (check if Y and Z are different)
- 2mu_x - 1mu_y - 1mu_z  (check if x is different from y AND z)

### 4.4. If cannot run ANOVA (assumptions failed)
Use a **non-parametric** one-way test
- **Kruskal-Wallis** test

### 4.5. Concepts behind the ANOVA model
(TODO): Sum of squares, MSE, DF...

## 5. Displaying Data