/** @jsxImportSource theme-ui */
import { useEffect, useMemo, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { matchSorter } from 'match-sorter';
import { Box } from 'theme-ui';

const SelectCombobox = ({ id, disabled, options, onChange }: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (selectedId) {
      onChange(selectedId);
    }
  }, [selectedId]);

  const matches = useMemo(() => {
    return matchSorter(options, searchValue, {
      keys: ['name'],
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
    });
  }, [searchValue, options]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Ariakit.ComboboxProvider>
        <Ariakit.SelectProvider
          setValue={(value) => {
            const selectedOption = options.find(
              (option: any) => option.name === value,
            );
            if (selectedOption) {
              setSelectedId(selectedOption.id);
            }
          }}>
          <Ariakit.Select
            sx={{
              display: 'flex',
              height: '40px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '4px',
              border: ' 1px solid #e4e9ef',
              paddingX: '16px',
              fontSize: '16px',
              lineHeight: '24px',
              backgroundColor: 'transparent',
            }}
            id={id}
            disabled={disabled}
            onChange={onChange}
          />
          <Ariakit.SelectPopover
            gutter={4}
            sameWidth={true}
            modal={true}
            sx={{
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '300px',
              overflow: 'auto',
              borderRadius: '8px',
              border: '1px solid #dae2e7',
              backgroundColor: '#fff',
              padding: '8px',
            }}>
            <Ariakit.Combobox
              autoSelect
              placeholder="Search"
              sx={{
                minHeight: '40px',
                borderRadius: '4px',
                borderStyle: 'none',
                backgroundColor: '#edf0f3',
                padding: '0 16px',
                fontSize: '16px',
                color: 'black',
                border: ' 1px solid #e4e9ef',
              }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Ariakit.ComboboxList>
              {matches.map((option: any) => (
                <Ariakit.SelectItem
                  key={option.id}
                  value={option.name}
                  sx={{
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '4px',
                    padding: '8px',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: '#dae2e7',
                    },
                  }}
                  render={<Ariakit.ComboboxItem />}>
                  {option.name}
                </Ariakit.SelectItem>
              ))}
            </Ariakit.ComboboxList>
          </Ariakit.SelectPopover>
        </Ariakit.SelectProvider>
      </Ariakit.ComboboxProvider>
    </Box>
  );
};

export default SelectCombobox;
