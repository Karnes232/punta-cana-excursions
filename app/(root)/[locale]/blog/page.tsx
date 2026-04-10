

export default async function BlogPage({
    params,
  }: {
    params: { locale: string };
  }) {

    const [{ locale }] = await Promise.all([
        params,
  
    ]);
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}