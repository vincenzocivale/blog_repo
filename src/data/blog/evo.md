---
author: Vincenzo Yuto Civale
pubDatetime: 2025-01-05T15:20:35Z
modDatetime: 2024-06-27T16:46:34.155Z
title: Evo2, 
slug:
featured: false
draft: True
tags:
  - Paper-Review

description: 

paperUrl:
repoUrl: 
---

EVO2 rappresenta un significativo avanzamento nel campo dei foundation model biologici, progettato per comprendere, predire e generare sequenze DNA attraverso tutti i domini della vita. Sviluppato da Arc Institute in collaborazione con Stanford University, UC Berkeley, UC San Francisco e NVIDIA, questo modello costituisce il più grande modello di intelligenza artificiale mai addestrato per applicazioni biologiche, con una capacità di 40 miliardi di parametri e una finestra di contesto senza precedenti di 1 milione di nucleotidi.

Il modello si basa sul suo predecessore EVO, ma si distingue per la sua capacità di modellare non solo genomi procariotici ma anche eucarioti, inclusi sequenze umane, animali e vegetali. EVO2 rappresenta così una transizione da modelli specialistici a un approccio generalista nella modellazione genomica.

## StripedHyena 2: Un'Architettura Multi-Ibrida

EVO2 utilizza l'architettura **StripedHyena 2**, un'evoluzione dell'architettura StripedHyena originale che combina operatori convoluzionali con meccanismi di attenzione. L'architettura multi-ibrida integra tre tipologie distinte di operatori Hyena:

- **Hyena-SE** (Short Explicit): Operatori convoluzionali espliciti a breve contesto ottimizzati per il richiamo di pattern multitoken locali e massima utilizzazione hardware.

- **Hyena-MR** (Medium Regularized): Operatori convoluzionali regolarizzati per contesti medi, specializzati nella modellazione efficiente attraverso centinaia di token.

- **Hyena-LI** (Long Implicit): Operatori convoluzionali impliciti per contesti lunghi che aggregano informazioni sull'intera sequenza.

Questa configurazione multi-ibrida consente a EVO2 di gestire efficientemente sequenze lunghe mantenendo la sensibilità ai pattern locali, superando le limitazioni computazionali dei modelli Transformer tradizionali per sequenze genomiche estese.

L'architettura StripedHyena 2 dimostra una scalabilità quasi lineare rispetto alla lunghezza del contesto, contrastando con la scalabilità quadratica dei modelli Transformer. Su GPU H100 alla scala di 40 miliardi di parametri, gli operatori individuali dell'architettura multi-ibrida raggiungono un throughput doppio rispetto ai Transformer tradizionali.

## Strategia di Addestramento

### Dataset

EVO2 è stato addestrato su **OpenGenome2**, un dataset curato contenente 9,3 trilioni di nucleotidi derivati da oltre 128.000 genomi completi che rappresentano tutti i domini della vita. Il dataset comprende:

Genomi procariotici: 28.174 genomi batterici e archeali dalla GTDB v220

Genomi eucarioti: 16.704 genomi di riferimento da NCBI

Metagenomi: 41.253 metagenomi e genomi assemblati da metagenomi

Genomi organellari: 33.457 genomi eucarioti organellari

Trascritti: mRNA e ncRNA da 4.390 genomi di riferimento

Sequenze regolatorie: Sequenze promotoriali eucariote

### Addestramento Bi-Fasica

La strategia di addestramento di EVO2 riflette una comprensione profonda delle scale biologiche che caratterizzano l'organizzazione genomica. Come nei sistemi linguistici naturali, dove parole e frasi operano su scale diverse ma interconnesse, i genomi presentano elementi funzionali che operano su scale spaziali multiple: dai motivi transcrizionali locali (decine di nucleotidi) alle interazioni cromosomiche a lungo raggio (centinaia di migliaia di basi).

Nella prima fase di addestramento adotta una finestra di contesto di 8,192 nucleotidi con una strategia di campionamento mirata verso regioni genomiche ad alta densità funzionale. Questa scelta architettonica è fondata su principi biologici precisi: la maggior parte degli elementi regolatori critici (promotori, enhancer, elementi di splicing) operano entro distanze di qualche migliaio di basi dal sito target.

Il campionamento orientato verso elementi funzionali durante il pretraining è cruciale per stabilire rappresentazioni biologicamente significative. Test empirici dimostrano che questo approccio migliora significativamente le performance sia su sequenze codificanti che, particolarmente, su DNA non codificante e prossimale. L'efficacia deriva dal fatto che regioni genomiche funzionalmente dense contengono vincoli evolutivi più stringenti, fornendo segnali di apprendimento più informativi per il modello.

La seconda fase implementa un'estensione graduale del contesto fino a 1 milione di nucleotidi, accompagnata da una riconfigurazione strategica della composizione del dataset verso genomi completi. Questa transizione riflette la necessità biologica di modellare interazioni genomiche a lungo raggio, particolarmente critiche per l'organizzazione cromatinica eucariota.

## Predizione Zero-Shot degli Effetti Mutazionali

La capacità predittiva zero-shot di EVO2 rappresenta una delle realizzazioni più significative del modello, dimostrando che un apprendimento non supervisionato su sequenze genomiche può catturare vincoli funzionali con precisione clinica. Questa capacità emerge dalla modellazione della distribuzione probabilistica delle sequenze genomiche naturali: varianti deleterie riducono la verosimiglianza del modello, mentre varianti neutre mantengono probabilità comparabili al tipo selvaggio.

Il framework teorico sottostante si basa sul principio che la selezione evolutiva ha modellato la distribuzione delle sequenze genomiche naturali, eliminando progressivamente varianti deleterie e arricchendo il spazio delle sequenze per varianti funzionalmente compatibili. EVO2, attraverso la modellazione di questa distribuzione con miliardi di parametri addestrati su trilioni di nucleotidi, sviluppa una comprensione implicita dei vincoli funzionali.

### Metodologia di Scoring Mutazionale:

Per ogni variante, EVO2 calcola la likelihood logaritmica della sequenza mutata rispetto alla sequenza di riferimento. Il punteggio di patogenicità è derivato dalla differenza:

$$Pathogenicity Score=logP(reference)−logP(variant)$$

dove P(⋅) rappresenta la probabilità assegnata dal modello alla sequenza. Punteggi positivi indicano ridotta likelihood per la variante, suggerendo potenziale patogenicità.


### Mutazioni Sinonime

L'analisi della sensibilità mutazionale rivela pattern coerenti con la teoria dell'evoluzione molecolare. Nelle regioni codificanti, EVO2 assegna variazioni di likelihood significativamente maggiori a:

    Mutazioni non-sinonime: Sostituzioni che alterano la sequenza proteica, con impatto proporzionale alla conservazione del residuo

    Codoni di stop prematuri: Mutazioni non-senso che causano troncamento proteico, invariabilmente associate con alta penalizzazione di likelihood

    Mutazioni frameshift: Inserzioni/delezioni che alterano il quadro di lettura, causando drammatiche riduzioni di likelihood

Le mutazioni sinonime, che preservano la sequenza proteica, mostrano variazioni di likelihood significativamente ridotte, coerenti con il loro impatto funzionale generalmente limitato. Tuttavia, il modello 40B mostra sensibilità superiore al modello 7B per mutazioni sinonime in contesti specifici (siti di splicing cryptic, elementi regolatori sovrapposti), indicando che scale maggiori catturano vincoli funzionali più sottili.