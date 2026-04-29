// Pages Router stub — overrides the auto-generated /_error.js that was
// failing static prerender with `Cannot read properties of null (reading
// 'useContext')`. App Router's not-found.tsx + error.tsx handle the actual
// 404/500 UX; this stub exists only to satisfy Next.js' Pages Router
// compatibility layer with a static, hook-free component.
//
// Static rendering: no hooks, no context, no client features.

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <h1>{statusCode ?? "Error"}</h1>
      <p>An unexpected error occurred. <a href="/">Go home</a>.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode?: number } }) => {
  const statusCode = res ? res.statusCode : err?.statusCode ?? 404;
  return { statusCode };
};

export default Error;
