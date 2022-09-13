import { useActiveBalanceSheet } from '../contexts/ActiveBalanceSheetProvider';
import SuppliersForm from '../components/balanceSheet/companyFacts/SuppliersForm';

const CompanyFactsPage = () => {
  const { balanceSheet } = useActiveBalanceSheet();
  return (
    <>
      {balanceSheet && (
        <SuppliersForm companyFacts={balanceSheet.companyFacts} />
      )}
    </>
  );
};

export default CompanyFactsPage;
