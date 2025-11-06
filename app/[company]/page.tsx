"use client";

import CompanyClientPage from "./CompanyClientPage";

export default function Page({ params }: { params: { company: string } }) {
  const decodedCompany = decodeURIComponent(params.company);

  return <CompanyClientPage company={decodedCompany} />;
}
