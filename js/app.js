/* 앱 루트 */
(function () {
  const { html, useReveal, useToast } = UI;
  const S = SECTIONS;

  function App() {
    const [toast, toastNode] = useToast();
    useReveal();
    return html`
      <${React.Fragment}>
        <${S.Nav} />
        <main>
          <${S.Hero} />
          <${S.Why} />
          <${S.Principle} />
          <${S.Solution} />
          <${S.Quality} />
          <${S.Demo} toast=${toast} />
          <${S.WhyDaangn} />
          <${S.WhyWV} />
          <${S.Trust} />
          <${S.Value} />
          <${S.Operation} />
          <${S.Shipping} />
          <${S.Pilot} />
          <${S.Closing} toast=${toast} />
        </main>
        <${S.Footer} />
        ${toastNode}
      <//>`;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
