export default async function TermsOfServicePage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }] = await Promise.all([params]);
  return (
    <div>
      <h1>Terms of Service</h1>
    </div>
  );
}
