

export default async function DivingSnorkelingPage({
    params,
  }: {
    params: { locale: string };
  }) {

    const [{ locale }] = await Promise.all([
        params,
  
    ]);
  return (
    <div>
      <h1>Diving & Snorkeling</h1>
    </div>
  );
}