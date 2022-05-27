import NavigationBar from '../navigation/NavigationBar';
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import BalanceSheetView from '../balanceSheet/BalanceSheetView';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../configuration';
import { AlertContext } from '../alerts/AlertContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { Trans, useTranslation } from 'react-i18next';
import { useUser } from '../authentication/UserContext';

const BodyGrid = styled(Grid)`
  position: relative;
  top: 52px;
`;

export type BalanceSheetId = {
  id: number;
};

const HomePage = () => {
  const { t } = useTranslation('home-page');
  const { addAlert } = useContext(AlertContext);
  const { user } = useUser();
  const [activeSheet, setActiveSheet] = useState<number | undefined>(undefined);
  const [openSheets, setOpenSheets] = useState<number[]>([]);
  const [sheetIds, setSheetIds] = useState<BalanceSheetId[]>([]);

  const addOpenSheet = (sheetId: number) => {
    if (openSheets.find((id) => id === sheetId) === undefined) {
      setOpenSheets((sheets) => sheets.concat(sheetId));
    }
  };

  const deleteOpenSheet = (idToDelete: number) => {
    let nextActiveSheet;
    if (idToDelete === activeSheet) {
      const index = openSheets.findIndex((id) => id === idToDelete);
      if (openSheets.length > 1) {
        if (index === 0) {
          nextActiveSheet = openSheets[index + 1];
        } else {
          nextActiveSheet = openSheets[index - 1];
        }
      }
    }
    setOpenSheets((sheets) => sheets.filter((id) => id !== idToDelete));
    if (idToDelete === activeSheet) {
      setActiveSheet(nextActiveSheet);
    }
  };

  const addBalanceSheetId = (balanceSheetId: BalanceSheetId) => {
    setSheetIds((sheets) => sheets.concat(balanceSheetId));
  };

  const deleteBalanceSheet = async (idToDelete: number) => {
    try {
      await axios.delete(`${API_URL}/v1/balancesheets/${idToDelete}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOpenSheets((sheets) => sheets.filter((id) => id !== idToDelete));
      setSheetIds((sheetIds) => sheetIds.filter((b) => b.id !== idToDelete));
      addAlert({
        severity: 'success',
        msg: t('Balance sheet {{idToDelete}} successfully deleted', {
          idToDelete: idToDelete,
        }),
      });
    } catch (e) {
      addAlert({
        severity: 'error',
        msg: t('Deletion of balance sheet {{idToDelete}} fails', {
          idToDelete: idToDelete,
        }),
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/v1/balancesheets`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const balanceSheets = await response.data;
      setSheetIds(balanceSheets);
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavigationBar
          activeSheet={activeSheet}
          setActiveSheet={setActiveSheet}
          openSheets={openSheets}
          addOpenSheet={addOpenSheet}
          deleteOpenSheet={deleteOpenSheet}
          addBalanceSheetId={addBalanceSheetId}
        />
      </Grid>
      <BodyGrid item xs={12}>
        {activeSheet === undefined ? (
          <Grid container spacing={2}>
            {sheetIds.map((b) => (
              <Grid key={b.id} item>
                <Card variant="outlined" title={`Balancesheet with id ${b.id}`}>
                  <CardContent>
                    <Trans t={t}>Balance sheet with id {{ id: b.id }}</Trans>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        setActiveSheet(b.id);
                        addOpenSheet(b.id);
                      }}
                      variant="contained"
                      startIcon={<FontAwesomeIcon icon={faEdit} />}
                      size="small"
                    >
                      <Trans t={t}>Edit</Trans>
                    </Button>
                    <Button
                      onClick={() => {
                        deleteBalanceSheet(b.id);
                      }}
                      variant="contained"
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                      size="small"
                    >
                      <Trans t={t}>Delete</Trans>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <BalanceSheetView balanceSheetId={activeSheet} />
        )}
      </BodyGrid>
    </Grid>
  );
};

export default HomePage;
