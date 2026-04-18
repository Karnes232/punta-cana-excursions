export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }] = await Promise.all([params]);
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
