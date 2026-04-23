// Tela 3 — Modal Realizar Cobrança
function TelaCobranca({ cond, parcela, onClose, onSuccess }) {
  const [juros, setJuros] = React.useState(parcela.juros);
  const [multa, setMulta] = React.useState(parcela.multa);
  const [desconto, setDesconto] = React.useState(0);
  const [baixarOmie, setBaixarOmie] = React.useState(true);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [tipoCobranca, setTipoCobranca] = React.useState(null);
  const [valorParcial, setValorParcial] = React.useState(cond.saldoConta);

  const valorTotal = parcela.valorOriginal + juros + multa - desconto - parcela.valorPago;
  const saldoConta = cond.saldoConta;
  const isIntegral = saldoConta >= valorTotal;
  const isParcial = saldoConta > 0 && saldoConta < valorTotal;
  const semSaldo = saldoConta === 0;

  const handleConfirm = () => {
    setShowConfirm(false);
    onSuccess(tipoCobranca === 'sem_cobranca' ? 'Baixa sem cobrança registrada com sucesso.' : 'Cobrança realizada com sucesso!');
  };

  const initConfirm = (tipo) => {
    setTipoCobranca(tipo);
    setShowConfirm(true);
  };

  const valorDebito = tipoCobranca === 'integral' ? valorTotal : tipoCobranca === 'parcial' ? Math.min(valorParcial, saldoConta) : 0;
  const saldoResApos = valorTotal - valorDebito;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, overflowY: 'auto', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 620, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Realizar Cobrança</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af', padding: 4 }}>✕</button>
          </div>

          {/* Info block */}
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <div><span style={{ color: '#6b7280' }}>Condomínio:</span> <strong>{cond.nome}</strong></div>
            <div><span style={{ color: '#6b7280' }}>CNPJ:</span> <strong>{cond.cnpj}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Parcela:</span> <strong>{parcela.numero}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Vencimento:</span> <strong>{formatDate(parcela.vencimento)}</strong></div>
            {parcela.diasAtraso > 0 && <div><span style={{ color: '#6b7280' }}>Dias de atraso:</span> <strong style={{ color: '#dc2626' }}>{parcela.diasAtraso} dias</strong></div>}
            <div><span style={{ color: '#6b7280' }}>Saldo em conta:</span> <strong style={{ color: saldoConta > 0 ? '#16a34a' : '#dc2626' }}>{formatBRL(saldoConta)}</strong></div>
          </div>

          {cond.contaBloqueada && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Conta Bloqueada — Débito não permitido</div>
                <div style={{ fontSize: 12, color: '#b91c1c' }}>{cond.motivoBloqueio}</div>
              </div>
            </div>
          )}

          {/* Campos financeiros */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 12px' }}>Valores da cobrança</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldReadonly label="Valor original" value={formatBRL(parcela.valorOriginal)} />
              <FieldEditable label="Juros calculados" value={juros} onChange={setJuros} hint="Edite para isenção" />
              <FieldEditable label="Multa calculada" value={multa} onChange={setMulta} hint="Edite para isenção" />
              <FieldEditable label="Desconto" value={desconto} onChange={setDesconto} />
              {parcela.valorPago > 0 && <FieldReadonly label="Já pago" value={formatBRL(parcela.valorPago)} color="#16a34a" />}
              <div style={{ gridColumn: '1/-1', background: '#f0f9ff', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1e40af' }}>Valor total a cobrar</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1e40af', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(Math.max(0, valorTotal))}</span>
              </div>
            </div>
          </div>

          {/* Lógica de baixa */}
          {!cond.contaBloqueada && (
            <div style={{ marginBottom: 24 }}>
              {isIntegral && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 13, color: '#15803d', fontWeight: 500, marginBottom: 10 }}>✓ Saldo suficiente para cobrança integral</div>
                  <button onClick={() => initConfirm('integral')} style={primaryBtnS}>Realizar Cobrança Integral</button>
                </div>
              )}
              {isParcial && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 13, color: '#ea580c', fontWeight: 500, marginBottom: 6 }}>⚠ Saldo insuficiente para cobrança integral</div>
                  <div style={{ fontSize: 12, color: '#9a3412', marginBottom: 12 }}>Deseja realizar baixa parcial?</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Valor do débito parcial</label>
                      <input type="number" value={valorParcial} onChange={e => setValorParcial(Math.min(Number(e.target.value), saldoConta))} style={inputS} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Saldo residual após baixa</label>
                      <div style={{ padding: '9px 12px', fontSize: 14, fontWeight: 600, color: '#ea580c', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(valorTotal - Math.min(valorParcial, saldoConta))}</div>
                    </div>
                  </div>
                  <button onClick={() => initConfirm('parcial')} style={{...primaryBtnS, background: '#ea580c'}}>Realizar Cobrança Parcial</button>
                </div>
              )}
              {semSaldo && (
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginBottom: 10 }}>Sem saldo disponível para débito</div>
                  <button onClick={() => initConfirm('sem_cobranca')} style={{...primaryBtnS, background: '#6b7280'}}>Efetuar Baixa sem Cobrança</button>
                </div>
              )}
              {!semSaldo && (
                <button onClick={() => initConfirm('sem_cobranca')} style={{ marginTop: 10, padding: '8px 16px', borderRadius: 7, border: '1px solid #d1d5db', background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#6b7280' }}>
                  Efetuar baixa sem cobrança (apenas registrar)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Checkbox Omie */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '0 0 14px 14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
            <input type="checkbox" checked={baixarOmie} onChange={e => setBaixarOmie(e.target.checked)} />
            Baixar também no Omie
          </label>
        </div>
      </div>

      {/* Confirmation */}
      <ConfirmModal open={showConfirm} title="Confirmar operação" onCancel={() => setShowConfirm(false)} onConfirm={handleConfirm} confirmLabel="Confirmar">
        <div style={{ display: 'grid', gap: 8 }}>
          <div><strong>Condomínio:</strong> {cond.nome}</div>
          <div><strong>Parcela:</strong> {parcela.numero}</div>
          <div><strong>Tipo:</strong> {tipoCobranca === 'integral' ? 'Cobrança integral' : tipoCobranca === 'parcial' ? 'Cobrança parcial' : 'Baixa sem cobrança'}</div>
          <div><strong>Valor a debitar:</strong> {formatBRL(valorDebito)}</div>
          {saldoResApos > 0 && <div><strong>Saldo residual após:</strong> {formatBRL(saldoResApos)}</div>}
          <div><strong>Sincronizar Omie:</strong> {baixarOmie ? 'Sim' : 'Não'}</div>
        </div>
      </ConfirmModal>
    </div>
  );
}

function FieldReadonly({ label, value, color }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ padding: '9px 12px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 14, fontWeight: 500, color: color || '#111827', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function FieldEditable({ label, value, onChange, hint }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label} {hint && <span style={{ color: '#9ca3af' }}>({hint})</span>}</label>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} step="0.01" min="0" style={inputS} />
    </div>
  );
}

const inputS = { padding: '9px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, width: '100%', boxSizing: 'border-box', fontVariantNumeric: 'tabular-nums', outline: 'none' };
const primaryBtnS = { padding: '10px 22px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' };

window.TelaCobranca = TelaCobranca;
