export default function handler(_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void }; json: (body: unknown) => void }) {
  res.status(200).json({
    status: 'ok',
    app: 'Plataforma Carlos Búrigo',
    runtime: 'vercel',
    timestamp: new Date().toISOString(),
  });
}
