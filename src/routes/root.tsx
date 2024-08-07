import {
  AppShell,
  Burger,
  Group,
  LoadingOverlay,
  MantineProvider,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { json, Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { gql } from "urql";
import client from "../lib/memomeister";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  phoneNumber: string;
  primaryEmail: string;
  activeCompanyRole: number;
}

interface Data {
  user: User | null;
}

export async function loader() {
  const MY_USER = gql`
    query getUserAndHisFolders {
      me {
        id
        firstName
        lastName
        fullName
        avatar
        phoneNumber
        primaryEmail
        activeCompanyRole # in this case it could be 0 (owner) or 10 (admin)
      }
    }
  `;

  const data = await client
    .query(MY_USER, {})
    .toPromise()
    .then((result) => {
      return {
        user: result.data?.me ?? null,
        folders: result.data?.folders?.edges ?? null,
      };
    })
    .catch((error) => console.log(error));

  return json({
    user: data?.user,
  });
}

export default function Root() {
  const { user } = useLoaderData() as Data;
  const [opened, { toggle }] = useDisclosure();
  const navigation = useNavigation();

  return (
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <LoadingOverlay
            visible={navigation.state != "idle"}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Text>
                Memomeister ( connected as{" "}
                <Text fw="bold" component="span">
                  {user?.fullName}
                </Text>{" "}
                )
              </Text>
            </Group>
          </AppShell.Header>
          <Outlet />
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}
