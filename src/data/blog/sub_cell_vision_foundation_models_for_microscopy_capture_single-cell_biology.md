---
author: Sat Naing
pubDatetime: 2022-12-28T04:59:04.866Z
modDatetime: 2025-03-12T13:39:20.763Z
title: SubCell Vision foundation models for microscopy capture single-cell biology
slug: sub_cell_vision_foundation_models_for_microscopy_capture_single-cell_biology
featured: false
draft: false
tags:
  - docs
  - release
description: New feature in AstroPaper v1.4.0, introducing dynamic OG image generation for blog posts.
---



## Table of contents



## Contesto e obiettivi

Le cellule sono unità fondamentali della vita e organizzano le proprie funzioni attraverso un’architettura subcellulare complessa. Osservare queste strutture richiede strumenti di microscopia a fluorescenza, e interpretarle a grande scala richiede modelli di apprendimento automatico capaci di cogliere sia le morfologie cellulari sia la localizzazione delle proteine. 

I metodi supervisionati precedenti hanno mostrato buone prestazioni in compiti specifici, ma poca trasferibilità. Approcci auto-supervisionati come DINO4Cells hanno migliorato la capacità di catturare morfologie generali, ma non hanno raggiunto la precisione dei supervisionati nella localizzazione proteica. L’articolo introduce **SubCell**, una suite di modelli fondamentali auto-supervisionati progettati per superare questi limiti, integrando morfologia e organizzazione proteica in rappresentazioni trasferibili.

👉 **Suggerimento immagine**: uno schema introduttivo con esempi di immagini HPA (cellule con marcatori nucleo, microtubuli, reticolo, proteina target) accanto a una rappresentazione schematica del flusso di addestramento del modello.

---

## Metodi

### Architettura multi-task

Il cuore di SubCell è un **Vision Transformer** addestrato con tre obiettivi distinti ma complementari. Il primo è l’autoencoding mascherato (MAE), che obbliga il modello a ricostruire parti mancanti dell’immagine e quindi a cogliere caratteristiche generali della cellula. Il secondo è un obiettivo specifico per la cellula, basato su apprendimento contrastivo, che avvicina le rappresentazioni di immagini augmentate della stessa cellula. Il terzo è un obiettivo specifico per la proteina, che forza il modello a riconoscere pattern comuni di localizzazione indipendentemente dal tipo cellulare.

Per evitare che il modello apprenda lo sfondo anziché la cellula, è stato introdotto un **modulo di attenzione con pooling**, che pesa i contributi delle diverse patch in base alla loro importanza. Inoltre, una nuova strategia di data augmentation maschera preferenzialmente le regioni interne della cellula, concentrando il modello sul nucleo informativo dell’immagine.

L’analisi comparativa ha mostrato che i soli MAE sono efficaci per la morfologia ma deboli per la localizzazione; l’aggiunta dell’obiettivo cell-specific migliora ma non raggiunge i supervisionati; l’introduzione dell’obiettivo protein-specific produce un salto notevole di prestazioni; infine, con l’attenzione pooling le performance si allineano o superano quelle dei baseline supervisionati. I modelli migliori emersi sono stati **ViT-ProtS-Pool** e **MAE-CellS-ProtS-Pool**.

👉 **Suggerimento immagine**: diagramma del framework di addestramento multi-task con i tre obiettivi e il modulo di attention pooling.

---

## Dataset e configurazioni

La fase di addestramento si è basata sull’HPA, che fornisce immagini a fluorescenza con quattro canali principali: DNA, microtubuli, reticolo endoplasmatico e proteina target. Questo set, con la sua ampia copertura del proteoma e delle linee cellulari, è stato cruciale per permettere al modello di imparare sia la diversità morfologica sia le molteplici modalità di localizzazione proteica.

Per comprendere l’importanza dei marcatori, sono state testate varianti in cui uno o più canali venivano rimossi. È emerso che i microtubuli erano fondamentali per predire la localizzazione delle proteine, mentre il reticolo era più utile per distinguere le linee cellulari.

Gli autori hanno poi verificato la robustezza di SubCell su dataset indipendenti. L’**OpenCell** ha fornito un contesto ridotto, con solo DNA e proteina. Il **Bridge2AI-CM4AI** ha introdotto cellule tumorali trattate con farmaci come Paclitaxel e Vorinostat, quindi con fenotipi alterati rispetto ai dati di addestramento. Infine, il **JUMP Cell Painting** ha rappresentato la sfida più difficile, con immagini a bassa risoluzione, canali di coloranti diversi e ampie perturbazioni chimiche.

👉 **Suggerimento immagine**: tabella comparativa che mostri le differenze tra HPA, OpenCell, Bridge2AI e JUMP (numero di canali, tipo di cellule, risoluzione, condizioni sperimentali).

---

## Risultati

### Prestazioni su HPA

Su HPA, i modelli SubCell hanno superato sia il baseline auto-supervisionato DINO4Cells sia il miglior modello supervisionato della competizione Kaggle, sia nella predizione della localizzazione proteica sia nella classificazione di linee cellulari. È stato confermato che la disponibilità dei diversi canali influenza in maniera marcata le prestazioni, soprattutto per compiti di localizzazione.

### Generalizzazione a dataset indipendenti

Nel caso di OpenCell, SubCell è riuscito a distinguere con chiarezza compartimenti difficili come nucleolo e nucleoplasma, superando Cytoself. Sul Bridge2AI-CM4AI, ha identificato con precisione gli effetti dei farmaci, rilevando spostamenti come quello di HDAC8 e variazioni di morfologia generale. Con JUMP Cell Painting, pur senza essere mai stato addestrato su quelle immagini, SubCell ha superato i metodi classici nel compito di replicate retrieval e ha ottenuto prestazioni comparabili nell’identificazione del meccanismo d’azione.

👉 **Suggerimento immagine**: grafici a barre delle performance nei diversi dataset, con confronto diretto tra SubCell e modelli precedenti (DINO4Cells, Cytoself, CellProfiler).

### Analisi biologiche e mappe multiscala

Gli embedding di SubCell non solo hanno correlato con annotazioni esperte, ma anche con profili trascrittomici ottenuti da RNA-seq, indicando che il modello cattura variazioni fenotipiche di rilievo. Le mappe di attenzione hanno mostrato corrispondenze con strutture biologiche note, come nucleoli o microtubuli, suggerendo che il modello ha appreso a segmentare implicitamente le sottostrutture cellulari.

Gli autori hanno poi costruito la prima mappa multiscala del proteoma basata unicamente su dati visivi. Questa mappa ha distinto compartimenti principali, sottostrutture e complessi proteici, come il ribosoma citosolico. Nel caso dei microtubuli, SubCell ha separato pattern continui da pattern puntiformi, identificando sottogruppi legati a proteine ciliari. Per l’involucro nucleare ha distinto cluster di proteine strutturali stabili da quelle dinamiche coinvolte nell’esportazione di mRNA.

👉 **Suggerimento immagine**: UMAP o dendrogramma della mappa multiscala con cluster annotati, affiancato da esempi di immagini per alcuni complessi (ribosoma, microtubuli puntiformi, lamina nucleare).

---

## Discussione e prospettive

SubCell si è dimostrato un modello fondamentale generalizzabile per l’analisi di immagini a fluorescenza. La sua forza risiede nel dataset di partenza, l’HPA, che copre quasi tutto il proteoma e una grande diversità di morfologie cellulari. L’approccio multi-task ha permesso di unire informazioni di localizzazione e morfologia, rendendo le rappresentazioni trasferibili a compiti e dataset molto diversi.

Le implicazioni sono molteplici: la possibilità di studiare malattie legate a mislocalizzazione proteica, la scoperta di farmaci attraverso analisi fenotipiche più sensibili, e la costruzione di mappe cellulari data-driven che possono integrare annotazioni geniche e trascrittomiche. Gli autori immaginano che SubCell possa diventare una base per futuri modelli di “cellula virtuale” capaci di integrare dati multi-omici e immagini in un unico quadro predittivo.

👉 **Suggerimento immagine**: schema conclusivo che colleghi le applicazioni di SubCell (predizione localizzazione, drug screening, mappa multiscala, studio patologie).

---

## Dati, codice e risorse

I dati e i modelli sono disponibili pubblicamente. L’HPA può essere consultato sul sito [proteinatlas.org](https://www.proteinatlas.org), mentre i dataset ritagliati per l’addestramento si trovano su `s3://czi-subcell-public/`. Il codice per l’addestramento è ospitato su [CellProfiling/subcell-embed](https://github.com/CellProfiling/subcell-embed) e [czi-ai/sub-cell-embed](https://github.com/czi-ai/sub-cell-embed), mentre per l’inferenza è stato predisposto [czi-ai/SubCellPortable](https://github.com/czi-ai/SubCellPortable). Il codice per l’analisi e la generazione delle figure è su [CellProfiling/subcell-analysis](https://github.com/CellProfiling/subcell-analysis). La mappa proteomica interattiva sarà resa disponibile nell’HPA con la pubblicazione definitiva.

