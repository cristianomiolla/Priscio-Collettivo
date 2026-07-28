# Specifiche progetto

## Nome progetto

Red Flag Game (nome temporaneo)

---

# Obiettivo

Creare una web app completamente client-side (nessun login, nessun backend, nessun database) pensata per essere giocata da un gruppo di amici utilizzando un solo telefono.

Il gioco deve essere estremamente veloce, divertente e con un'interfaccia moderna e animata, pensata per generare contenuti condivisibili sui social.

Tutti i dati devono rimanere in memoria durante la partita.

---

# Stack

Utilizzare:

* React
* Vite
* TypeScript
* Tailwind CSS
* Lucide Icons

Nessun backend.

Nessun login.

Nessuna API.

---

# Struttura delle schermate

## 1. Home

Mostrare:

* Logo PNG
* Pulsante grande

> Avvia partita

Sotto:

"Istruzioni"

che apre una modale.

In basso:

Creato da

email@email.com

---

## 2. Istruzioni

Spiegazione semplice:

* Inserisci tutti i giocatori.
* Passatevi il telefono.
* Accetta o rifiuta le red flag.
* Ogni red flag accettata rimane per sempre.
* Vince chi riesce ad arrivare ai figli con meno compromessi.

---

## 3. Configurazione partita

Possibilita' di aggiungere giocatori.

Ogni giocatore inserisce:

* Nome
* Partner ricercato

  * Uomo
  * Donna

(opzionalmente anche "qualsiasi")

Pulsante:

Inizia

---

# Flusso del gioco

Il gioco procede a turni.

Ogni turno appartiene ad un giocatore.

Ogni giocatore deve superare i seguenti step:

1. Primo appuntamento
2. Fidanzamento
3. Convivenza
4. Matrimonio
5. Figli

Ogni step corrisponde ad una red flag.

---

# Generazione partner

Ad ogni step viene generato casualmente:

Nome del partner

(es. Marco, Luca, Sara, Alice...)

rispettando il sesso scelto.

Il partner cambia ogni volta.

---

# Suspense

Prima di mostrare la red flag:

animazione di circa 2 secondi.

Ad esempio:

* roulette
* slot machine
* cuori
* loading romantico

Scritta:

"Vediamo chi hai trovato..."

oppure

"Conosci il tuo partner..."

con piccole animazioni.

---

# Estrazione Red Flag

Dopo l'animazione compare una schermata ispirata alle app di dating.

La UI deve ricordare un profilo di un'app di incontri:

* In alto il nome del partner.
* Al centro una grande illustrazione simpatica che rappresenta il partner, come se fosse la foto profilo.
* Sotto l'illustrazione compare la red flag, impaginata come se fosse la bio del profilo.

Esempio:

Partner:
Marco

Bio:

"Gli puzzano i piedi."

L'utente non utilizza pulsanti per decidere.

La scelta avviene tramite swipe:

* Swipe a destra -> Accetto
* Swipe a sinistra -> Rifiuto

Da qualche parte nella schermata deve essere presente anche un pulsante per aprire lo storico delle decisioni prese fino a quel momento (red flag accettate e altri dati utili della partita).

---

# Red Flag cumulative

Ogni volta che viene effettuato uno swipe verso destra (Accetto), la red flag entra nella lista permanente del giocatore.

**Il partner rimane lo stesso** e viene mostrata una nuova red flag aggiuntiva per lo stesso partner.

Le red flag accumulate per il partner corrente vengono mostrate nella card.

Se il giocatore accetta **5 red flag** per lo stesso partner, il turno del giocatore termina (se e' l'unico giocatore, la partita finisce).

Se invece viene effettuato uno swipe verso sinistra (Rifiuto), la red flag NON viene salvata.

Il partner viene scartato.

Il sistema genera immediatamente un nuovo partner con una nuova red flag.

Le red flag accumulate dal partner precedente rimangono nel progresso del giocatore.

La red flag appena rifiutata non deve uscire di nuovo nello stesso turno.

---

# Evitare ripetizioni

Durante una partita:

La stessa red flag non deve comparire due volte allo stesso giocatore.

Idealmente nemmeno ad altri giocatori finche' esistono red flag disponibili.

---

# Barra progresso

Mostrare sempre una progress bar.

Step:

Primo appuntamento

Fidanzamento

Convivenza

Matrimonio

Figli

Lo step corrente deve essere evidenziato.

---

# Cambio turno

Quando un giocatore accetta una red flag:

passa allo step successivo ma il partner rimane lo stesso.

Viene mostrata una nuova red flag per lo stesso partner.

Dopo aver accettato 5 red flag totali (completando tutti gli step), il turno del giocatore termina e si passa al giocatore successivo.

Se il giocatore rifiuta, il partner cambia e si riparte dallo step corrente con un nuovo partner.

---

# Fine partita

Quando tutti arrivano allo step:

Figli

la partita termina.

---

# Classifica finale

Creare una schermata finale con statistiche.

Per ogni giocatore mostrare:

Nome

Red Flag accettate

Partner rifiutati

Tentativi totali

Percentuale di accettazione

Partner finale

Livello fortuna

---

# Badge divertenti

Assegnare automaticamente badge.

Esempi:

Disperato romantico

Ha accettato tutto subito.

Schizzinoso

Ha rifiutato tantissimi partner.

Cuore d'oro

Accetta quasi tutto.

Selettore seriale

Ha visto tantissimi partner.

Iron Stomach

Ha accettato le peggiori red flag.

Fortunello

Ha trovato ottimi partner.

---

# Dataset

Separare completamente i dati dalla logica.

Creare file JSON:

* nomi_maschili.json
* nomi_femminili.json
* redflags.json

Ogni red flag contiene:

```ts
{
  id: 12,
  category: "igiene",
  image: "feet.png",
  maleText: "Gli puzzano i piedi.",
  femaleText: "Le puzzano i piedi."
}
```

---

# Illustrazioni

Ogni red flag ha una propria illustrazione.

Stile:

* flat
* cartoon
* minimal
* colorato
* divertente

Le immagini devono essere facilmente sostituibili.

---

# Animazioni

Animazioni richieste:

* transizione tra schermate
* comparsa card
* flip della carta
* barra progresso animata
* confetti quando si completa uno step
* piccola vibrazione quando compare una red flag
* fade tra i turni

---

# Architettura

Separare:

* components/
* pages/
* hooks/
* types/
* data/
* utils/
* game/
* assets/

Non inserire logica direttamente nei componenti.

Creare un Game Engine separato.

---

# Tipi

Creare interfacce TypeScript.

Ad esempio:

```ts
Player
Partner
RedFlag
GameState
Turn
Stage
Statistics
```

---

# Lista funzionalita' future (bassa priorita')

## Audio

Piccoli effetti sonori:

* click
* roulette
* successo
* rifiuto
* applauso

(disattivabili)

---

## Eventi casuali

Ogni tanto (es. 5% delle volte) puo' comparire una "Green Flag" speciale che permette di:

* rimuovere una red flag gia' accettata;
* saltare gratuitamente uno step.

Questa funzionalita' non e' prioritaria ma puo' rendere il gameplay piu' imprevedibile e divertente.

---

## Persistenza facoltativa

Anche senza login, salvare automaticamente la partita in `localStorage`, cosi' se la pagina viene chiusa accidentalmente e' possibile riprenderla.

---

## Parametri configurabili

Rendere facilmente modificabili da un file `config.ts`:

* numero di step (default: 5)
* elenco degli step
* numero massimo di rifiuti visualizzati nelle statistiche
* durata delle animazioni
