import { useState } from "react";

// ── Utilitário ───────────────────────────────────────────────────────────────

/** Formata uma data ISO (YYYY-MM-DD) para DD/MM/YYYY */
function fmt(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ── Tabela dinâmica ──────────────────────────────────────────────────────────

/**
 * Gera a tabela completa de turmas com base no ano atual do sistema.
 * Data de corte: 31/03 de cada ano.
 * Cobre Berçário → 3ª Série do Ensino Médio.
 */
function gerarTabela(anoBase) {
  return [
    // ── Creche ────────────────────────────────────
    { etapa: "Creche",             turma: "Berçário",    idadeAlvo: "4 m a 1 ano", inicioISO: `${anoBase - 1}-04-01`, fimISO: `${anoBase}-02-02`        },
    { etapa: "Creche",             turma: "Maternal I",  idadeAlvo: "1 ano",        inicioISO: `${anoBase - 2}-04-01`, fimISO: `${anoBase - 1}-03-31`    },
    { etapa: "Creche",             turma: "Maternal II", idadeAlvo: "2 anos",       inicioISO: `${anoBase - 3}-04-01`, fimISO: `${anoBase - 2}-03-31`    },
    { etapa: "Creche",             turma: "Maternal III",idadeAlvo: "3 anos",       inicioISO: `${anoBase - 4}-04-01`, fimISO: `${anoBase - 3}-03-31`    },
    // ── Pré-Escola ────────────────────────────────
    { etapa: "Pré-Escola",         turma: "Pré I",       idadeAlvo: "4 anos",       inicioISO: `${anoBase - 5}-04-01`, fimISO: `${anoBase - 4}-03-31`    },
    { etapa: "Pré-Escola",         turma: "Pré II",      idadeAlvo: "5 anos",       inicioISO: `${anoBase - 6}-04-01`, fimISO: `${anoBase - 5}-03-31`    },
    // ── Ensino Fundamental I ──────────────────────
    { etapa: "Ensino Fundamental",  turma: "1º Ano",     idadeAlvo: "6 anos",       inicioISO: `${anoBase - 7}-04-01`, fimISO: `${anoBase - 6}-03-31`    },
    { etapa: "Ensino Fundamental",  turma: "2º Ano",     idadeAlvo: "7 anos",       inicioISO: `${anoBase - 8}-04-01`, fimISO: `${anoBase - 7}-03-31`    },
    { etapa: "Ensino Fundamental",  turma: "3º Ano",     idadeAlvo: "8 anos",       inicioISO: `${anoBase - 9}-04-01`, fimISO: `${anoBase - 8}-03-31`    },
    { etapa: "Ensino Fundamental",  turma: "4º Ano",     idadeAlvo: "9 anos",       inicioISO: `${anoBase - 10}-04-01`,fimISO: `${anoBase - 9}-03-31`    },
    { etapa: "Ensino Fundamental",  turma: "5º Ano",     idadeAlvo: "10 anos",      inicioISO: `${anoBase - 11}-04-01`,fimISO: `${anoBase - 10}-03-31`   },
    // ── Ensino Fundamental II ─────────────────────
    { etapa: "Ensino Fundamental",  turma: "6º Ano",     idadeAlvo: "11 anos",      inicioISO: `${anoBase - 12}-04-01`,fimISO: `${anoBase - 11}-03-31`   },
    { etapa: "Ensino Fundamental",  turma: "7º Ano",     idadeAlvo: "12 anos",      inicioISO: `${anoBase - 13}-04-01`,fimISO: `${anoBase - 12}-03-31`   },
    { etapa: "Ensino Fundamental",  turma: "8º Ano",     idadeAlvo: "13 anos",      inicioISO: `${anoBase - 14}-04-01`,fimISO: `${anoBase - 13}-03-31`   },
    { etapa: "Ensino Fundamental",  turma: "9º Ano",     idadeAlvo: "14 anos",      inicioISO: `${anoBase - 15}-04-01`,fimISO: `${anoBase - 14}-03-31`   },
    // ── Ensino Médio ──────────────────────────────
    { etapa: "Ensino Médio",        turma: "1ª Série",   idadeAlvo: "15 anos",      inicioISO: `${anoBase - 16}-04-01`,fimISO: `${anoBase - 15}-03-31`   },
    { etapa: "Ensino Médio",        turma: "2ª Série",   idadeAlvo: "16 anos",      inicioISO: `${anoBase - 17}-04-01`,fimISO: `${anoBase - 16}-03-31`   },
    { etapa: "Ensino Médio",        turma: "3ª Série",   idadeAlvo: "17 anos",      inicioISO: `${anoBase - 18}-04-01`,fimISO: `${anoBase - 17}-03-31`   },
  ];
}

// ── Cálculo local (sem API) ──────────────────────────────────────────────────

function calcularTurmaLocal(dataNascimento) {
  // Ano base lido do sistema no momento do cálculo
  const anoBase = new Date().getFullYear();
  const tabela  = gerarTabela(anoBase);
  const input   = new Date(dataNascimento + "T00:00:00");

  const encontrado = tabela.find((item) => {
    const inicio = new Date(item.inicioISO + "T00:00:00");
    const fim    = new Date(item.fimISO    + "T00:00:00");
    return input >= inicio && input <= fim;
  });

  if (!encontrado) {
    const dataMaisAntiga = new Date(tabela[tabela.length - 1].inicioISO + "T00:00:00");
    const dataMaisNova   = new Date(tabela[0].fimISO + "T00:00:00");

    let mensagemCustomizada = `A data informada está fora da tabela de referência do ano base ${anoBase}.`;
    
    if (input < dataMaisAntiga) {
      mensagemCustomizada = `Pela data de nascimento informada, o aluno já tem idade superior à 3ª Série e provavelmente já deveria ter concluído o Ensino Médio.`;
    } else if (input > dataMaisNova) {
      mensagemCustomizada = `A data informada é muito recente. A criança ainda não possui a idade mínima para ingressar no Berçário no ano letivo de ${anoBase}.`;
    }

    return {
      encontrado: false,
      anoBase,
      tabela,
      mensagem: mensagemCustomizada,
    };
  }

  return {
    encontrado: true,
    anoBase,
    tabela,
    etapa:     encontrado.etapa,
    turma:     encontrado.turma,
    idadeAlvo: encontrado.idadeAlvo,
    intervalo: `${fmt(encontrado.inicioISO)} a ${fmt(encontrado.fimISO)}`,
  };
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function App() {
  const anoAtual = new Date().getFullYear();

  const [dataNascimento, setDataNascimento] = useState("");
  const [resultado,      setResultado]      = useState(null);
  const [erro,           setErro]           = useState("");
  const [anoBase,        setAnoBase]        = useState(anoAtual);

  const handleDateChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove não-números
    if (val.length > 8) val = val.slice(0, 8);
    
    // Aplica a máscara DD/MM/AAAA
    if (val.length > 4) {
      val = val.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
    } else if (val.length > 2) {
      val = val.replace(/(\d{2})(\d+)/, "$1/$2");
    }
    setDataNascimento(val);
  };

  const calcular = () => {
    if (!dataNascimento || dataNascimento.length !== 10) {
      setErro("Por favor, digite a data completa (DD/MM/AAAA).");
      setResultado(null);
      return;
    }

    const [dia, mes, ano] = dataNascimento.split("/");
    const dataISO = `${ano}-${mes}-${dia}`;
    
    // Valida se a data existe de verdade (ex: 31/02 não existe)
    const d = new Date(dataISO + "T00:00:00");
    if (isNaN(d.getTime())) {
      setErro("Data inexistente. Verifique os valores digitados.");
      setResultado(null);
      return;
    }

    setErro("");
    const data = calcularTurmaLocal(dataISO);
    setResultado(data);

    // Atualiza o ano base com os valores gerados agora
    if (data.anoBase) setAnoBase(data.anoBase);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calcular();
  };

  return (
    <>
      <div className="page">
      {/* ===== LOGO ===== */}
      <div className="logo-wrapper">
        <img
          src="/logoPrefa.png"
          alt="Logo Prefeitura de Garuva-SC"
          className="logo-prefetura"
        />
      </div>

      {/* ===== HERO / FORM CARD ===== */}
      <main className="card" aria-label="Formulário de cálculo de etapa">
        <div className="badge">
          <span className="badge-icon" aria-hidden="true">🎓</span>
          <span>Ano base {anoBase}</span>
        </div>

        <h1 className="title">Calculadora de Etapa Escolar</h1>

        <p className="subtitle">
          Informe a data de nascimento da criança para descobrir a etapa indicada
          conforme a data de corte de <strong>31/03</strong>.
        </p>

        <div className="form-group">
          <label htmlFor="data-nascimento" className="label">
            Data de nascimento
          </label>
          <input
            id="data-nascimento"
            type="tel"
            inputMode="numeric"
            maxLength="10"
            placeholder="DD/MM/AAAA"
            className="input"
            value={dataNascimento}
            onChange={handleDateChange}
            onKeyDown={handleKeyDown}
            aria-describedby="data-hint"
          />
          <span id="data-hint" className="input-hint">
            Apenas digite os números (dia, mês e ano)
          </span>
        </div>

        {erro && (
          <div className="alert-error" role="alert">
            <span aria-hidden="true">⚠️</span> {erro}
          </div>
        )}

        <button
          id="btn-calcular"
          className="btn-primary"
          onClick={calcular}
          aria-label="Calcular etapa"
        >
          Calcular etapa
        </button>

        {/* ===== RESULT CARD ===== */}
        {resultado && (
          <div
            className={`result-card ${resultado.encontrado ? "result-found" : "result-not-found"}`}
            role="region"
            aria-label="Resultado do cálculo"
          >
            {resultado.encontrado ? (
              <>
                <div className="result-header">
                  <span className="result-icon" aria-hidden="true">✅</span>
                  <span className="result-label">Etapa encontrada</span>
                </div>
                <div className="result-turma">{resultado.turma}</div>
                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-item-label">Etapa escolar</span>
                    <span className="result-item-value">{resultado.etapa}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-item-label">Idade alvo em 31/03/{resultado.anoBase}</span>
                    <span className="result-item-value">{resultado.idadeAlvo}</span>
                  </div>
                  <div className="result-item result-item-full">
                    <span className="result-item-label">Nascimento entre</span>
                    <span className="result-item-value">{resultado.intervalo}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="result-header result-header-error">
                <span className="result-icon" aria-hidden="true">ℹ️</span>
                <p className="result-message">{resultado.mensagem}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <p className="calc-note">
        Cálculo baseado na tabela unificada para o ano base {anoBase}, com data de corte em 31/03.
      </p>
    </div>

    {/* ===== FOOTER ===== */}
    <footer className="footer">
      Desenvolvido por cub9 &mdash; SME Garuva-SC | 2026
    </footer>
    </>
  );
}
