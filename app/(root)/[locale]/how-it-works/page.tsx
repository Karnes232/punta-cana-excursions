

export default async function HowItWorksPage({
    params,
  }: {
    params: { locale: string };
  }) {

    const [{ locale }] = await Promise.all([
        params,
  
    ]);
  return (
    <div>
      <h1>How It Works</h1>
    </div>
  );
}