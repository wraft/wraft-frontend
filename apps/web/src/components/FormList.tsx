import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Text, Flex, useThemeUI } from 'theme-ui';
import { Button } from 'theme-ui';
import { Pagination, Table } from '@wraft/ui';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon } from '@wraft/icon';

import { fetchAPI, deleteAPI } from '../utils/models';
import { EmptyForm } from './Icons';
import Link, { NextLinkText } from './NavLink';
import { TimeAgo } from './Atoms';
import Modal from './Modal';
import { ConfirmDelete } from './common';

export interface Theme {
  total_pages: number;
  total_entries: number;
  form_collections: FormElement[];
  page_number: number;
}

export interface FormElement {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

export interface DummyFormElement {
  updated_at: string;
  inserted_at: string;
  id: string;
  description: string;
  status: string;
  prefix: string;
  name: string;
}
interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

const ItemField = (props: any) => {
  return (
    <Box
      variant="boxy"
      key={props.id}
      p={3}
      sx={{
        position: 'relative',
        bg: '#fff',
        borderBottom: 'solid 1px #eee',
        borderRadius: '3px',
        ':hover': {
          '.merry': {
            display: 'block',
          },
        },
      }}>
      <Box sx={{ width: '33ch', mb: 1 }}>
        <Link href={`/manage/themes/edit/${props.id}`}>
          <Text as="h4" sx={{ mb: 0, p: 0, pb: 0 }}>
            {props.name}
          </Text>
        </Link>
        <Text as="p" sx={{ mt: 0, p: 0 }} pt={0} color="grey">
          Sample Field Description
        </Text>
      </Box>
      <Box
        className="merry"
        sx={{
          display: 'none',
          position: 'absolute',
          top: 0,
          right: 0,
          mt: 3,
          mr: 3,
        }}>
        <Button variant="secondary" onClick={() => props.onDelete(props.id)}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

const FormList: FC = () => {
  // const [contents, setContents] = useState<Array<FormElement>>([]);
  const [contents, setContents] = useState<Array<DummyFormElement>>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);

  const { theme } = useThemeUI();

  const loadData = (page: number) => {
    setLoading(true);
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`collection_forms${pageNo}`)
      .then((data: any) => {
        setLoading(false);
        const res: FormElement[] = data.collection_forms;
        const dummy = {
          total_pages: 2,
          total_entries: 15,
          page_number: 1,
          forms: [
            {
              updated_at: '2023-09-05T09:11:52',
              status: 'active',
              prefix: 'INSFORM2',
              name: 'Insurance Form',
              inserted_at: '2023-09-05T09:11:52',
              id: 'eac20c0e-a13b-40c9-a89e-d3fa149f22ff',
              description:
                'Fill in the details to activate the corporate insurance offered to employees',
            },
            {
              updated_at: '2023-09-05T08:19:55',
              status: 'active',
              prefix: 'INSFORM1',
              name: 'Insurance Form',
              inserted_at: '2023-09-05T08:19:55',
              id: '1125413e-a2a4-43ab-9077-c209f48bdb86',
              description:
                'Fill in the details to activate the corporate insurance offered to employees',
            },
          ],
        };
        if (res && res.length > 0) {
          // setContents(res);
        }
        setContents(dummy.forms);
        setPageMeta(dummy);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (id: string) => {
    deleteAPI(`themes/${id}`).then(() => {
      toast.success('Deleted Theme', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <>
            <NextLinkText href={`/forms/${row.original?.id}`}>
              <Box>
                <Box>{row.original?.name}</Box>
              </Box>
            </NextLinkText>
            {/* <Drawer open={false} setOpen={() => {}}>
              <FlowForm setOpen={() => {}} />{' '}
            </Drawer> */}
          </>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'LAST UPDATED',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.updated_at && <TimeAgo time={row.original?.updated_at} />
        );
      },
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          <>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Box />
              <MenuProvider>
                <MenuButton
                  as={Box}
                  variant="none"
                  sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      margin: '0px',
                      padding: '0px',
                      bg: 'transparent',
                      ':disabled': {
                        display: 'none',
                      },
                    }}
                    onClick={() => {
                      setIsOpen(row.index);
                    }}>
                    <EllipsisHIcon
                      color={
                        (theme.colors &&
                          theme.colors.gray &&
                          theme.colors.gray[200]) ||
                        'black'
                      }
                    />
                  </Box>
                </MenuButton>
                <Menu
                  as={Box}
                  variant="layout.menu"
                  sx={{ p: 0 }}
                  open={isOpen == row.index}
                  onClose={() => setIsOpen(null)}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(null);
                      // setDeleteFlow(row.index);
                    }}
                    style={{ justifyContent: 'flex-start' }}>
                    <MenuItem as={Box}>
                      <Text
                        variant="pR"
                        sx={{
                          cursor: 'pointer',
                          color: 'red.600',
                        }}>
                        Delete
                      </Text>
                    </MenuItem>
                  </Button>
                </Menu>
              </MenuProvider>
            </Flex>
            <Modal
              isOpen={deleteOpen === row.index}
              onClose={() => setDeleteOpen(null)}>
              {
                <ConfirmDelete
                  title="Delete Flow"
                  text={`Are you sure you want to delete ‘${row.original.name}’?`}
                  setOpen={setDeleteOpen}
                  onConfirmDelete={async () => {
                    onDelete(row.index);
                  }}
                />
              }
            </Modal>
          </>
        );
      },
    },
  ];

  const changePage = (newPage: any) => {
    setPage(newPage);
    const currentPath = router.pathname;
    const currentQuery = { ...router.query, page: newPage };
    router.push(
      {
        pathname: currentPath,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    );
  };
  return (
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        {contents.length < 1 && (
          <Box>
            <Flex>
              <Box sx={{ color: 'gray.500', width: 'auto' }}>
                <EmptyForm />
              </Box>
              <Box sx={{ m: 2, pb: 0 }}>
                <Text as="h2" sx={{ fontWeight: 300 }}>
                  No Forms present
                </Text>
                <Text as="h3" sx={{ fontWeight: 200, color: 'text' }}>
                  You have not created a collection form yet, click below to
                  create one
                </Text>
                <Box sx={{ mt: 3, pb: 0 }}>
                  <Button>Add Form</Button>
                </Box>
              </Box>
            </Flex>
          </Box>
        )}
        <Box>
          <Box sx={{ width: '100%' }}>
            <Box mx={0} mb={3} sx={{ width: '100%' }}>
              <Table data={contents} columns={columns} isLoading={loading} />
            </Box>
            <Box mx={2}>
              {pageMeta && pageMeta?.total_pages > 1 && (
                <Pagination
                  totalPage={pageMeta.total_pages}
                  initialPage={currentPage}
                  onPageChange={changePage}
                  totalEntries={pageMeta.total_entries}
                />
              )}
            </Box>
          </Box>
          {/* {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <ItemField key={m.id} {...m} onDelete={onDelete} />
            ))} */}
        </Box>
      </Box>
    </Box>
  );
};

export default FormList;
