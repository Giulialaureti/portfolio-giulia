# Portfolio — Giulia Laureti

Sito per il portfolio professionale di Giulia Laureti, Experience Designer. Le pagine principali (home, profilo, progetti, case study) restano HTML puro, senza build: si pubblicano così come sono. Il blog (`/blog/`) è invece generato da [Eleventy](https://www.11ty.dev/) a partire da file markdown, per avere pagine con URL puliti e ben indicizzabili da Google, e viene gestito tramite un pannello di editing (Decap CMS, su `/admin`) collegato al repository Git — niente codice da toccare per scrivere un nuovo articolo.

## Struttura

```text
index.html                 Homepage (hero, progetti, approccio, profilo sintetico, ASIERI, contatti)
profilo.html                Pagina Profilo (bio, approccio, competenze, esperienze, formazione, CV)
progetti.html                Galleria visiva di tutti i progetti
404.html                     Pagina di errore
progetti/
  musa.html
  psicologa.html             Caso anonimizzato (nessun nome, wireframe generici)
  gruppo-ricerca.html        Caso anonimizzato (nessun nome, wireframe generici)
  borghi-magazine.html
  roma-in-prospettiva.html
  asieri.html                Caso breve
assets/
  css/style.css              Design system (token, tipografia, componenti, layout)
  js/main.js                 Menu mobile, anno corrente nel footer
  fonts/                     Hanken Grotesk e Manrope, self-hosted (woff2 variabili)
  img/                       Immagini organizzate per progetto + /site (favicon, monogramma, OG image)
  cv/Giulia-Laureti-CV.pdf   CV scaricabile
admin/                       Pannello Decap CMS (index.html + config.yml) per scrivere gli articoli
blog-src/                    Sorgenti Eleventy del blog (layout, pagina indice, articoli in blog-src/posts/*.md)
_site/                       Output generato da `npm run build` (ignorato da git, non modificare a mano)
```

## Avvio in locale

Il sito richiede [Node.js](https://nodejs.org/) (LTS) per generare il blog. Una volta installato:

```bash
cd portfolio-giulia
npm install       # solo la prima volta
npm run start     # build + server locale con ricarica automatica su :8090
```

Poi aprire `http://localhost:8090/`. Le pagine principali (home, profilo, progetti, case study) si possono comunque aprire anche con un semplice server statico (es. `python3 -m http.server`), ma per vedere `/blog/` e `/admin/` serve `npm run start`.

Per generare solo l'output finale, senza avviare un server: `npm run build` (scrive in `_site/`).

## Scrivere un nuovo articolo

1. Apri `/admin` sul sito pubblicato e accedi.
2. Collezione **Articoli** → **Nuovo Articolo**.
3. Compila titolo, data, descrizione breve, eventuale immagine di copertina e testo.
4. **Pubblica**: in un paio di minuti l'articolo è online su `/blog/titolo-articolo/`, elencato anche nella pagina `/blog/`.

## Pubblicazione

Il sito è pensato per Netlify (build automatica configurata in `netlify.toml`: comando `npm run build`, cartella pubblicata `_site`). Passi generali:

1. Su Netlify: collegare il repository GitHub, il comando di build e la cartella pubblicata vengono letti automaticamente da `netlify.toml`. La pagina `404.html` è già configurata come pagina di errore personalizzata (redirect in `netlify.toml`).
2. Aggiornare `blog-src/_data/site.json` (`url`) con il dominio definitivo: viene usato per i link canonici delle pagine del blog.
3. Aggiornare i meta tag `og:image` e `canonical` nelle pagine HTML principali con l'URL assoluto del dominio definitivo, se si desidera un'anteprima social corretta (attualmente usano percorsi relativi, corretti per la navigazione ma non risolvibili dai crawler social senza dominio).
4. Verificare che il server serva correttamente i file `.woff2` con il MIME type adeguato (Netlify lo fa di default).
5. Completare `admin/config.yml` con il repository GitHub reale e l'id del sito DecapBridge (vedi sezione "Scrivere un nuovo articolo").

## Note tecniche

- Font Hanken Grotesk (titoli "personali": H1 di home, Profilo e 404, wordmark, numeri in contorno) e Manrope (tutto il resto: titoli di sezione, corpo testo) sono variabili e serviti localmente da `assets/fonts/`: nessuna dipendenza da Google Fonts in produzione.
- Navigazione a sidebar fissa a sinistra da 960px in su (`.site-sidebar`), che diventa una barra superiore sticky con menu a tendina sotto quella soglia.
- Effetto "glow" ambientale: un alone lilla molto delicato (`body::before`) segue il cursore sull'intero sito, statico finché l'utente non muove il mouse; disattivato sotto `prefers-reduced-motion`.
- Le frasi chiave nei testi sono evidenziate con un tratto "evidenziatore" (`mark.hl`/`.hl`) invece del corsivo, coerente con il tono più diretto del sito.
- I link che escono dal normale flusso di navigazione (download del CV, indirizzi email `mailto:`) mostrano automaticamente una piccola freccia (via CSS, nessuna icona da gestire a mano nei singoli file HTML).
- Le immagini sono state ottimizzate (ridimensionate e compresse in JPEG) a partire dai materiali originali; quelle sotto la piega usano `loading="lazy"`. Le dimensioni di visualizzazione nei case study sono contenute via CSS (hero ≤ 40rem, figure singole ≤ 30rem, immagini in griglia ≤ 22rem) per evitare che le immagini dominino la pagina.
- Il sito rispetta `prefers-reduced-motion`: le animazioni (glow del cursore, comparsa dei contenuti) si disattivano automaticamente.
- Contrasto colore verificato secondo WCAG AA su tutte le combinazioni di testo del sistema, incluse le sezioni scure (`.section-dark`) e il testo evidenziato.
- Nessun tracker, cookie di profilazione o script di terze parti.

## Resoconto delle scelte progettuali

- **Stile ispirato a clarissepsicat.com, contenuti invariati.** Su richiesta esplicita, il sito ha adottato la navigazione a sidebar fissa, un grottesco moderno (Hanken Grotesk, lo stesso usato nel riferimento) per i titoli "personali", i bottoni a pillola, i numeri di progetto in contorno e un tono leggermente più diretto nelle frasi evidenziate. Una prima versione usava un font disegnato a mano per questi titoli: su feedback diretto ("troppo giocoso"), è stato sostituito con Hanken Grotesk, più moderno e "tondo" ma non infantile. La riscrittura non ha toccato la struttura a pagine separate (mantenuta su richiesta) né i contenuti fattuali dei case study, che restano quelli verificati nel brief originale.
- **Lilla come accento, non come sfondo.** Il colore lilla è riservato a dettagli (highlight, contorni, glow) mentre le sezioni di rottura usano un blu navy scuro (`.section-dark`), per un impatto visivo più netto senza saturare la pagina.
- **Homepage come indice, non come case study.** I quattro progetti principali sono presentati come schede editoriali (immagine, metadati, sintesi, tag, link), senza timeline verticale — esplicitamente scartata nel brief.
- **Due velocità di lettura nei case study.** Ogni caso principale apre con una sintesi autosufficiente (domanda guida, metadati, "in breve") e prosegue con un approfondimento scansionabile: sfida, contributo personale, percorso, decisioni chiave nel formato evidenza → scelta → effetto, risultato, limiti.
- **Trasparenza sulle fonti.** Borghi Magazine dichiara esplicitamente, nella didascalia dell'immagine principale e in una nota finale, che la homepage mostrata è una ricostruzione dimostrativa e che wireframe/mockup originali non sono più disponibili. ASIERI chiarisce che le illustrazioni partivano da una base generata con uno strumento automatico. Nessun documento della cartella `_sources_private` dei materiali originali è stato pubblicato o collegato.
- **Due progetti anonimizzati su richiesta.** I casi originariamente riferiti a una psicologa clinica e a un gruppo di ricerca universitario sono stati generalizzati: nessun nome proprio, nessun link al sito reale, nessuno screenshot con volti o informazioni riconducibili ai clienti. Al loro posto, otto mockup ricostruiti riprendono fedelmente palette e tipografia realmente utilizzate nei due progetti (verde salvia, rosa polvere, Playfair Display e Open Sans per la psicologa; blu e azzurro istituzionali, Lato e Open Sans per il gruppo di ricerca — colori e font verificati sui siti pubblici tuttora online), con contenuti generici, foto sostituite da un'icona segnaposto e nessun testo reale. Questo permette di mostrare la qualità del lavoro di design senza esporre l'identità dei clienti. Entrambe le pagine dichiarano esplicitamente, in una nota all'inizio del case study, che si tratta di una presentazione anonima. Per lo stesso motivo la nota sull'esclusione di una pagina aggiunta successivamente al sito del gruppo di ricerca è stata mantenuta ma generalizzata, senza nominare la pagina né il gruppo.
- **Nessuna metrica inventata.** Lo snapshot Analytics di Borghi Magazine (periodo 10 agosto – 6 settembre 2024) è presentato come esempio di monitoraggio attivo tramite Site Kit, non come prova di crescita, riprendendo la cautela indicata nei materiali.
- **Contatto diretto.** Nessun form: solo email e CV scaricabile, come richiesto. Nessun link LinkedIn, perché nei materiali non è presente un URL verificato.
- **Monogramma come firma, non come portfolio fittizio.** In assenza di un ritratto personale o di un logo vettoriale dedicato, per la pagina Profilo e per favicon/OG image è stato riutilizzato il monogramma "G" già presente nel CV, coerentemente con l'indicazione di brand identity di mantenerlo come firma personale.

## Dati non disponibili (segnalati, non inventati)

- Nessuna fotografia reale del libro multisensoriale "Sensazioni da sfogliare" (MusA): il progetto resta un concept, come dichiarato nel case study.
- Nessun dato di traffico per il progetto del gruppo di ricerca universitario: la manutenzione annuale non ha previsto un'attività di misurazione documentata.
- Wireframe e mockup originali di Borghi Magazine non sono più disponibili; la homepage mostrata è dichiarata come ricostruzione.
- Nessun URL LinkedIn verificato per Giulia Laureti: il collegamento non è stato aggiunto.
- I casi della psicologa e del gruppo di ricerca sono presentati in forma anonima su richiesta esplicita: nomi, URL reali e schermate con volti o informazioni riconducibili ai clienti non sono stati pubblicati.

Nessuno di questi limiti ha richiesto di bloccare la consegna: sono stati gestiti con trasparenza nei testi, secondo le istruzioni del brief.
