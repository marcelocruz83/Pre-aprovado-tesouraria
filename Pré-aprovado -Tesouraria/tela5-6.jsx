// Tela 5 — Conciliação + Tela 6 — Relatórios

function TelaConciliacao() {
  const [syncFilter, setSyncFilter] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const data = window.MOCK_DATA.conciliacao;
  const filtered = data.filter(d => {
    if (syncFilter === 'divergente' && !d.divergencia) return false;
    if (syncFilter === 'sincronizado' && d.divergencia) return false;
    return true;
  });
  const totalSync = filtered.filter(d => !d.divergencia).length;
  const totalDiv = filtered.filter(d => d.divergencia).length;
  const totalNaoSync = filtered.filter(d => d.statusOmie === '—').length;

  return (
    <div>
      <PageHeader title="Conciliação" subtitle="Sincronização entre CondoSuite e Omie" />
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Sincronizadas" value={`${filtered.length ? Math.round(totalSync/filtered.length*100) : 0}%`} color="green" icon="✓" />
        <KPICard label="Divergentes" value={totalDiv} color="orange" icon="⚠" />
        <KPICard label="Não sincronizadas" value={totalNaoSync} color="red" icon="✕" />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterSelect value={syncFilter} onChange={setSyncFilter} options={['divergente','sincronizado']} placeholder="Filtrar sincronização" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>De</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', background: '#fff', color: '#374151' }} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Até</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', background: '#fff', color: '#374151' }} />
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Condomínio','Contrato','Parcela','Status CondoSuite','Status Omie','Divergência','Valor CS','Valor Omie','Ação'].map((h,i) => (
                <th key={i} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={concTd}>{r.condominio}</td>
                <td style={concTd}>{r.contrato}</td>
                <td style={concTd}>{r.parcela}</td>
                <td style={concTd}><StatusBadge status={r.statusCS} small /></td>
                <td style={concTd}>{r.statusOmie === '—' ? <span style={{color:'#9ca3af'}}>—</span> : <StatusBadge status={r.statusOmie} small />}</td>
                <td style={concTd}>
                  {r.divergencia ? <span style={{color:'#dc2626',fontWeight:600,fontSize:12}}>Sim</span> : <span style={{color:'#16a34a',fontSize:12}}>Não</span>}
                </td>
                <td style={{...concTd, fontVariantNumeric: 'tabular-nums'}}>{formatBRL(r.valorCS)}</td>
                <td style={{...concTd, fontVariantNumeric: 'tabular-nums', color: r.valorOmie !== r.valorCS ? '#dc2626' : '#374151'}}>{formatBRL(r.valorOmie)}</td>
                <td style={concTd}>
                  {r.divergencia && <button style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 11, cursor: 'pointer', color: '#2563eb', fontWeight: 500 }}>Sincronizar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const concTd = { padding: '10px 12px', color: '#374151' };

function TelaRelatorios() {
  const [tipoRel, setTipoRel] = React.useState('baixas');
  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Exportação de dados de financiamento" />
      <Tabs tabs={[{id:'baixas',label:'Baixas por período'},{id:'fechamento',label:'Fechamento para cessionário'}]} active={tipoRel} onChange={setTipoRel} />

      {tipoRel === 'baixas' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <FilterSelect value="" onChange={()=>{}} options={['CondoConta','Quista','Vert']} placeholder="Condomínio" />
            <FilterSelect value="" onChange={()=>{}} options={['Integral','Parcial']} placeholder="Tipo de baixa" />
            <FilterSelect value="" onChange={()=>{}} options={['Ativo','Em atraso','Pago']} placeholder="Status" />
            <input type="date" style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }} />
            <input type="date" style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Condomínio','Contrato','Parcela','Vencimento','Pagamento','Valor original','Encargos','Valor pago','Saldo residual','Tipo','Operador'].map((h,i) => (
                    <th key={i} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 10, textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Residencial Aurora','CCB-2026-001234','003/012','15/01/2026','15/03/2026','R$ 12.500','R$ 0','R$ 12.500','R$ 0','Integral','Sistema'],
                  ['Edifício Monte Verde','CCB-2026-001235','006/024','15/03/2026','10/04/2026','R$ 10.416,67','R$ 0','R$ 5.000','R$ 5.416,67','Parcial','Júlia Santos'],
                  ['Vila dos Ipês','CCB-2026-001238','010/018','15/07/2026','12/07/2026','R$ 4.444,44','R$ 0','R$ 4.444,44','R$ 0','Integral','Sistema'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {row.map((cell, j) => <td key={j} style={{ padding: '10px 10px', color: '#374151', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {['CSV','XLSX','PDF'].map(f => (
              <button key={f} style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid #d1d5db', background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#374151', fontWeight: 500 }}>
                Exportar {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {tipoRel === 'fechamento' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <FilterSelect value="" onChange={()=>{}} options={['CondoConta','Quista','Vert']} placeholder="Carteira / Fundo" />
            <input type="month" style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Carteira','Data repasse','Contratos','Valor repassado','Saldo residual pendente'].map((h,i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 10.5, textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['CondoConta','15/03/2026','3','R$ 45.000,00','R$ 112.500,00'],
                  ['Quista','15/03/2026','2','R$ 25.416,67','R$ 100.000,00'],
                  ['Vert','15/03/2026','1','R$ 13.888,89','R$ 486.111,11'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {row.map((cell, j) => <td key={j} style={{ padding: '10px 14px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {['CSV','XLSX','PDF'].map(f => (
              <button key={f} style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid #d1d5db', background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#374151', fontWeight: 500 }}>
                Exportar {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

window.TelaConciliacao = TelaConciliacao;
window.TelaRelatorios = TelaRelatorios;
