export default async function FaqPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }] = await Promise.all([params]);
  return (
    <div>
      <h1>FAQ</h1>
    </div>
  );
}
