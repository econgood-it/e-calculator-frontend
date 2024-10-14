import { Box, Divider } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useSubmit,
} from 'react-router-dom';
import { useLoaderData } from 'react-router-typesafe';
import styled from 'styled-components';
import { createApiClient, makeWretchInstanceWithAuth } from '../api/api.client';
import { BalanceSheetSidebarSection } from '../components/balanceSheet/BalanceSheetSidebarSection';
import GridContainer from '../components/layout/GridContainer';
import GridItem from '../components/layout/GridItem';
import { FixedToolbar } from '../components/lib/FixedToolbar';
import { OrganizationSidebarSection } from '../components/organization/OrganizationSidebarSection';
import { API_URL } from '../configuration';
import { OrganizationRequestBody } from '../models/Organization';
import { BalanceSheetCreateRequestBody } from '../models/BalanceSheet.ts';
import { HandlerContext } from './handlerContext.ts';

const DrawerWithFixedWidth = styled(Drawer)<{ $drawerWidth: number }>`
  & .MuiDrawer-paper {
    width: ${(props) => props.$drawerWidth}px;
  }
`;

const Content = styled.div<{ $open: boolean; $drawerWidth: number }>`
  margin-left: ${(props) => (props.$open ? props.$drawerWidth : 0)}px;
`;

export default function Sidebar() {
  const data = useLoaderData<typeof loader>();
  const drawerWidth = 300;
  const [open, setOpen] = useState<boolean>(true);
  const submit = useSubmit();

  async function createOrganization(organization: OrganizationRequestBody) {
    submit(
      { organization, intent: 'createOrganization' },
      { method: 'post', encType: 'application/json' }
    );
  }

  async function createBalanceSheet(
    balanceSheet: BalanceSheetCreateRequestBody
  ) {
    submit(
      { balanceSheet, intent: 'createBalanceSheet' },
      { method: 'post', encType: 'application/json' }
    );
  }

  const toogleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <FixedToolbar
        onToogleSidebar={toogleSidebar}
        showCompleteUserMenu={true}
      />
      <DrawerWithFixedWidth
        variant="persistent"
        anchor="left"
        open={open}
        sx={{ width: drawerWidth }}
        $drawerWidth={drawerWidth}
      >
        <Toolbar />
        <GridContainer spacing={2}>
          <GridItem mt={2} xs={12}>
            {data && (
              <OrganizationSidebarSection
                onCreateClicked={createOrganization}
                organizationItems={data.organizationItems}
                activeOrganizationId={data.activeOrganizationId}
              />
            )}
          </GridItem>
          <GridItem xs={12}>
            <Divider variant="middle" />
          </GridItem>
          <GridItem xs={12}>
            {data && (
              <BalanceSheetSidebarSection
                balanceSheetItems={data.balanceSheetItems}
                onCreateBalanceSheet={createBalanceSheet}
              />
            )}
          </GridItem>
        </GridContainer>
      </DrawerWithFixedWidth>
      <Box>
        <Toolbar />
        <Content $open={open} $drawerWidth={drawerWidth}>
          <Outlet />
        </Content>
      </Box>
    </>
  );
}

export async function loader(
  { params }: LoaderFunctionArgs,
  handlerCtx: unknown
) {
  const { userData, lng } = handlerCtx as HandlerContext;

  if (!params.orgaId || !userData) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );
  const orgaId = Number.parseInt(params.orgaId);
  const organizationItems = await apiClient.getOrganizations();
  const balanceSheetItems = await apiClient.getBalanceSheets(orgaId);
  return { activeOrganizationId: orgaId, organizationItems, balanceSheetItems };
}

export async function action(
  { params, request }: ActionFunctionArgs,
  handlerCtx: unknown
) {
  const { intent, ...data } = await request.json();
  const { userData, lng } = handlerCtx as HandlerContext;
  if (!userData || !params.orgaId) {
    return null;
  }
  const apiClient = createApiClient(
    makeWretchInstanceWithAuth(API_URL, userData!.access_token, lng)
  );

  if (intent === 'createOrganization') {
    const organization = await apiClient.createOrganization(data.organization);
    return redirect(`/organization/${organization.id}/overview`);
  }
  if (intent === 'createBalanceSheet') {
    const { id } = await apiClient.createBalanceSheet(
      data.balanceSheet,
      Number.parseInt(params.orgaId)
    );
    return redirect(
      `/organization/${params.orgaId}/balancesheet/${id}/overview`
    );
  }

  throw json({ message: 'Invalid intent' }, { status: 400 });
}
