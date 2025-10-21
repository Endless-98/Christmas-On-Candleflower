import React from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function App() {
  const [health, setHealth] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [name, setName] = React.useState('');

  const refresh = React.useCallback(() => {
    fetch(`${API_BASE}/api/items`).then(r => r.json()).then(setItems).catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/health`).then(r => r.json()).then(setHealth).catch(() => {});
    refresh();
  }, [refresh]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch(`${API_BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setName('');
    refresh();
  }

  return (
    <div className="container">
      <header>
        <h1>Christmas On Candleflower</h1>
        <p className="tag">MERN starter deployed in your AWS org</p>
      </header>

      <section className="status">
        <div>
          <strong>API:</strong> {health?.ok ? 'online' : 'checking...'}
        </div>
        <div className="muted">API base: {API_BASE}</div>
      </section>

      <section>
        <form onSubmit={onSubmit} className="add-form">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Add an item..."
          />
          <button type="submit">Add</button>
        </form>

        <ul className="items">
          {items.map(i => (
            <li key={i._id}>{i.name} <span className="muted">({new Date(i.createdAt).toLocaleString()})</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
