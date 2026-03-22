
// ===== STORAGE BASE =====
let compensoTotale = Number(localStorage.getItem("compenso")) || 0;
let fattureTotali = Number(localStorage.getItem("fatture")) || 0;
let processiTotali = Number(localStorage.getItem("processi")) || 0;

// ===== ARCHIVIO + STORICO =====
let archivio = JSON.parse(localStorage.getItem("archivio")) || [];
let storico = [];

// ===== UTILS =====
function formatMoney(num) {
  return num.toLocaleString("it-IT") + "$";
}

function getData() {
  return new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
}

// ===== UI PROCESSI =====
document.getElementById("servizio").addEventListener("change", function () {
  let processi = [
    "processo_avvocato",
    "processo_procura",
    "processo_corte",
    "processo_suprema"
  ];

  document.getElementById("processoBox").style.display =
    processi.includes(this.value) ? "block" : "none";
});

document.getElementById("contumacia").addEventListener("change", function () {
  document.getElementById("multaBox").style.display =
    this.value === "no" ? "block" : "none";
});

// ===== GENERA =====
function genera() {
  let servizio = document.getElementById("servizio").value;
  if (!servizio) return alert("Seleziona un servizio");

  let prezzo = 0;
  let compenso = 0;
  let nome = "";

  switch (servizio) {

    case "denuncia":
      nome = "Denuncia";
      prezzo = 0;
      compenso = 10000;
      break;

    case "doc_tirocinante":
      nome = "Documento Lavorativo Tirocinante";
      prezzo = 4000;
      compenso = 4000;
      break;

    case "doc_dipendente":
      nome = "Documento Lavorativo Dipendente";
      prezzo = 15000;
      compenso = 6000;
      break;

    case "doc_direttore":
      nome = "Documento Lavorativo Direttore";
      prezzo = 60000;
      compenso = 6000;
      break;

    case "vendita_ambulante":
      nome = "Documento di Vendita Ambulante";
      prezzo = 10000;
      compenso = 5000;
      break;

    case "vetri":
      nome = "Permesso Vetri Oscurati";
      prezzo = 50000;
      compenso = 15000;
      break;

    case "precedenti":
      nome = "Info Precedenti Penali";
      prezzo = 3000;
      compenso = 3000;
      break;

    case "pulizia":
      nome = "Pulizia Fedina";
      prezzo = Number(prompt("Inserisci prezzo"));
      compenso = Number(prompt("Inserisci compenso"));
      break;

    case "richiesta_pulizia":
      nome = "Richiesta Pulizia Fedina";
      prezzo = 20000;
      compenso = 6000;
      break;

    case "matrimonio":
      nome = "Certificato di Matrimonio";
      prezzo = 15000;
      compenso = 5000;
      break;

    case "parentela":
      nome = "Certificato di Parentela";
      prezzo = 15000;
      compenso = 5000;
      break;

    case "divorzio":
      nome = "Certificato di Divorzio";
      prezzo = 15000;
      compenso = 5000;
      break;

    case "assistenza":
      nome = "Assistenza alle Celle / Consulenza Legale";
      prezzo = Number(prompt("Inserisci prezzo"));
      compenso = prezzo * 0.75;
      break;

    // ===== PROCESSI =====
    case "processo_avvocato":
      gestioneProcesso("Processo - Avvocato", 10000, 0.10);
      return;

    case "processo_procura":
      gestioneProcesso("Processo - Procuratore", 20000, 0.15);
      return;

    case "processo_corte":
      gestioneProcesso("Processo - Giudice", 30000, 0.20);
      return;

    case "processo_suprema":
      gestioneProcesso("Processo - Giudice Supremo", 30000, 0.10);
      return;

    case "maschera_bi":
      nome = "Permesso Maschera Parziale Bisettimanale";
      prezzo = 225000;
      compenso = 15000;
      break;

    case "maschera_mese":
      nome = "Permesso Maschera Parziale Mensile";
      prezzo = 350000;
      compenso = 25000;
      break;
  }

  aggiorna(nome, prezzo, compenso, false);
}

// ===== PROCESSO =====
function gestioneProcesso(nome, prezzoBase, percentuale) {
  let contumacia = document.getElementById("contumacia").value;

  if (!contumacia) return alert("Seleziona contumacia");

  let prezzo, compenso;

  if (contumacia === "si") {
    prezzo = prezzoBase;
    compenso = prezzoBase;
  } else {
    let multa = Number(document.getElementById("multa").value);
    if (!multa) return alert("Inserisci multa");

    prezzo = multa;
    compenso = multa * percentuale;
  }

  aggiorna(nome, prezzo, compenso, true);
}

// ===== AGGIORNA =====
function aggiorna(nome, prezzo, compenso, isProcesso) {

  // salva stato precedente
  storico.push({
    compensoTotale,
    fattureTotali,
    processiTotali
  });

  // aggiorna valori
  compensoTotale += compenso;
  fattureTotali++;
  if (isProcesso) processiTotali++;

  // salva
  localStorage.setItem("compenso", compensoTotale);
  localStorage.setItem("fatture", fattureTotali);
  localStorage.setItem("processi", processiTotali);

  let messaggio =
`Servizio: ${nome}
Data: ${getData()}
Prezzo: ${formatMoney(prezzo)}
Compenso Totale: ${formatMoney(compensoTotale)}
Fatture Totali: ${fattureTotali}
Processi: ${processiTotali}`;

  document.getElementById("output").textContent = messaggio;

  // aggiorna archivio
  archivio.unshift(messaggio);
  if (archivio.length > 10) archivio.pop();

  localStorage.setItem("archivio", JSON.stringify(archivio));

  aggiornaArchivio();
}

// ===== ARCHIVIO =====
function aggiornaArchivio() {
  let container = document.getElementById("listaArchivio");
  container.innerHTML = "";

  archivio.forEach(item => {
    let div = document.createElement("div");
    div.className = "archivio-item";
    div.textContent = item;
    container.appendChild(div);
  });
}

// ===== ANNULLA =====
function annulla() {
  if (storico.length === 0) {
    alert("Niente da annullare");
    return;
  }

  let ultimo = storico.pop();

  compensoTotale = ultimo.compensoTotale;
  fattureTotali = ultimo.fattureTotali;
  processiTotali = ultimo.processiTotali;

  localStorage.setItem("compenso", compensoTotale);
  localStorage.setItem("fatture", fattureTotali);
  localStorage.setItem("processi", processiTotali);

  archivio.shift();
  localStorage.setItem("archivio", JSON.stringify(archivio));

  document.getElementById("output").textContent =
    archivio[0] || "Operazione annullata.";

  aggiornaArchivio();
}

// ===== COPIA =====
function copia() {
  let testo = document.getElementById("output").textContent;
  if (!testo) return alert("Niente da copiare!");

  navigator.clipboard.writeText(testo);
  alert("Copiato!");
}

// ===== RITIRO =====
function ritira() {
  document.getElementById("ritiroBox").style.display = "flex";
}

function confermaRitiro() {
  compensoTotale = 0;
  fattureTotali = 0;
  processiTotali = 0;

  localStorage.clear();

  archivio = [];
  storico = [];

  document.getElementById("output").textContent = "Stipendio ritirato.";
  aggiornaArchivio();

  chiudiRitiro();
}

function chiudiRitiro() {
  document.getElementById("ritiroBox").style.display = "none";
}

// ===== INIT =====
aggiornaArchivio();
