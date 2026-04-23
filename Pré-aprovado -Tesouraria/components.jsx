// Shared components and utilities

const formatBRL = (v) => v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (d) => { if (!d) return '—'; const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0]}`; };

// ── Collapsed Sidebar (minimal) ──
function SidebarMin({ onCollapse }) {
  const menuItems = [
    { icon: '📋', label: 'Documentos' }, { icon: '🏦', label: 'Contas' }, { icon: '📊', label: 'Gestão de Recebíveis' },
    { icon: '💰', label: 'Financeiro' }, { icon: '💳', label: 'Crédito', active: true },
    { icon: '🏢', label: 'Entidades do Sistema' }, { icon: '📧', label: 'Comunicação' },
  ];
  return (
    <div style={{ width: 56, minWidth: 56, background: '#1a2332', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>CS</div>
      {menuItems.map((m, i) => (
        <div key={i} title={m.label} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginBottom: 4, cursor: 'pointer', fontSize: 16, background: m.active ? '#2563eb' : 'transparent' }}>{m.icon}</div>
      ))}
    </div>
  );
}

// ── Top bar ──
function TopBar() {
  return (
    <div style={{ height: 56, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a2332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>JS</div>
        <span style={{ fontSize: 13.5, color: '#374151' }}>Júlia Santos</span>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>▼</span>
      </div>
    </div>
  );
}

// ── KPI Card ──
function KPICard({ label, value, color, icon }) {
  const bgMap = { blue: '#eff6ff', green: '#f0fdf4', red: '#fef2f2', orange: '#fff7ed', purple: '#faf5ff' };
  const fgMap = { blue: '#2563eb', green: '#16a34a', red: '#dc2626', orange: '#ea580c', purple: '#9333ea' };
  return (
    <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>{value}</div>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bgMap[color] || bgMap.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: fgMap[color] || fgMap.blue }}>
        {icon}
      </div>
    </div>
  );
}

// ── Status Badge ──
function StatusBadge({ status, small }) {
  const map = {
    'Ativo': { bg: '#dcfce7', color: '#15803d' },
    'Em atraso': { bg: '#fef2f2', color: '#dc2626' },
    'Encerrado': { bg: '#f3f4f6', color: '#6b7280' },
    'Bloqueado': { bg: '#fef2f2', color: '#dc2626' },
    'A vencer': { bg: '#eff6ff', color: '#2563eb' },
    'Pago': { bg: '#dcfce7', color: '#15803d' },
    'Parcialmente pago': { bg: '#fff7ed', color: '#ea580c' },
    'Em aberto': { bg: '#fff7ed', color: '#ea580c' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ display: 'inline-block', padding: small ? '2px 8px' : '3px 10px', borderRadius: 20, fontSize: small ? 11 : 12, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ── Omie Status Icon ──
function OmieStatus({ status }) {
  if (status === 'sincronizado') return <span style={{color: '#16a34a', fontSize: 13}}>✅ Sincronizado</span>;
  if (status === 'divergente') return <span style={{color: '#ea580c', fontSize: 13}}>⚠️ Divergente</span>;
  return <span style={{color: '#dc2626', fontSize: 13}}>❌ Não sincronizado</span>;
}

// ── Tabs ──
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '10px 20px', fontSize: 13.5, fontWeight: active === t.id ? 600 : 400,
          color: active === t.id ? '#111827' : '#6b7280', background: 'none', border: 'none',
          borderBottom: active === t.id ? '2px solid #2563eb' : '2px solid transparent',
          cursor: 'pointer', transition: 'all 0.15s'
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Confirmation Modal ──
function ConfirmModal({ open, title, children, onConfirm, onCancel, confirmLabel, confirmColor }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', maxWidth: 520, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 600, color: '#111827' }}>{title}</h3>
        <div style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6 }}>{children}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#374151' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: confirmColor || '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{confirmLabel || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ──
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === 'success' ? '#dcfce7' : '#fef2f2';
  const color = type === 'success' ? '#15803d' : '#dc2626';
  const icon = type === 'success' ? '✓' : '✕';
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [message]);
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, background: bg, color, padding: '12px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 500, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
      <span style={{ fontWeight: 700, fontSize: 15 }}>{icon}</span> {message}
    </div>
  );
}

// ── Filter input ──
function FilterInput({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', width: '100%', background: '#fff', color: '#374151' }} />
  );
}

// ── Select ──
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, outline: 'none', background: '#fff', color: value ? '#374151' : '#9ca3af', minWidth: 160 }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Page header ──
function PageHeader({ title, subtitle, breadcrumbs, onBreadcrumb }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {breadcrumbs && (
        <div style={{ display: 'flex', gap: 6, fontSize: 12.5, color: '#9ca3af', marginBottom: 8 }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              <span style={{ cursor: b.onClick ? 'pointer' : 'default', color: b.onClick ? '#2563eb' : undefined }} onClick={b.onClick}>{b.label}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>{title}</h1>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#6b7280' }}>{subtitle}</p>}
    </div>
  );
}

// ── Main Tabs (top-level like the screenshots) ──
function MainTabs({ active, onChange }) {
  const tabs = ['Visão Geral', 'Fila C&R', 'Condomínios', 'Contratos'];
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb' }}>
      {tabs.map(t => {
        const id = t.toLowerCase().replace(/[^a-z]/g, '');
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            padding: '11px 22px', fontSize: 13.5, fontWeight: isActive ? 600 : 400,
            color: isActive ? '#111827' : '#6b7280', background: 'none', border: 'none',
            borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s'
          }}>{t}</button>
        );
      })}
    </div>
  );
}

// ── Sub tabs within Contratos ──
function SubTabs({ active, onChange }) {
  const tabs = [{id:'lista',label:'Lista de Contratos'},{id:'conciliacao',label:'Conciliação'},{id:'relatorios',label:'Relatórios'}];
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '7px 16px', borderRadius: 20, fontSize: 12.5, fontWeight: active === t.id ? 600 : 400,
          color: active === t.id ? '#fff' : '#6b7280',
          background: active === t.id ? '#2563eb' : '#f3f4f6',
          border: 'none', cursor: 'pointer', transition: 'all 0.15s'
        }}>{t.label}</button>
      ))}
    </div>
  );
}

Object.assign(window, { formatBRL, formatDate, SidebarMin, TopBar, KPICard, StatusBadge, OmieStatus, Tabs, ConfirmModal, Toast, FilterInput, FilterSelect, PageHeader, MainTabs, SubTabs });
