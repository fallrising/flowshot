import "./styles.css";

export function App() {
  return (
    <main className="app-shell">
      <section className="welcome" aria-labelledby="flowshot-title">
        <p className="eyebrow">Local-first Markdown workspace</p>
        <h1 id="flowshot-title">Flowshot</h1>
        <p className="summary">
          Read your documents and keep durable annotations without changing the
          Markdown you own.
        </p>

        <div className="foundation-status" aria-labelledby="status-title">
          <h2 id="status-title">Foundation in progress</h2>
          <p>The desktop shell is ready for its first typed command.</p>
        </div>
      </section>
    </main>
  );
}
