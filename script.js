let compensoTotale = Number(localStorage.getItem("compenso")) || 0;
let fattureTotali = Number(localStorage.getItem("fatture")) || 0;
let processiTotali = Number(localStorage.getItem("processi")) || 0;

function formatMoney(num) {
  return num.toLocaleString("it-IT") + "$";
}

function getData() {
  return new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
}

// PROCESSO UI
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

function genera() {
  let servizio = document.getElementById("servizio").value;
  if (!servizio) return alert("Seleziona un servizio");

  let prezzo = 0;
  let compenso = 0;
  let nome = "";

  switch (servizio) {

    case "denuncia":
      nome = "DENUNCIA"; prezzo = 0; compenso = 10000; break;
    case "doc_tirocinante":
      nome = "DOCUMENTO TIROCINANTE"; prezzo = 4000; compenso = 4000; break;
    case "doc_dipendente":
      nome = "DOCUMENTO DIPENDENTE"; prezzo = 15000; compenso = 6000; break;
    case "doc_direttore":
      nome = "DOCUMENTO DIRETTORE"; prezzo = 60000; compenso = 6000; break;
    case "vendita_ambulante":
      nome = "VENDITA AMBULANTE"; prezzo = 10000; compenso = 5000; break;
    case "vetri":
      nome = "VETRI OSCURATI"; prezzo = 50000; compenso = 15000; break;
    case "precedenti":
      nome = "INFO PRECEDENTI PENALI"; prezzo = 3000; compenso = 3000; break;

    case "pulizia":
      nome = "PULIZIA FEDINA";
      prezzo = Number(prompt("Inserisci prezzo"));
      compenso = Number(prompt("Inserisci compenso"));
      break;

    case "matrimonio":
    case "parentela":
    case "divorzio":
      nome = servizio.toUpperCase();
      prezzo = 15000; compenso = 5000; break;

    case "assistenza":
      nome = "ASSISTENZA LEGALE";
      prezzo = Number(prompt("Inserisci prezzo"));
      compenso = prezzo * 0.75;
      break;

    case "processo_avvocato":
      gestioneProcesso("PROCESSO (Avvocato)", 10000, 0.10); return;
    case "processo_procura":
      gestioneProcesso("PROCESSO (Procura)", 20000, 0.15); return;
    case "processo_corte":
      gestioneProcesso("PROCESSO (Corte)", 30000, 0.20); return;
    case "processo_suprema":
      gestioneProcesso("PROCESSO (Corte Suprema)", 30000, 0.10); return;

    case "maschera_bi":
      nome = "MASCHERA BISETTIMANALE"; prezzo = 225000; compenso = 15000; break;
    case "maschera_mese":
      nome = "MASCHERA MENSILE"; prezzo = 350000; compenso = 25000; break;
  }

  aggiorna(nome, prezzo, compenso, false);
}

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

function aggiorna(nome, prezzo, compenso, isProcesso) {
  compensoTotale += compenso;
  fattureTotali++;
  if (isProcesso) processiTotali++;

  localStorage.setItem("compenso", compensoTotale);
  localStorage.setItem("fatture", fattureTotali);
  localStorage.setItem("processi", processiTotali);

  document.getElementById("output").textContent =
`Servizio: ${nome}
Data: ${getData()}
Prezzo: ${formatMoney(prezzo)}
Compenso Totale: ${formatMoney(compensoTotale)}
Fatture Totali: ${fattureTotali}
Processi: ${processiTotali}`;
}

function copia() {
  let testo = document.getElementById("output").textContent;
  if (!testo) return alert("Niente da copiare!");
  navigator.clipboard.writeText(testo);
  alert("Copiato!");
}

// OVERLAY RITIRO
function ritira() {
  document.getElementById("ritiroBox").style.display = "flex";
}

function confermaRitiro() {
  compensoTotale = 0;
  fattureTotali = 0;
  processiTotali = 0;

  localStorage.clear();

  document.getElementById("output").textContent = "Stipendio ritirato.";
  chiudiRitiro();
}

function chiudiRitiro() {
  document.getElementById("ritiroBox").style.display = "none";
}