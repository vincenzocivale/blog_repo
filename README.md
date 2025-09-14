

### 1\. Configurazione Principale (`src/config.ts`)

Questo è il file più importante da modificare per personalizzare il tuo sito. Qui si trovano le impostazioni globali del blog.

  * **`SITE.title`**: Cambia il titolo del sito con il nome che hai scelto per il tuo blog.
  * **`SITE.desc`**: Inserisci una descrizione concisa del tuo blog. Questa è fondamentale per la SEO (Search Engine Optimization) e per la condivisione sui social media.
  * **`SITE.author`**: Sostituisci il nome con il tuo.
  * **`SITE.ogImage`**: Qui puoi specificare il percorso di un'immagine predefinita (ad esempio `astropaper-og.jpg` nella cartella `public/assets`) che verrà usata come immagine di anteprima quando il tuo blog viene condiviso sui social media.
  * **`SOCIALS`**: Troverai un array di oggetti per i link ai tuoi profili social. Modifica gli `href` con i link ai tuoi account (ad es. GitHub, LinkedIn, ecc.). Se non desideri mostrare un'icona specifica, puoi rimuovere l'intero oggetto dall'array.

-----

### 2\. Creazione dei Post (`src/content/blog`)

I post del blog sono scritti in Markdown e si trovano in questa cartella.

  * **Frontmatter**: Ogni post ha un blocco di metadati all'inizio, chiamato "frontmatter", delimitato da `---`. Dovrai modificarlo per ogni nuovo articolo. Gli elementi essenziali da personalizzare sono:
      * **`title`**: Il titolo del tuo post.
      * **`pubDatetime`**: La data e l'ora di pubblicazione (ad es. `2024-09-15T10:00:00Z`).
      * **`slug`**: Il "percorso" del tuo post nell'URL (es. `/come-creare-un-blog`).
      * **`featured`**: Imposta a `true` se vuoi che il post appaia in evidenza.
      * **`draft`**: Imposta a `true` per i post in bozza che non vuoi ancora pubblicare.
      * **`tags`**: Una lista di parole chiave per categorizzare il tuo articolo (es. `['ingegneria biomedica', 'astro', 'blog']`).

-----

### 3\. Sostituzione del Logo e delle Immagini (`public/assets`)

  * **Logo**: Se vuoi usare un logo personalizzato al posto del titolo testuale, devi posizionare il file `.svg` o `.png` nella cartella `public/assets`. Successivamente, dovrai modificare il file `src/config.ts` per abilitare l'immagine del logo (se l'opzione è presente nel template) o modificare il componente `Header.astro` (si trova in `src/components/Header.astro`) per puntare al nuovo file del logo.
  * **Immagini dei Post**: Salva le immagini che vuoi usare nei tuoi articoli nella stessa cartella dei post, o in una sottocartella, e richiamale nel Markdown con il percorso relativo.

-----

### 4\. Gestione dei Colori e del Tema

Il template Astro Paper supporta la modalità chiara e scura. Se vuoi personalizzare i colori, dovrai esplorare i file CSS in `src/styles`. Spesso i colori del tema sono definiti come variabili CSS (`--colore-principale: #...;`). Modificando queste variabili, puoi cambiare l'aspetto del tuo blog.

-----

### 5\. Avviare il Progetto

Dopo aver clonato la repository e installato le dipendenze (es. con `npm install`), puoi avviare il server di sviluppo per vedere le tue modifiche in tempo reale con il comando:

```bash
npm run dev
```

Una volta terminato, per creare la versione statica del tuo blog da caricare online, esegui:

```bash
npm run build
```

Questo comando creerà la cartella `dist`, che contiene tutti i file ottimizzati per la pubblicazione.

-----

