"use client";

import { useState } from "react";
import Dado from "./Dado";

const TOTAL_RODADAS = 5;

type ResultadoRodada = "jogador1" | "jogador2" | "empate" | null;

type EstadoJogo = {
  rodadaAtual: number;
  vez: 1 | 2;
  dadosJogador1: [number, number] | null;
  dadosJogador2: [number, number] | null;
  resultadoRodada: ResultadoRodada;
  vitoriasJogador1: number;
  vitoriasJogador2: number;
  empates: number;
  jogoFinalizado: boolean;
};

function rolarDado(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function soma(dados: [number, number] | null): number {
  return dados ? dados[0] + dados[1] : 0;
}

function estadoInicial(): EstadoJogo {
  return {
    rodadaAtual: 1,
    vez: 1,
    dadosJogador1: null,
    dadosJogador2: null,
    resultadoRodada: null,
    vitoriasJogador1: 0,
    vitoriasJogador2: 0,
    empates: 0,
    jogoFinalizado: false,
  };
}

export default function JogoDados() {
  const [estado, setEstado] = useState<EstadoJogo>(estadoInicial());

  function jogarJogador1() {
    if (estado.jogoFinalizado || estado.vez !== 1) return;

    setEstado((anterior) => {
      const iniciandoNovaRodada = anterior.resultadoRodada !== null;
      return {
        ...anterior,
        rodadaAtual: iniciandoNovaRodada
          ? anterior.rodadaAtual + 1
          : anterior.rodadaAtual,
        dadosJogador1: [rolarDado(), rolarDado()],
        dadosJogador2: iniciandoNovaRodada ? null : anterior.dadosJogador2,
        resultadoRodada: null,
        vez: 2,
      };
    });
  }

  function jogarJogador2() {
    if (estado.jogoFinalizado || estado.vez !== 2) return;

    setEstado((anterior) => {
      const dadosJ2: [number, number] = [rolarDado(), rolarDado()];
      const somaJ1 = soma(anterior.dadosJogador1);
      const somaJ2 = soma(dadosJ2);

      let resultado: ResultadoRodada;
      let vitorias1 = anterior.vitoriasJogador1;
      let vitorias2 = anterior.vitoriasJogador2;
      let empatesCont = anterior.empates;

      if (somaJ1 > somaJ2) {
        resultado = "jogador1";
        vitorias1 = vitorias1 + 1;
      } else if (somaJ2 > somaJ1) {
        resultado = "jogador2";
        vitorias2 = vitorias2 + 1;
      } else {
        resultado = "empate";
        empatesCont = empatesCont + 1;
      }

      const eraUltimaRodada = anterior.rodadaAtual === TOTAL_RODADAS;

      return {
        ...anterior,
        dadosJogador2: dadosJ2,
        resultadoRodada: resultado,
        vitoriasJogador1: vitorias1,
        vitoriasJogador2: vitorias2,
        empates: empatesCont,
        jogoFinalizado: eraUltimaRodada,
        vez: 1,
      };
    });
  }

  function jogarNovamente() {
    setEstado(estadoInicial());
  }

  function textoResultadoRodada(): string {
    if (estado.resultadoRodada === "empate") {
      return "Rodada " + estado.rodadaAtual + ": empate!";
    }
    if (estado.resultadoRodada === "jogador1") {
      return "Rodada " + estado.rodadaAtual + ": Jogador 1 venceu!";
    }
    if (estado.resultadoRodada === "jogador2") {
      return "Rodada " + estado.rodadaAtual + ": Jogador 2 venceu!";
    }
    if (estado.dadosJogador1 && !estado.dadosJogador2) {
      return "Jogador 2, sua vez!";
    }
    return "Jogador 1, clique em Jogar para começar.";
  }

  function textoResultadoFinal(): string {
    if (estado.vitoriasJogador1 > estado.vitoriasJogador2) {
      return "Jogador 1 venceu a partida!";
    }
    if (estado.vitoriasJogador2 > estado.vitoriasJogador1) {
      return "Jogador 2 venceu a partida!";
    }
    return "Empate geral!";
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1>Jogo de Dados</h1>
        <img src="/nautico.png" alt="Escudo do Náutico" width={48} height={48} />
      </div>

      {!estado.jogoFinalizado && (
        <p>
          Rodada {estado.rodadaAtual} de {TOTAL_RODADAS}
        </p>
      )}

      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <h2>Jogador 1</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {estado.dadosJogador1 ? (
              <>
                <Dado valor={estado.dadosJogador1[0]} />
                <Dado valor={estado.dadosJogador1[1]} />
              </>
            ) : (
              <p>Sem jogada ainda</p>
            )}
          </div>
          <p>Soma: {estado.dadosJogador1 ? soma(estado.dadosJogador1) : "-"}</p>
          <p>Vitórias: {estado.vitoriasJogador1}</p>
          <button
            onClick={jogarJogador1}
            disabled={estado.jogoFinalizado || estado.vez !== 1}
          >
            Jogar
          </button>
        </div>

        <div>
          <h2>Jogador 2</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {estado.dadosJogador2 ? (
              <>
                <Dado valor={estado.dadosJogador2[0]} />
                <Dado valor={estado.dadosJogador2[1]} />
              </>
            ) : (
              <p>Sem jogada ainda</p>
            )}
          </div>
          <p>Soma: {estado.dadosJogador2 ? soma(estado.dadosJogador2) : "-"}</p>
          <p>Vitórias: {estado.vitoriasJogador2}</p>
          <button
            onClick={jogarJogador2}
            disabled={estado.jogoFinalizado || estado.vez !== 2}
          >
            Jogar
          </button>
        </div>
      </div>

      {!estado.jogoFinalizado && <p>{textoResultadoRodada()}</p>}

      {estado.jogoFinalizado && (
        <div>
          <h2>{textoResultadoFinal()}</h2>
          <p>
            {estado.vitoriasJogador1} x {estado.vitoriasJogador2} (
            {estado.empates} empates)
          </p>
          <button onClick={jogarNovamente}>Jogar novamente</button>
        </div>
      )}
    </main>
  );
}