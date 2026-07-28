# Piano di Implementazione - Red Flag Game

## Step 1: Setup progetto e struttura base [COMPLETATO]
- [x] Inizializzare progetto con Vite + React + TypeScript
- [x] Configurare Tailwind CSS v4
- [x] Installare Lucide Icons
- [x] Creare la struttura delle cartelle (components, pages, hooks, types, data, utils, game, assets)
- [x] Creare il file `config.ts` con parametri configurabili
- [x] Definire tutte le interfacce TypeScript (Player, Partner, RedFlag, GameState, Turn, Stage, Statistics, Badge)
- [x] Creare i tipi per le schermate e gli stati del gioco

## Step 2: Dataset [COMPLETATO]
- [x] Creare `nomi_maschili.json` (50 nomi)
- [x] Creare `nomi_femminili.json` (50 nomi)
- [x] Creare `redflags.json` con 10 red flag (id, category, image, maleText, femaleText)
- [x] Abilitare resolveJsonModule nel tsconfig

## Step 3: Game Engine [COMPLETATO]
- [x] Creare la logica core in `game/engine.ts`
- [x] Gestione turni (round-robin tra giocatori)
- [x] Generazione partner casuale (nome + sesso corretto in base alla scelta)
- [x] Estrazione red flag senza ripetizioni
- [x] Gestione accetta/rifiuta
- [x] Avanzamento step
- [x] Calcolo fine partita

## Step 4: Home Page [COMPLETATO]
- [x] Layout con logo, pulsante "Avvia partita", link "Istruzioni"
- [x] Modale istruzioni
- [x] Footer con credits
- [x] Animazioni di ingresso

## Step 5: Configurazione Partita [COMPLETATO]
- [x] Form per aggiungere/rimuovere giocatori
- [x] Input nome + selezione partner ricercato (Uomo/Donna/Qualsiasi)
- [x] Validazione (minimo 2 giocatori)
- [x] Pulsante "Inizia"

## Step 6: Schermata di gioco - Barra progresso e cambio turno [COMPLETATO]
- [x] Progress bar con i 5 step
- [x] Schermata di passaggio turno ("Tocca a [Nome]!")
- [x] Transizioni animate tra turni

## Step 7: Animazione suspense [COMPLETATO]
- [x] Animazione di 2 secondi prima della red flag
- [x] Scritte casuali tipo "Vediamo chi hai trovato..."
- [x] Animazione cuori/loading romantico

## Step 8: Card profilo dating + Swipe [COMPLETATO]
- [x] UI stile app di dating (nome partner, illustrazione, bio/red flag)
- [x] Swipe a destra (accetta) e sinistra (rifiuta) con gesture touch
- [x] Feedback visivo (cuore/cuore spezzato)
- [x] Logica: accetta -> salva red flag e avanza step; rifiuta -> nuovo partner

## Step 9: Storico red flag [COMPLETATO]
- [x] Pannello/modale con lo storico delle decisioni del giocatore
- [x] Lista red flag accettate
- [x] Accessibile dalla schermata di gioco

## Step 10: Classifica finale e Badge [COMPLETATO]
- [x] Schermata statistiche per ogni giocatore
- [x] Assegnazione automatica badge divertenti
- [x] Layout con animazioni/confetti

## Step 11: Animazioni e polish [COMPLETATO]
- [x] Transizioni tra schermate (fade, slide)
- [x] Flip card per la red flag
- [x] Confetti al completamento step
- [x] Vibrazione alla comparsa red flag
- [x] Animazioni progress bar

## Step 12: Funzionalita' future [COMPLETATO]
- [x] Persistenza su localStorage
- [x] Green Flag (evento casuale 5%)
- [x] Effetti sonori
