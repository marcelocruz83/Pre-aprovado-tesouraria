// Tela 4 — Histórico de Baixas
function TelaHistorico({ cond, parcela, onClose }) {
  const eventos = window.MOCK_DATA.getHistorico(parcela.id);
  const totalPago = eventos.reduce((s, e) => s + e.valorDebitado, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 700, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Histórico de Baixas</h2>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{cond.nome} — Parcela {parcela.numero}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
          </div>

          {/* Totais */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
            <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Total pago</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#15803d', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(totalPago)}</div>
            </div>
            <div style={{ flex: 1, background: '#fff7ed', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Saldo residual</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ea580c', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(parcela.saldoResidual)}</div>
            </div>
            <div style={{ flex: 1, background: '#f9fafb', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Baixas realizadas</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{eventos.length}</div>
            </div>
          </div>

          {/* Timeline */}
          {eventos.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Nenhuma baixa registrada para esta parcela.</div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: '#e5e7eb' }} />
              {eventos.map((ev, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 20, paddingLeft: 20 }}>
                  <div style={{ position: 'absolute', left: -20, top: 4, width: 14, height: 14, borderRadius: '50%', background: ev.tipo === 'Automática' ? '#2563eb' : '#ea580c', border: '3px solid #fff', boxShadow: '0 0 0 2px #e5e7eb' }} />
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{ev.data}</span>
                      <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 4, background: ev.tipo === 'Automática' ? '#eff6ff' : '#fff7ed', color: ev.tipo === 'Automática' ? '#2563eb' : '#ea580c', fontWeight: 500 }}>{ev.tipo}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, fontSize: 12.5 }}>
                      <div><span style={{ color: '#9ca3af' }}>Operador:</span> <strong>{ev.operador}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Debitado:</span> <strong style={{ color: '#15803d' }}>{formatBRL(ev.valorDebitado)}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Juros:</span> <strong>{formatBRL(ev.juros)}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Multa:</span> <strong>{formatBRL(ev.multa)}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Desconto:</span> <strong>{formatBRL(ev.desconto)}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Saldo após:</span> <strong>{formatBRL(ev.saldoResidualApos)}</strong></div>
                      <div><span style={{ color: '#9ca3af' }}>Omie:</span> <OmieStatus status={ev.statusOmie} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.TelaHistorico = TelaHistorico;
