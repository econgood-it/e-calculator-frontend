import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';
import { useApi } from '../contexts/ApiContext';
import { useEffect, useState } from 'react';
import { Region, RegionSchema } from '../dataTransferObjects/Region';

const CompanyFactsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  const api = useApi();
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get<Region[]>('/v1/regions');
      setRegions(RegionSchema.array().parse(response.data));
    })();
  }, [api]);

  return (
    <>
      {balanceSheet && (
        <SuppliersForm
          companyFacts={balanceSheet.companyFacts}
          regions={regions}
        />
      )}
    </>
  );
};

export default CompanyFactsPage;
