import {
  ActionIcon,
  Anchor,
  AppShell,
  Breadcrumbs,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconFolderOpen,
  IconFolderPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  json,
  Link,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { gql } from "urql";
import client from "../lib/memomeister";
import {
  FolderFormValues,
  FolderSubfoldersEdge,
  FolderType,
  UserType,
} from "../types";

interface Data {
  user: UserType | null;
  folder: FolderType | null;
  subfolders: FolderSubfoldersEdge[] | null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const FOLDER = gql`
    query FOLDER($id: String!) {
      folder(id: $id) {
        id
        name
        parentId
        breadcrumb {
          id
          name
        }
        subfolders {
          edges {
            node {
              id
              name
              hasSubfolders
              parentId
              breadcrumb {
                id
                name
              }
            }
          }
        }
      }
    }
  `;

  const FOLDERS = gql`
    query FOLDERS {
      folders(filter: { parentId: "" }) {
        edges {
          node {
            id
            name
            hasSubfolders
            breadcrumb {
              name
            }
          }
        }
      }
    }
  `;

  const data = await client
    .query(
      params.folderId ? FOLDER : FOLDERS,
      params.folderId ? { id: params.folderId } : {}
    )
    .toPromise()
    .then((result) => {
      return {
        folder: params?.folderId
          ? {
              id: result.data.folder.id,
              name: result.data.folder.name,
              parentId: result.data.folder.parentId,
              breadcrumb: result.data.folder.breadcrumb,
            }
          : null,
        subfolders: params?.folderId
          ? result.data?.folder.subfolders.edges
          : result.data?.folders?.edges,
      };
    })
    .catch((error) => console.log(error));

  return json({
    folder: data?.folder,
    subfolders: data?.subfolders,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  const action = formData.get("action");

  if (action === "create-folder") {
    const CREATE_FOLDER = gql`
      mutation CREATE_FOLDER($input: CreateFolderInputType!) {
        createFolder(input: $input) {
          name
        }
      }
    `;
    return await client
      .mutation(CREATE_FOLDER, {
        input: {
          name: formData.get("name"),
          parentId: formData.get("parentId"),
        },
      })
      .toPromise()
      .then((result) => {
        return { data: result.data, errors: result.error?.graphQLErrors };
      });
  } else if (action === "update-folder") {
    const UPDATE_FOLDER = gql`
      mutation UPDATE_FOLDER($input: FolderInputType!) {
        updateFolder(input: $input) {
          success
          userErrors {
            id
            field
            message
          }
        }
      }
    `;
    return await client
      .mutation(UPDATE_FOLDER, {
        input: {
          id: formData.get("id"),
          name: formData.get("name"),
        },
      })
      .toPromise()
      .then((result) => {
        return { data: result.data, errors: result.error?.graphQLErrors };
      });
  } else if (action === "delete-folder") {
    const REMOVE_FOLDER = gql`
      mutation REMOVE_FOLDER($folderId: String!) {
        moveFolderToBin(folderId: $folderId) {
          success
          userErrors {
            id
            field
            message
          }
        }
      }
    `;

    await client
      .mutation(REMOVE_FOLDER, { folderId: formData.get("id") })
      .toPromise()
      .catch((error) => console.log(error));

    await new Promise((r) => setTimeout(r, 2000));

    return null;
  }

  return null;
}

interface FieldErrors {
  name?: string;
  email?: string;
}

export default function Folders() {
  const { folder, subfolders } = useLoaderData() as Data;
  const params = useParams();
  const fetcher = useFetcher();
  const [
    newFolderModalOpend,
    { open: openNewFolderModal, close: closeNewFolderModal },
  ] = useDisclosure(false);
  const [
    updateFolderModalOpend,
    { open: openUpdateFolderModal, close: closeUpdateFolderModal },
  ] = useDisclosure(false);
  const [
    moveToBinOpend,
    { open: openMoveToBinModal, close: closeMoveToBinModal },
  ] = useDisclosure(false);
  const [errors, setErrors] = useState<FieldErrors>();

  const form = useForm<FolderFormValues>({
    mode: "controlled",
    initialValues: {
      id: "",
      name: "",
      parentId: "",
    },

    validate: {
      name: (value) => (!value.length ? "Invalid name" : null),
    },
  });

  const onCloseModals = () => {
    closeNewFolderModal();
    closeUpdateFolderModal();
    closeMoveToBinModal();
    setErrors(undefined);
    form.reset();
  };

  useEffect(() => {
    if (
      fetcher.state === "loading" &&
      fetcher.formData?.get("action") === "delete-folder"
    )
      onCloseModals();
    else if (
      fetcher.state == "loading" &&
      (fetcher.formData?.get("action") === "create-folder" ||
        fetcher.formData?.get("action") === "update-folder") &&
      fetcher.data?.errors
    ) {
      const fieldErrors: FieldErrors = {};
      fetcher.data?.errors?.map((error: any) => {
        if (error.extensions.code === "DUPLICATE_FOLDER_NAME") {
          fieldErrors.name = error.message;
        }
      });
      setErrors(fieldErrors);
    } else if (
      fetcher.state == "loading" &&
      (fetcher.formData?.get("action") === "create-folder" ||
        fetcher.formData?.get("action") === "update-folder") &&
      !fetcher.data?.errors
    )
      onCloseModals();
  }, [fetcher]);

  return (
    <>
      <Modal
        opened={newFolderModalOpend}
        onClose={onCloseModals}
        title={<Text fw="bold">New Folder</Text>}
      >
        <Form>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
              error={errors?.name}
            />
            <Button
              disabled={!form.isValid()}
              onClick={() => {
                fetcher.submit(
                  { action: "create-folder", ...form.getValues() },
                  { method: "post" }
                );
              }}
              loading={fetcher.state != "idle"}
            >
              Create
            </Button>
          </Stack>
        </Form>
      </Modal>
      <Modal
        opened={updateFolderModalOpend}
        onClose={onCloseModals}
        title={<Text fw="bold">Update Folder</Text>}
      >
        <Form>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
              error={errors?.name}
            />
            <Button
              disabled={!form.isValid()}
              onClick={() => {
                fetcher.submit(
                  { action: "update-folder", ...form.getValues() },
                  { method: "post" }
                );
              }}
              loading={fetcher.state != "idle"}
            >
              Update
            </Button>
          </Stack>
        </Form>
      </Modal>

      <Modal
        opened={moveToBinOpend}
        onClose={onCloseModals}
        title="Confirm your action"
      >
        <Stack>
          <Text size="sm">
            Do you really want to delete the{" "}
            <Text fw="bold" component="span">
              {form.values.name}
            </Text>{" "}
            folder?
          </Text>
          <Group gap={5} justify="end">
            <Button variant="outline" onClick={onCloseModals}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={
                fetcher.state != "idle" &&
                fetcher.formData?.get("action") === "delete-folder"
              }
              onClick={() =>
                fetcher.submit(
                  {
                    action: "delete-folder",
                    id: form.values.id,
                    name: form.values.name,
                  },
                  { method: "post" }
                )
              }
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>

      <AppShell.Navbar>
        <AppShell.Section style={{ overflow: "scroll" }} p="sm">
          {folder && (
            <Button
              variant="transparent"
              leftSection={<IconChevronLeft />}
              component={Link}
              to={`/folders/${folder.parentId ?? ""}`}
            >
              Back
            </Button>
          )}
          {folder && (
            <Button
              w={"100%"}
              variant="transparent"
              justify="left"
              color="black"
              leftSection={<IconFolderOpen />}
            >
              <Text truncate="end">{folder?.name}</Text>
            </Button>
          )}
          {subfolders?.map(({ node }) => (
            <Group wrap="nowrap" key={node.id}>
              <Button
                w={"100%"}
                component={Link}
                to={`/folders/${node?.id}`}
                variant="transparent"
                justify="left"
                color="black"
                leftSection={<IconFolder />}
              >
                <Text truncate="end">{node.name}</Text>
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="transparent" color="black">
                    <IconDotsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconFolderPlus />}
                    onClick={() => {
                      openNewFolderModal();
                      form.setFieldValue("parentId", node.id);
                    }}
                  >
                    New Folder
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEdit />}
                    onClick={() => {
                      form.setFieldValue("id", node.id);
                      form.setFieldValue("name", node.name);
                      openUpdateFolderModal();
                    }}
                  >
                    Edit Folder
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash />}
                    onClick={() => {
                      form.setFieldValue("id", node.id);
                      form.setFieldValue("name", node.name);
                      openMoveToBinModal();
                    }}
                  >
                    Delete Folder
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ))}
        </AppShell.Section>
        <AppShell.Section p="sm">
          <Button
            leftSection={<IconFolderPlus />}
            onClick={() => {
              openNewFolderModal();
              form.setFieldValue("parentId", params?.folderId ?? "");
            }}
          >
            New Folder
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Breadcrumbs>
          {folder?.breadcrumb?.map((breadcrumb) => (
            <Anchor component={Link} to={`/folders/${breadcrumb?.id}`}>
              <Text>{breadcrumb?.name}</Text>
            </Anchor>
          ))}
          {folder && (
            <Anchor component={Link} to={`/folders/${folder?.id}`}>
              <Text>{folder?.name}</Text>
            </Anchor>
          )}
        </Breadcrumbs>

        {/* <Code block>{JSON.stringify({ errors: errors }, null, 2)}</Code>
        <Code block>{JSON.stringify({ form: form.getValues() }, null, 2)}</Code>
        <Code block>{JSON.stringify({ folders: subfolders }, null, 2)}</Code> */}
      </AppShell.Main>
    </>
  );
}
