// Tela 2 — Detalhe do Financiamento
function TelaDetalhe({ condId, onBack, onCobranca, onHistorico }) {
  const cond = window.MOCK_DATA.condominios.find(c => c.id === condId);
  const parcelas = window.MOCK_DATA.getParcelas(condId);
  if (!cond) return null;

  const totalPago = parcelas.reduce((s, p) => s + p.valorPago, 0);
  const saldoResTotal = parcelas.reduce((s, p) => s + p.saldoResidual, 0);
  const startDate = '2025-10-15';
  const endDate = new Date('2025-10-15');
  endDate.setMonth(endDate.getMonth() + cond.parcelasTotal - 1);

  return (
    <div>
      <PageHeader
        title={cond.nome}
        subtitle={cond.cnpj}
        breadcrumbs={[
          { label: 'Financiamentos', onClick: onBack },
          { label: cond.nome }
        ]}
        onBreadcrumb={onBack}
      />
      {/* Header info row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Contrato: <strong style={{ color: '#111827' }}>{cond.contrato}</strong></div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Carteira: <strong style={{ color: '#111827' }}>{cond.carteira}</strong></div>
          <StatusBadge status={cond.status} />
          <div style={{ fontSize: 13, color: '#6b7280' }}>Saldo em conta: <strong style={{ color: cond.saldoConta > 0 ? '#16a34a' : '#dc2626' }}>{formatBRL(cond.saldoConta)}</strong></div>
        </div>
        {cond.contaBloqueada && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px' }}>
            <span style={{ color: '#dc2626', fontSize: 15 }}>🔒</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>Conta Bloqueada</div>
              <div style={{ fontSize: 11, color: '#b91c1c' }}>{cond.motivoBloqueio}</div>
            </div>
          </div>
        )}
      </div>

      {/* Resumo do Contrato card */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#374151' }}>Resumo do Contrato</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {[
            ['Valor financiado', formatBRL(cond.valorTotal)],
            ['Parcelas', `${cond.parcelasPagas} / ${cond.parcelasTotal}`],
            ['Total pago', formatBRL(totalPago)],
            ['Saldo residual', formatBRL(saldoResTotal)],
            ['Início', formatDate(startDate)],
            ['Fim previsto', formatDate(endDate.toISOString().split('T')[0])],
          ].map(([label, val], i) => (
            <div key={i}>
              <div style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Parcelas */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#374151' }}>Parcelas</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Parcela','Vencimento','Valor original','Juros','Multa','Valor total','Pago','Saldo residual','Status','Omie','Ações'].map((h,i) => (
                  <th key={i} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcelas.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdS}>{p.numero}</td>
                  <td style={tdS}>{formatDate(p.vencimento)}</td>
                  <td style={{...tdS, fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.valorOriginal)}</td>
                  <td style={{...tdS, color: p.juros > 0 ? '#dc2626' : '#9ca3af', fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.juros)}</td>
                  <td style={{...tdS, color: p.multa > 0 ? '#dc2626' : '#9ca3af', fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.multa)}</td>
                  <td style={{...tdS, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.valorTotal)}</td>
                  <td style={{...tdS, color: '#16a34a', fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.valorPago)}</td>
                  <td style={{...tdS, fontVariantNumeric: 'tabular-nums'}}>{formatBRL(p.saldoResidual)}</td>
                  <td style={tdS}><StatusBadge status={p.status} small /></td>
                  <td style={tdS}><OmieStatus status={p.statusOmie} /></td>
                  <td style={{...tdS, whiteSpace: 'nowrap'}}>
                    {p.status !== 'Pago' && p.status !== 'Bloqueado' && (
                      <button onClick={() => onCobranca(cond, p)} style={actionBtnS}>Realizar cobrança</button>
                    )}
                    {p.status === 'Bloqueado' && (
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>Conta bloqueada</span>
                    )}
                    <button onClick={() => onHistorico(cond, p)} style={{...actionBtnS, color: '#6b7280', borderColor: '#e5e7eb', marginLeft: 4}}>Histórico</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tdS = { padding: '10px 12px', color: '#374151', fontSize: 12.5 };
const actionBtnS = { padding: '4px 10px', borderRadius: 5, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 11, cursor: 'pointer', color: '#2563eb', fontWeight: 500 };

window.TelaDetalhe = TelaDetalhe;
