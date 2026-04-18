export default async function PrivacyPolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }] = await Promise.all([params]);
  return (
    <div>
      <h1>Privacy Policy</h1>
    </div>
  );
}
