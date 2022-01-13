import { User } from '../authentication/User';
import NavigationBar from '../navigation/NavigationBar';
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import BalanceSheetView from '../balanceSheet/BalanceSheetView';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../configuration';

const BodyGrid = styled(Grid)`
  position: relative;
  top: 52px;
`;

type BalanceSheetId = {
  id: number;
};

type HomePageProps = {
  user: User;
};

const HomePage = ({ user }: HomePageProps) => {
  const [activeSheet, setActiveSheet] = useState<number | undefined>(undefined);
  const [openSheets, setOpenSheets] = useState<number[]>([]);
  const [sheetIds, setSheetIds] = useState<BalanceSheetId[]>([]);

  const addOpenSheet = (sheetId: number) => {
    if (openSheets.find((id) => id === sheetId) === undefined) {
      setOpenSheets((sheets) => sheets.concat(sheetId));
    }
  };

  const deleteOpenSheet = (idToDelete: number) => {
    setOpenSheets((sheets) => sheets.filter((id) => id !== idToDelete));
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
          user={user}
        />
      </Grid>
      <BodyGrid item xs={12}>
        {activeSheet === undefined ? (
          <Grid container>
            {sheetIds.map((b) => (
              <Grid key={b.id} item>
                <Card title={`Balancesheet with id ${b.id}`}>
                  <CardContent>{`Balancesheet with id ${b.id}`}</CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        setActiveSheet(b.id);
                        addOpenSheet(b.id);
                      }}
                      size="small"
                    >
                      Open
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <BalanceSheetView user={user} balanceSheetId={activeSheet} />
        )}
      </BodyGrid>
    </Grid>
  );
};

export default HomePage;
