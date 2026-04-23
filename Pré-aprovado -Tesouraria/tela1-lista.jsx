// Tela 1 — Lista de Financiamentos
function TelaLista({ onSelectCond, onNavigate }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [carteiraFilter, setCarteiraFilter] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const data = window.MOCK_DATA.condominios;

  const filtered = data.filter(c => {
    if (search && !c.nome.toLowerCase().includes(search.toLowerCase()) && !c.cnpj.includes(search)) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (carteiraFilter && c.carteira !== carteiraFilter) return false;
    if (dateFrom && c.proximoVencimento && c.proximoVencimento < dateFrom) return false;
    if (dateTo && c.proximoVencimento && c.proximoVencimento > dateTo) return false;
    return true;
  });

  const ativos = filtered.filter(c => c.status === 'Ativo').length;
  const volumeAberto = filtered.filter(c => c.status !== 'Encerrado').reduce((s, c) => s + c.saldoResidual, 0);
  const emAtraso = filtered.filter(c => c.status === 'Em atraso').length;
  const comResidual = filtered.filter(c => c.saldoResidual > 0 && c.status !== 'Encerrado').length;

  return (
    <div>
      <PageHeader title="Financiamentos / Pré-aprovado" subtitle="Gestão de quitação de parcelas de financiamento" />
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPICard label="Contratos ativos" value={ativos} color="blue" icon="📄" />
        <KPICard label="Volume em aberto" value={formatBRL(volumeAberto)} color="green" icon="💰" />
        <KPICard label="Contratos em atraso" value={emAtraso} color="red" icon="⏰" />
        <KPICard label="Com saldo residual" value={comResidual} color="orange" icon="📌" />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}><FilterInput value={search} onChange={setSearch} placeholder="Buscar por condomínio ou CNPJ..." /></div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['Ativo','Em atraso','Encerrado','Bloqueado']} placeholder="Status" />
        <FilterSelect value={carteiraFilter} onChange={setCarteiraFilter} options={['CondoConta','Quista','Vert']} placeholder="Carteira" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>De</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={dateInputStyle} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Até</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={dateInputStyle} />
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Condomínio','Contrato / CCB','Carteira','Valor financiado','Parcelas','Próx. vencimento','Status','Saldo residual',''].map((h,i) => (
                <th key={i} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                onClick={() => onSelectCond(c.id)}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 500, color: '#111827' }}>{c.nome}</div>
                  <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{c.cnpj}</div>
                </td>
                <td style={{ padding: '12px 14px', color: '#374151' }}>{c.contrato}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 500, background: c.carteira === 'CondoConta' ? '#eff6ff' : c.carteira === 'Quista' ? '#faf5ff' : '#f0fdf4', color: c.carteira === 'CondoConta' ? '#2563eb' : c.carteira === 'Quista' ? '#9333ea' : '#16a34a' }}>{c.carteira}</span>
                </td>
                <td style={{ padding: '12px 14px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(c.valorTotal)}</td>
                <td style={{ padding: '12px 14px', color: '#374151' }}>{c.parcelasPagas}/{c.parcelasTotal}</td>
                <td style={{ padding: '12px 14px', color: '#374151' }}>{c.proximoVencimento ? formatDate(c.proximoVencimento) : '—'}</td>
                <td style={{ padding: '12px 14px' }}><StatusBadge status={c.status} small /></td>
                <td style={{ padding: '12px 14px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(c.saldoResidual)}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#2563eb', fontWeight: 500, whiteSpace: 'nowrap' }}>Ver detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Nenhum financiamento encontrado.</div>}
      </div>
    </div>
  );
}

const dateInputStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', background: '#fff', color: '#374151' };

window.TelaLista = TelaLista;
