import PublicFormView from "@/views/PublishedForm";

interface IPublishedPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function Home({ params }: IPublishedPageProps) {
  const { uuid } = await params;
  return (
    <>
      <PublicFormView uuid={uuid} />
    </>
  );
}
