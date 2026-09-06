export function PageBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
