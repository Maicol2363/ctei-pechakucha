---
theme: default
layout: default
title: Municipal food insecurity
author: Maycol Estiven Fonseca Muñoz
favicon: ./assets/cundinamarca.png
aspectRatio: 16/9
canvasWidth: 1280
routerMode: hash
colorSchema: light
fonts:
  provider: none
transition: grid-shift
presenter: true
drawings:
  enabled: false
---

# Municipal food insecurity

<DeckSlide :number="1" />

<!--
A departmental average can hide the picture in a single municipality. I'm Maycol Estiven Fonseca Muñoz. My research question is this. In studies of municipal food insecurity, which criteria guide the selection of predictive models to obtain accurate and interpretable predictions?

End on the pulsing grey cell: that is Gachetá, which slide 3 returns to. Open on one department-wide shape. When you say “a single municipality,” let it resolve into 116 outlines, then light up DANE’s 2022 estimates in a diagonal wave. Pause before the research question.

Approved question
DANE 2022 municipal bulletin, Figure 20 (https://www.dane.gov.co/files/operaciones/FIES/bol-FIES-Municipal-2022.pdf)
DANE annex, Cuadro 1 (https://www.dane.gov.co/files/operaciones/FIES/anex-FIES-Municipal-2022.xlsx)
Boundaries: DANE 2020 via geoBoundaries, CC BY 4.0 (https://www.geoboundaries.org/api/current/gbOpen/COL/ADM2/)
DANE annex, Cuadro 1 (https://www.dane.gov.co/files/operaciones/FIES/anex-FIES-Municipal-2022.xlsx)
Boundaries: DANE 2020 via geoBoundaries, CC BY 4.0 (https://www.geoboundaries.org/api/current/gbOpen/COL/ADM2/)
-->

---

# Studies predict different things

<DeckSlide :number="2" />

<!--
Gubert and colleagues estimated severe food insecurity in Brazilian municipalities. Busker and colleagues forecast food crises in the Horn of Africa. Those studies predict different outcomes on different time scales. That makes it difficult to use their reported performance to choose a model for Cundinamarca.

Brazil’s dot field shows the 5,507 municipalities in Gubert et al. The Horn of Africa outlines show the 213 units forecast up to 12 months ahead in Busker et al. Point to the difference between estimating a period and forecasting what comes next.

Gubert et al. (https://doi.org/10.37527/2010.60.2.002)
Busker et al. (https://doi.org/10.1029/2023EF004211)
-->

---

# Local estimates need quality checks

<DeckSlide :number="3" />

<!--
Colombia's national statistics office, DANE, uses statistical models where survey samples are too small for reliable direct estimates. In its municipal bulletin for 2022, DANE flagged Gachetá's estimate for high uncertainty. That example shows why checking a local estimate's quality matters.

Build the survey-to-estimate chain, then show Gachetá on the map and in its square with the quality flag. The 30% threshold concerns the uncertainty measure, the logarithmic coefficient of variation. Keep the flagged prevalence off the slide.

DANE 2022 municipal bulletin, Table 26 (https://www.dane.gov.co/files/operaciones/FIES/bol-FIES-Municipal-2022.pdf)
Gachetá photo, Click1master, CC BY 4.0 (https://commons.wikimedia.org/wiki/File:Gacheta_2024.jpg)
-->

---

# Establish criteria for model selection

<DeckSlide :number="4" />

<!--
My objective is to establish criteria to guide the selection of predictive models of food insecurity at the municipal level. The aim is to give researchers a way to explain why a model deserves to be tested for a particular local use.

Emphasize why a model deserves testing.

Approved objectives
-->

---

# Three steps toward the guide

<DeckSlide :number="5" />

<!--
First, to identify predictive models used in studies of food insecurity at the municipal level. Second, to analyze model-selection criteria related to data characteristics, performance, and interpretability. Third, to integrate the identified criteria into a model-selection guide for the municipal context of Cundinamarca.

Use three short labels on screen. Identify models. Analyze criteria. Build the guide.

Approved objectives
-->

---

# What the review compares

<DeckSlide :number="6" />

<!--
I've appraised ten full-text papers in a literature matrix. I recorded what they predict, which data they use, and how they test and explain their models. I distinguish municipal applications from studies at other scales that can help inform the choice of methods.

Ten appraisals land as rows, then the three criteria fill in as columns. Show ten appraisals as work to date and the difference between direct and supplementary evidence.

RAE working workbook
-->

---

# The baseline can change the choice

<DeckSlide :number="7" />

<!--
Foini and colleagues forecast insufficient food consumption. Their model beat the last observed value at longer horizons in Yemen and Syria. That simple baseline did better in the other four countries they studied. Model choice depends on evidence from the conditions where it will be used.

Syria and Yemen flip to “forecast led,” then the four other countries (Burkina Faso, Cameroon, Mali, Nigeria) flip to “baseline led.” Explain the baseline through the phrase “last observation.” The outcome is insufficient food consumption. Use the result to motivate local evaluation.

Foini et al., results and Figure 3 (https://doi.org/10.1038/s41598-023-29700-y)
-->

---

# Learning, Knowledge, Technologies, Communication and Digitalization

<DeckSlide :number="8" />

<!--
I place this study under the university's research line on Learning, Knowledge, Technologies, Communication and Digitalization. It fits that line because I examine how models turn data into evidence and what researchers should check before relying on the results.

Keep the English line name legible and retain the official Spanish name in the source notes.

Official research line · Aprendizaje, conocimiento, tecnologías, comunicación y digitalización.

University research lines (https://www.ucundinamarca.edu.co/investigacion/index.php/lineas-de-investigacion)
-->

---

# Software, Emerging Systems and New Technologies

<DeckSlide :number="9" />

<!--
The complementary Engineering line is Software, Emerging Systems and New Technologies. A later system will need to record which data a model uses and which version produced an estimate. The review can help define what should be documented when selecting models for that system.

Show how the selection record connects to a future software requirement.

Official name as listed by the faculty · Software, sistema emergentes y nuevas tecnologías.

Engineering complementary lines (https://www.ucundinamarca.edu.co/investigacion/media/attachments/2022/10/19/facultad-de-ingeniera.pdf)
Thesis proposal
-->

---

# From the study to the thesis

<DeckSlide :number="10" />

<!--
These lines come together in my larger thesis, which proposes a platform to integrate public data and deploy versioned models. This semester focuses on the decision that comes before deployment. The guide would help my thesis team shortlist models and plan how to test them locally.

Let the candidate models narrow to a shortlist, then pass one versioned model to deployment. Give the literature guide and platform separate labels. Shortlisting is the proposed first use of the guide.

Approved objectives
Thesis proposal
-->

---

# Zero Hunger

<DeckSlide :number="11" />

<!--
This research connects to Sustainable Development Goal Two, Zero Hunger. Its first target includes access to safe, nutritious and sufficient food. One indicator tracks moderate or severe food insecurity using the Food Insecurity Experience Scale. That gives the monitoring problem a direct connection to the goal.

Show the official English icon with Target 2.1 and Indicator 2.1.2, beside a market in Cachipay as a local example of food access.

The United Nations did not approve this presentation. Its contents do not reflect the views of the United Nations, its officials or its Member States.

UN indicator metadata (https://unstats.un.org/sdgs/metadata?Target=2.1)
UN icon (https://www.un.org/sustainabledevelopment/news/communications-material/)
Cachipay market photo, Jairud, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Plaza_mercado_cachipay-cundinamarca.jpg)
-->

---

# Better evidence for monitoring

<DeckSlide :number="12" />

<!--
The contribution is to monitoring. A selection guide would help researchers decide what evidence a model needs before its estimates inform local planning. If later testing supports those estimates, planning teams could use them alongside other evidence when deciding where to investigate needs.

Trace guide, local validation and potential monitoring use in order.

Approved objectives
DANE municipal methodology and viewer (https://sitios.dane.gov.co/EstimacionesModeloSAE/)
-->

---

# Participation analysis

<DeckSlide :number="13" />

<!--
I conduct the review with academic guidance, using studies and documentation from researchers and DANE. The academic work needs a traceable review. Future municipal users would need clear estimates and limitations. Residents could benefit indirectly if that evidence helps planning teams understand local needs.

Distinguish current academic roles, sources, potential users and indirect beneficiaries. Interests and expectations in the map are inferred.

Logical framework, actor analysis
-->

---

# Problem tree

<DeckSlide :number="14" />

<!--
At the center of the problem tree is the difficulty of justifying a model choice. Its roots are differences in study targets, data and evaluation, plus uncertainty about local fit. The main risk is choosing a model whose reported performance gives us little guidance for Cundinamarca.

Start at the trunk. Read one link from the roots to the branches.

Logical framework, problem tree
-->

---

# Objective tree

<DeckSlide :number="15" />

<!--
The objective tree turns those difficulties into three steps. I screen studies to build a model inventory. I appraise their methods to assemble a criteria matrix. I assess which criteria apply to Cundinamarca and use them to build the guide.

Show representative activities in the roots, objectives in the middle and planned products in the branches.

Logical framework
-->

---

# Alternatives analysis

<DeckSlide :number="16" />

<!--
An inventory would tell us which models have been used. A local benchmark could test their performance but would require suitable data. I chose a criteria-based literature synthesis because it answers the semester question and can show what that later benchmark should test.

Compare the approaches by what they answer and what they require. The literature synthesis is the selected semester approach.

Approved question and objectives
Project scope
-->

---

# What the study will produce

<DeckSlide :number="17" />

<!--
I expect a model inventory, a matrix linking criteria to studies, and a practical selection guide. One candidate criterion is to check the uncertainty of a municipal prevalence estimate before using it. The synthesis will show where each criterion applies.

The last cue shows one example guide entry: DANE’s 30% uncertainty threshold turns the estimate into a flag. Present the three as expected research outputs. The uncertainty check illustrates one possible entry in the guide.

Logical framework
DANE municipal bulletin, Table 26 (https://www.dane.gov.co/files/operaciones/FIES/bol-FIES-Municipal-2022.pdf)
-->

---

# Where should planners look more closely?

<DeckSlide :number="18" />

<!--
For Cundinamarca, imagine a planning team deciding where to look more closely. A locally tested model could help flag municipalities for further assessment, with uncertainty visible. The guide would give the thesis team a starting point for choosing which model to test for that use.

Frame the planning team as a possible later user and the example as a possible application. The map is illustrative and shows no results.

Logical framework, actor analysis
Thesis proposal
-->

---

# Model fit depends on the intended use

<DeckSlide :number="19" />

<!--
The evidence I've reviewed points to a practical conclusion. The outcome and available data determine which tests are meaningful. The quality of those tests, together with explanations of the predictions, gives us a basis for judging whether a model fits its intended use.

Let the three questions merge into one “intended use” hub. Return to the study's three selection dimensions.

Problem statement
RAE working workbook
-->

---

# Before using a municipal prediction

<DeckSlide :number="20" />

<!--
Before relying on a municipal prediction, ask what it measures, how it was tested, and how to interpret it. Those questions can guide the next model we evaluate for Cundinamarca and make the evidence easier to use in work toward Zero Hunger.

Light the map one question at a time. Gachetá lights last. Show the official Goal 2 icon again. Leave room for a short final pause before the run ends at 6:40.

The United Nations did not approve this presentation. Its contents do not reflect the views of the United Nations, its officials or its Member States.

UN Goal 2 (https://sdgs.un.org/goals/goal2)
-->
