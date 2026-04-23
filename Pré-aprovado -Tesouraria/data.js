// Mock data for the prototype
const MOCK_DATA = {
  condominios: [
    { id: 1, nome: "Residencial Aurora", cnpj: "12.345.678/0001-90", contrato: "CCB-2026-001234", carteira: "CondoConta", valorTotal: 150000, parcelasPagas: 3, parcelasTotal: 12, proximoVencimento: "2026-05-15", status: "Ativo", saldoResidual: 112500, saldoConta: 45000, contaBloqueada: false },
    { id: 2, nome: "Edifício Monte Verde", cnpj: "23.456.789/0001-01", contrato: "CCB-2026-001235", carteira: "Quista", valorTotal: 250000, parcelasPagas: 5, parcelasTotal: 24, proximoVencimento: "2026-05-01", status: "Em atraso", saldoResidual: 197916.67, saldoConta: 8500, contaBloqueada: false },
    { id: 3, nome: "Condomínio Solar", cnpj: "34.567.890/0001-12", contrato: "CCB-2026-001236", carteira: "CondoConta", valorTotal: 30000, parcelasPagas: 7, parcelasTotal: 7, proximoVencimento: null, status: "Encerrado", saldoResidual: 0, saldoConta: 12000, contaBloqueada: false },
    { id: 4, nome: "Torres do Lago", cnpj: "45.678.901/0001-23", contrato: "CCB-2026-001237", carteira: "Vert", valorTotal: 500000, parcelasPagas: 1, parcelasTotal: 36, proximoVencimento: "2026-04-20", status: "Em atraso", saldoResidual: 486111.11, saldoConta: 0, contaBloqueada: true, motivoBloqueio: "Inadimplência superior a 90 dias" },
    { id: 5, nome: "Vila dos Ipês", cnpj: "56.789.012/0001-34", contrato: "CCB-2026-001238", carteira: "CondoConta", valorTotal: 80000, parcelasPagas: 10, parcelasTotal: 18, proximoVencimento: "2026-06-01", status: "Ativo", saldoResidual: 35555.56, saldoConta: 22000, contaBloqueada: false },
    { id: 6, nome: "Parque das Flores", cnpj: "67.890.123/0001-45", contrato: "CCB-2026-001239", carteira: "Quista", valorTotal: 120000, parcelasPagas: 2, parcelasTotal: 12, proximoVencimento: "2026-05-10", status: "Ativo", saldoResidual: 100000, saldoConta: 15000, contaBloqueada: false },
    { id: 7, nome: "Edifício Primavera", cnpj: "78.901.234/0001-56", contrato: "CCB-2026-001240", carteira: "Vert", valorTotal: 200000, parcelasPagas: 0, parcelasTotal: 24, proximoVencimento: "2026-04-25", status: "Bloqueado", saldoResidual: 200000, saldoConta: 0, contaBloqueada: true, motivoBloqueio: "Pendência documental" },
  ],
  // Generate parcelas for a given condominio
  getParcelas: function(condId) {
    const cond = this.condominios.find(c => c.id === condId);
    if (!cond) return [];
    const valorParcela = cond.valorTotal / cond.parcelasTotal;
    const parcelas = [];
    const startDate = new Date('2025-10-15');
    for (let i = 0; i < cond.parcelasTotal; i++) {
      const venc = new Date(startDate);
      venc.setMonth(venc.getMonth() + i);
      const isPago = i < cond.parcelasPagas;
      const isAtraso = !isPago && venc < new Date('2026-04-22');
      const isParcial = (condId === 2 && i === cond.parcelasPagas); // one partial for Monte Verde
      const juros = isAtraso ? valorParcela * 0.02 * Math.ceil((new Date('2026-04-22') - venc) / (1000*60*60*24*30)) : 0;
      const multa = isAtraso ? valorParcela * 0.02 : 0;
      const valorPago = isPago ? valorParcela : (isParcial ? 5000 : 0);
      const saldoRes = valorParcela + juros + multa - valorPago;
      const statusOmie = isPago ? 'sincronizado' : (isParcial ? 'divergente' : (Math.random() > 0.3 ? 'sincronizado' : 'nao_sincronizado'));
      let status = 'A vencer';
      if (isPago) status = 'Pago';
      else if (isParcial) status = 'Parcialmente pago';
      else if (isAtraso) status = 'Em atraso';
      else if (cond.contaBloqueada) status = 'Bloqueado';
      parcelas.push({
        id: `${condId}-${i+1}`,
        numero: `${String(i+1).padStart(3,'0')}/${String(cond.parcelasTotal).padStart(3,'0')}`,
        vencimento: venc.toISOString().split('T')[0],
        valorOriginal: valorParcela,
        juros: juros,
        multa: multa,
        valorTotal: valorParcela + juros + multa,
        valorPago: valorPago,
        saldoResidual: Math.max(0, saldoRes),
        status: status,
        statusOmie: statusOmie,
        diasAtraso: isAtraso ? Math.ceil((new Date('2026-04-22') - venc) / (1000*60*60*24)) : 0
      });
    }
    return parcelas;
  },
  getHistorico: function(parcelaId) {
    const [condId, parcelaNum] = parcelaId.split('-').map(Number);
    const cond = this.condominios.find(c => c.id === condId);
    if (!cond) return [];
    const valorParcela = cond.valorTotal / cond.parcelasTotal;
    const eventos = [];
    if (parcelaNum <= cond.parcelasPagas) {
      eventos.push({ data: '2026-03-15 10:32:00', tipo: 'Automática', operador: 'Sistema', valorDebitado: valorParcela, juros: 0, multa: 0, desconto: 0, saldoResidualApos: 0, statusOmie: 'sincronizado' });
    }
    if (condId === 2 && parcelaNum === cond.parcelasPagas + 1) {
      eventos.push({ data: '2026-04-10 14:20:00', tipo: 'Manual', operador: 'Júlia Santos', valorDebitado: 5000, juros: 0, multa: 0, desconto: 0, saldoResidualApos: valorParcela - 5000, statusOmie: 'divergente' });
    }
    return eventos;
  },
  conciliacao: [
    { condominio: "Residencial Aurora", contrato: "CCB-2026-001234", parcela: "003/012", statusCS: "Pago", statusOmie: "Pago", divergencia: false, valorCS: 12500, valorOmie: 12500 },
    { condominio: "Edifício Monte Verde", contrato: "CCB-2026-001235", parcela: "006/024", statusCS: "Parcialmente pago", statusOmie: "Em aberto", divergencia: true, valorCS: 5000, valorOmie: 0 },
    { condominio: "Edifício Monte Verde", contrato: "CCB-2026-001235", parcela: "007/024", statusCS: "Em atraso", statusOmie: "Em aberto", divergencia: false, valorCS: 0, valorOmie: 0 },
    { condominio: "Torres do Lago", contrato: "CCB-2026-001237", parcela: "002/036", statusCS: "Em atraso", statusOmie: "—", divergencia: true, valorCS: 13888.89, valorOmie: 0 },
    { condominio: "Vila dos Ipês", contrato: "CCB-2026-001238", parcela: "010/018", statusCS: "Pago", statusOmie: "Pago", divergencia: false, valorCS: 4444.44, valorOmie: 4444.44 },
    { condominio: "Parque das Flores", contrato: "CCB-2026-001239", parcela: "003/012", statusCS: "A vencer", statusOmie: "—", divergencia: true, valorCS: 10000, valorOmie: 0 },
    { condominio: "Edifício Primavera", contrato: "CCB-2026-001240", parcela: "001/024", statusCS: "Bloqueado", statusOmie: "—", divergencia: true, valorCS: 8333.33, valorOmie: 0 },
  ]
};
window.MOCK_DATA = MOCK_DATA;
