import CompanyClientPage from "./CompanyClientPage";

export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const decodedCompany = decodeURIComponent(company);

  return <CompanyClientPage company={decodedCompany} />;
}
