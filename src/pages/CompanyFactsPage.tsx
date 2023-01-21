import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import { useApi } from '../contexts/ApiContext';
import { useEffect, useState } from 'react';
import { Region, RegionSchema } from '../dataTransferObjects/Region';
import { Industry, IndustrySchema } from '../dataTransferObjects/Industry';

const CompanyFactsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  const api = useApi();
  const [regions, setRegions] = useState<Region[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    (async () => {
      const regionResponse = await api.get<Region[]>('/v1/regions');
      setRegions(RegionSchema.array().parse(regionResponse.data));
    })();
  }, [api]);

  useEffect(() => {
    (async () => {
      const industryResponse = await api.get<Region[]>('/v1/industries');
      setIndustries(IndustrySchema.array().parse(industryResponse.data));
    })();
  }, [api]);

  return (
    <>
      {balanceSheet && (
        <SuppliersForm
          companyFacts={balanceSheet.companyFacts}
          regions={regions}
          industries={industries}
        />
      )}
    </>
  );
};

export default CompanyFactsPage;
