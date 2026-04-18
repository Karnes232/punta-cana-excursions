export default async function CancellationPolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }] = await Promise.all([params]);
  return (
    <div>
      <h1>Cancellation Policy</h1>
    </div>
  );
}
