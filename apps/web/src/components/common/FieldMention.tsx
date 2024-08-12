import React from 'react';
import {
  DataFunc,
  Mention,
  MentionsInput as MentionsInputReact17,
  MentionsInputProps,
} from 'react-mentions';
import {
  useController,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import * as yup from 'yup';

// TODO: Stopgap measure to address breaking type changes for fragments ({})
// in React 18.
const MentionsInput =
  MentionsInputReact17 as unknown as React.FC<MentionsInputProps>;

export const mentionTextSchema = yup
  .object({
    body: yup.string().default(''),
    mentions: yup
      .array()
      .of(
        yup
          .object({
            id: yup.string().required(),
            name: yup.string().required(),
          })
          .required(),
      )
      .default([]),
  })
  .required();

type MentionTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  type: 'post' | 'comment' | 'chat';
  placeholder?: string;
  disabled?: boolean;
  inputRef?: MentionsInputProps['inputRef'];
  onKeyDown?: MentionsInputProps['onKeyDown'];
  suggestionsContainer?: Element;
};

function MentionTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(controllerProps: MentionTextareaProps<TFieldValues, TName>) {
  const mentionsController = useController<TFieldValues, TName>({
    ...controllerProps,
    name: `${controllerProps.name}.mentions` as TName,
  });

  // Mocked users data (replace with actual data fetching logic)
  const users = [
    { _id: '1', firstName: 'John', lastName: 'Doe', position: 'Developer' },
    { _id: '2', firstName: 'Jane', lastName: 'Smith', position: 'Designer' },
  ];

  const dataFunc: DataFunc = (query, callback) => {
    const items = users
      .filter(
        ({ firstName, lastName }) =>
          firstName.toLowerCase().includes(query.toLowerCase()) ||
          lastName.toLowerCase().includes(query.toLowerCase()),
      )
      .map(({ _id, firstName, lastName }) => ({
        id: _id,
        display: `${firstName} ${lastName}`,
      }));
    callback(items);
  };

  return (
    <div className="caret-primary">
      <Controller
        {...controllerProps}
        name={`${controllerProps.name}.body` as TName}
        render={({ field }) => (
          <MentionsInput
            inputRef={controllerProps.inputRef}
            value={field.value}
            onChange={(evtIgnored, newValue) => field.onChange(newValue)}
            placeholder={controllerProps.placeholder}
            allowSuggestionsAboveCursor={true}
            suggestionsPortalHost={controllerProps.suggestionsContainer}
            onKeyDown={controllerProps.onKeyDown}
            disabled={controllerProps.disabled}>
            <Mention
              trigger="@"
              data={dataFunc}
              className="text-primary relative z-10"
              appendSpaceOnAdd
              onAdd={(id, display) => {
                mentionsController.field.onChange([
                  ...mentionsController.field.value,
                  {
                    id,
                    name: display,
                  },
                ]);
              }}
              renderSuggestion={(suggestion) => {
                const user = users.find((user) => user._id == suggestion.id);
                return (
                  <div className="flex items-center p-2">
                    <div className="ml-2">
                      <div className="flex items-center">
                        <div className="text-white">
                          {user?.firstName} {user?.lastName}
                        </div>
                      </div>
                      <div className="text-white text-xs opacity-60">
                        {user?.position}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </MentionsInput>
        )}
      />
    </div>
  );
}

export default MentionTextarea;
