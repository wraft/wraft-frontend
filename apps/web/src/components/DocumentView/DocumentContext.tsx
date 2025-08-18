import React, {
  useState,
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import { NodeJSON } from '@wraft/editor';

import { useAuth } from 'contexts/AuthContext';
import { envConfig } from 'utils/env';
import { ContentInstance, IVariantDetail } from 'utils/types/content';
import { fetchAPI } from 'utils/models';
import { Field as FieldT } from 'utils/types';
import { findHolders, mapFields, mapPlaceholdersToFields } from 'utils/index';
import contentStore from 'store/content.store';

import apiService from './APIModel';
import { DocRole, EditorMode, UserType } from './usePermissions';

export const API_HOST = envConfig.API_HOST;

interface Approver {
  id: string;
  name: string;
  profile_pic: string;
}

interface StateState {
  approvers: Approver[];
  error?: string | undefined;
  id: string;
  inserted_at: string;
  is_user_eligible: boolean;
  order: number;
  state: string;
  updated_at: string;
}

type Counterparty = {
  id: string;
  name: string;
  email: string;
  updated_at: string;
  signature_date: string | null;
  created_at: string;
  signature_status: 'pending' | 'signed' | 'rejected';
};

interface DocumentContextProps {
  activeCounterparty: Counterparty | null;
  additionalCollaborator: any;
  cId: string;
  contentBody: any;
  contents: ContentInstance | any;
  contentType: any;
  currentActiveIndex: any;
  docRole: DocRole;
  editorMode: EditorMode;
  editorRef: any;
  fields: any;
  fieldTokens: any;
  fieldValues: any;
  flow: any;
  isEditable: any;
  isInvite: 'invite' | 'sign' | null;
  isMakeCompete: any;
  lastSavedContent: any;
  loading: boolean;
  meta: any;
  nextState: StateState | undefined;
  pageTitle: string;
  prevState: StateState | undefined;
  selectedTemplate: any;
  states: any;
  tabActiveId: string;
  token: string | null;
  vendorId: string | null;
  userType: UserType;
  signerBoxes: any;
  signers: Counterparty[];
  inviteType: 'sign' | 'invite' | null | undefined;
  setAdditionalCollaborator: (data: any) => void;
  setUserType: (state: UserType) => void;
  fetchContentDetails: (cid: string) => void;
  setContentBody: (contetn: any) => void;
  setEditorMode: (state: EditorMode) => void;
  setFieldTokens: (data: any) => void;
  setFieldValues: (fieldValues: any) => void;
  setMeta: (data: any) => void;
  setPageTitle: (data: any) => void;
  setTabActiveId: (state: string) => void;
  setSignerBoxes: (boxs: any) => void;
  setSigners: (signers: Counterparty[]) => void;
  setContents: (contents: ContentInstance) => void;
}

export const DocumentContext = createContext<DocumentContextProps>(
  {} as DocumentContextProps,
);

export const DocumentProvider = ({
  children,
  mode,
}: {
  children: ReactElement;
  mode: EditorMode;
}) => {
  const [additionalCollaborator, setAdditionalCollaborator] = useState<any>([]);
  const [contentBody, setContentBody] = useState<NodeJSON>();
  const [contentType, setContentType] = useState<any>();
  const [contents, setContents] = useState<ContentInstance>();
  const [docRole, setDocRole] = useState<DocRole>('viewer');
  const [editorMode, setEditorMode] = useState<EditorMode>('edit'); //temp
  const [fieldTokens, setFieldTokens] = useState<any>([]);
  const [fieldValues, setFieldValues] = useState<any>([]);
  const [fields, setField] = useState<Array<FieldT>>([]);
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState<any>({});
  const [nextState, setNextState] = useState<StateState>();
  const [vendorId, setVendorId] = useState<string>();
  const [pageTitle, setPageTitle] = useState<string>('Untitled document');
  const [prevState, setPrevState] = useState<StateState>();
  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  const [signerBoxes, setSignerBoxes] = useState<any>();
  const [states, setStates] = useState<any>();
  const [tabActiveId, setTabActiveId] = useState<any>('edit');
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>('default');
  const [signers, setSigners] = useState<Counterparty[]>([]);
  const [activeCounterparty, setActiveCounterparty] = useState<Counterparty>();

  const newContent = contentStore((state: any) => state.newContents);

  const editorRef = useRef<any>();
  const lastSavedContent = useRef<string>('\n');

  const router = useRouter();
  const { userProfile, accessToken } = useAuth();

  const cId: string = router.query.id as string;
  const inviteType = router.query.type as 'sign' | 'invite' | null | undefined;
  const guestToken: string = router.query.token as string;

  const isInvite =
    inviteType === 'invite' || inviteType === 'sign' ? inviteType : null;

  useEffect(() => {
    if (mode) {
      setEditorMode(mode);
    }
    if (!cId) {
      setEditorMode('new');
    }
  }, [mode]);

  useEffect(() => {
    if (!inviteType) {
      setToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (inviteType === 'invite' && guestToken) {
      setUserType('guest');
      verifyInvitezUserAccess();
    }
    if (inviteType === 'sign' && guestToken) {
      setUserType('guest');
      verifyInvitezUserAccess();
    }
  }, [inviteType, guestToken]);

  useEffect(() => {
    if (token) {
      fetchContentDetails(cId);
    }
  }, [token]);

  // useEffect(() => {
  //   if (type !== 'invite' && cId) {
  //     fetchContentDetails(cId);
  //   }
  // }, [type, cId]);

  useEffect(() => {
    if (flow && flow.flow) {
      fetchStates(flow.flow.id);
    }
  }, [flow, contents]);

  useEffect(() => {
    if (editorMode === 'new' && newContent?.template?.title_template) {
      createDefaultTitle(newContent.template.title_template);
    }
    if (editorMode === 'new' && newContent?.meta) {
      setMeta(newContent?.meta);
    }
  }, [fieldTokens, newContent]);

  useEffect(() => {
    if (states && userProfile) {
      const activeState = states.find(
        (state: any) => state.id === contents?.state?.id,
      );

      const currentIndex = states.indexOf(activeState);

      if (currentIndex !== -1 && activeState) {
        const nextAvailableState = states[currentIndex + 1] || null;
        const previousState = states[currentIndex - 1] || null;

        setNextState(nextAvailableState);
        setPrevState(previousState);
      }

      if (contents && contents.state === null && states.length > 0) {
        const { creator } = contents;
        const { id: userId } = userProfile;

        if (creator?.id === userId) {
          const state = states[0];
          setNextState({ ...state, is_user_eligible: true });
        }
      }
    }
  }, [flow, states]);

  useEffect(() => {
    if (mode === 'new' && newContent) {
      initNewContent(newContent.template);

      if (newContent.contentFields) {
        setFieldValues(newContent.contentFields);
      }
      if (newContent.vendor_id) {
        setVendorId(newContent.vendor_id);
      }
    }
  }, [newContent]);

  // update placeholder fields when fields or fieldValues change
  useEffect(() => {
    if (!fields || !fieldValues) return;

    const mappedFields = mapFields(fields, fieldValues);
    const placeholderFields = mapPlaceholdersToFields(mappedFields);

    if (placeholderFields.length > 0) {
      setFieldTokens(placeholderFields);
    }
  }, [fieldValues, fields]);

  const verifyInvitezUserAccess = async () => {
    try {
      const data = await apiService.get(
        `/guest/contents/${cId}/verify_access/${guestToken}?type=${inviteType === 'sign' ? 'sign' : 'guest'}`,
        guestToken,
      );
      if (data?.token) {
        setToken(data.token);
      }
      if (data?.counterparty) {
        setActiveCounterparty(data.counterparty);
      }
      if (data?.role === 'suggestor') {
        setDocRole('viewer');
      }
      if (data?.role === 'sign') {
        setDocRole('signer');
      }
      if (data?.role !== 'suggestor' && data?.role !== 'sign') {
        setDocRole(data.role);
      }
      // setAccessStatus(data); // Set the access status
    } catch (err) {
      // setError(err.message);
    }
  };

  const fetchContentDetails = async (id: string) => {
    try {
      const data = await apiService.get(`contents/${id}`, token);

      if (data?.content?.serialized?.serialized) {
        const serialized = JSON.parse(data.content.serialized.serialized);
        setContentBody(serialized);
        lastSavedContent.current = data?.content?.serialized?.serialized;

        if (data.content.serialized.fields) {
          const getFieldValues = JSON.parse(data.content.serialized.fields);
          setFieldValues(getFieldValues);
        }

        const getFieldValues = JSON.parse(data.content.serialized.fields) || {};
        const holders = findHolders(serialized);
        setFieldValues({ ...getFieldValues, ...holders });
      }

      if (data?.content?.meta) {
        const {
          contract_value = '',
          start_date = '',
          expiry_date = '',
        } = data.content.meta;

        setMeta(() => ({
          ...data.content.meta,
          contract_value,
          start_date,
          expiry_date,
        }));
      }

      if (data?.content?.serialized) {
        const { content_type, content } = data;
        const cTypeId = content_type.id;

        if (isInvite && cTypeId) {
          setContentType(content_type);
        }

        if (!isInvite && cTypeId) {
          fetchContentTypeDetails(cTypeId);
        }

        isInvite;

        setPageTitle(content.serialized?.title);
        setContents(data);
        setLoading(false);
      }
    } catch {
      console.error('content  error');
    }
  };

  const fetchContentTypeDetails = (id: any) => {
    fetchAPI(`content_types/${id}`)
      .then((data: any) => {
        const res: IVariantDetail = data;
        const tFlow = res?.content_type?.flow;
        setFlow(tFlow);

        const tFields = data.content_type?.fields;
        if (tFields) {
          setField(tFields);
        }

        if (data?.content_type) {
          setContentType(data?.content_type);
        }
      })
      .catch((err) => {
        console.log(err, 'logerr');
      });
  };

  const fetchStates = (id: string) => {
    fetchAPI(`flows/${id}/states`).then((data: any) => {
      const stateNames = data
        .flatMap((item: any) => {
          const state = item.state;

          const isUserEligible = state.approvers.some(
            (approver: any) => approver.id === userProfile.id,
          );

          return {
            state: state.state,
            active_state: state.id === contents?.state?.id || null,
            id: state.id,
            order: state.order,
            is_user_eligible: isUserEligible,
            approvers: state.approvers,
          };
        })
        .sort((a: any, b: any) => a.order - b.order);

      setStates(stateNames);
    });
  };

  const initNewContent = (template: any) => {
    setSelectedTemplate(template);

    const ctypeId = template?.content_type?.id;
    const serialbody = template.content?.serialized;
    const content_title = serialbody?.title;

    if (ctypeId) {
      fetchContentTypeDetails(ctypeId);
    }

    if (content_title) {
      setPageTitle(content_title);
    }
    setLoading(false);
  };

  const isEditable = useMemo(() => {
    if (contents) {
      const { content }: ContentInstance = contents;
      return content?.approval_status;
    }
    return false;
  }, [contents]);

  const currentActiveIndex = useMemo(() => {
    if (contents && states && states.length > 0) {
      const { content, state }: ContentInstance = contents;
      const approval_status = content?.approval_status;
      if (state === null && !approval_status) {
        return 0;
      }

      if (state === null && approval_status) {
        return states.length + 1;
      }
      if (state) {
        const statesindex = states.findIndex(
          (item: any) => item.id === state.id,
        );

        return statesindex + 1;
      }
    }
    return 0;
  }, [contents, states]);

  const isMakeCompete = useMemo(() => {
    if (contents && states && states.length > 0) {
      const { state, content }: ContentInstance = contents;
      const lastState = states[states.length - 1];
      const currentstate = state?.state;
      const approval_status = content?.approval_status;

      return (
        (currentstate === lastState.state &&
          !approval_status &&
          lastState.is_user_eligible) ||
        false
      );
    }
    return false;
  }, [contents, states]);

  const createDefaultTitle = (titleTemplate: string) => {
    const generatedTitle = replacePlaceholders(
      titleTemplate,
      fieldTokens || [],
    );
    setPageTitle(generatedTitle);
  };

  const replacePlaceholders = (str: string, replacements: any): any => {
    replacements &&
      replacements.forEach(({ name, value }: any) => {
        const regex = new RegExp(`\\[${name}\\]`, 'g');
        str = str.replace(regex, value);
      });
    return str;
  };

  return (
    <DocumentContext.Provider
      value={{
        activeCounterparty: activeCounterparty || null,
        cId,
        contentBody,
        contents,
        contentType,
        currentActiveIndex,
        editorMode,
        editorRef,
        fields,
        fieldTokens,
        fieldValues,
        flow,
        isEditable,
        isMakeCompete,
        loading,
        nextState,
        pageTitle,
        prevState,
        selectedTemplate,
        states,
        tabActiveId,
        token,
        docRole,
        userType,
        additionalCollaborator,
        lastSavedContent,
        meta,
        isInvite,
        signerBoxes,
        signers,
        inviteType,
        vendorId: vendorId || null,
        setAdditionalCollaborator,
        setUserType,
        fetchContentDetails,
        setContentBody,
        setEditorMode,
        setFieldTokens,
        setFieldValues,
        setMeta,
        setPageTitle,
        setTabActiveId,
        setSignerBoxes,
        setSigners,
        setContents,
      }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  return useContext(DocumentContext);
};
