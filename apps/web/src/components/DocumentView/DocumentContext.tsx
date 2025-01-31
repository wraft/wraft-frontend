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
import axios, { AxiosInstance } from 'axios';
import { NodeJSON } from '@wraft/editor';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

import { useAuth } from 'contexts/AuthContext';
import { ContentInstance, IVariantDetail } from 'utils/types/content';
import { fetchAPI } from 'utils/models';
import { Field as FieldT } from 'utils/types';
import { findHolders } from 'utils/index';
import contentStore from 'store/content.store';

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

type EditorMode = 'view' | 'edit' | 'new' | 'sign';
type UserMode = 'default' | 'guest';

interface DocumentContextProps {
  additionalCollaborator: any;
  cId: string;
  contentBody: any;
  contents: ContentInstance | any;
  contentType: any;
  currentActiveIndex: any;
  editorMode: EditorMode;
  editorRef: any;
  fields: any;
  fieldTokens: any;
  fieldValues: any;
  flow: any;
  isEditable: any;
  isMakeCompete: any;
  lastSavedContent: any;
  loading: boolean;
  nextState: StateState | undefined;
  pageTitle: string;
  prevState: StateState | undefined;
  selectedTemplate: any;
  states: any;
  meta: any;
  tabActiveId: string;
  userMode: string;
  setAdditionalCollaborator: (data: any) => void;
  setUserMode: (state: UserMode) => void;
  fetchContentDetails: (cid: string) => void;
  setContentBody: (contetn: any) => void;
  setEditorMode: (state: EditorMode) => void;
  setFieldTokens: (data: any) => void;
  setPageTitle: (data: any) => void;
  setTabActiveId: (state: string) => void;
}

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: `${API_HOST}/api/v1`, // replace with your actual API host
  });
};

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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [contentBody, setContentBody] = useState<NodeJSON>();
  const [contents, setContents] = useState<ContentInstance>();
  const [contentType, setContentType] = useState<any>();
  const [editorMode, setEditorMode] = useState<EditorMode>('edit'); //temp
  const [userMode, setUserMode] = useState<UserMode>('default');
  const [fields, setField] = useState<Array<FieldT>>([]);
  const [fieldTokens, setFieldTokens] = useState<any>([]);
  const [fieldValues, setFieldValues] = useState<any>([]);
  const [meta, setMeta] = useState<any>([]);
  const [additionalCollaborator, setAdditionalCollaborator] = useState<any>([]);
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextState, setNextState] = useState<StateState>();
  const [pageTitle, setPageTitle] = useState<string>('Untitled document');
  const [prevState, setPrevState] = useState<StateState>();
  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  const [states, setStates] = useState<any>();
  const [tabActiveId, setTabActiveId] = useState<any>('edit');
  const [error, setError] = useState(null);

  const newContent = contentStore((state: any) => state.newContents);
  const editorRef = useRef<any>();
  const lastSavedContent = useRef<string>('\n');
  const router = useRouter();
  const { userProfile } = useAuth();
  const api = createAxiosInstance();

  const { token, type } = router.query;

  console.log('token', token);
  console.log('token', type);

  const cId: string = router.query.id as string;

  useEffect(() => {
    if (mode) {
      setEditorMode(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (type === 'invite' && token) {
      setUserMode('guest');
      verifyInvitezUserAccess();
    }
  }, [type, token]);

  useEffect(() => {
    if (type === 'invite' && token && accessToken) {
      fetchGuestContentDetails(cId);
    }
  }, [accessToken]);

  const verifyInvitezUserAccess = async () => {
    try {
      const response = await fetch(
        `${API_HOST}/api/v1/guest/contents/${cId}/verify_access/${token}`,
      );
      if (!response.ok) {
        throw new Error('Failed to verify access');
      }
      const data = await response.json();
      if (data?.token) {
        setAccessToken(data.token);
      }
      // setAccessStatus(data); // Set the access status
    } catch (err) {
      // setError(err.message);
    }
  };

  useEffect(() => {
    if (type !== 'invite' && cId) {
      fetchContentDetails(cId);
    }
  }, [type, cId]);

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
    }
  }, [newContent]);

  const fetchGuestContentDetails = (id: string) => {
    api
      .get(`/guest/contents/${id}?type=guest`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json', // Optional, if you want to specify content type
        },
      })
      .then((response) => {
        const data = response.data;
        if (data?.content?.serialized?.serialized) {
          const serialized = JSON.parse(data.content.serialized.serialized);
          setContentBody(serialized);

          const holders = findHolders(serialized);
          setFieldValues(holders);
        }

        if (data?.content?.serialized) {
          const { content_type, content } = data;
          const cTypeId = content_type.id;

          if (cTypeId) {
            setContentType(content_type);
          }

          setPageTitle(content.serialized?.title);
          setContents(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  const fetchContentDetails = (id: string) => {
    fetchAPI(`contents/${id}`).then((data: any) => {
      if (data?.content?.serialized?.serialized) {
        const serialized = JSON.parse(data.content.serialized.serialized);
        setContentBody(serialized);
        lastSavedContent.current = data?.content?.serialized?.serialized;

        const holders = findHolders(serialized);
        setFieldValues(holders);
      }

      if (data?.content?.serialized) {
        const { content_type, content } = data;
        const cTypeId = content_type.id;

        if (cTypeId) {
          fetchContentTypeDetails(cTypeId);
        }

        setPageTitle(content.serialized?.title);
        setContents(data);
        setLoading(false);
      }
    });
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
        userMode,
        additionalCollaborator,
        lastSavedContent,
        meta,
        setAdditionalCollaborator,
        setUserMode,
        fetchContentDetails,
        setContentBody,
        setEditorMode,
        setFieldTokens,
        setPageTitle,
        setTabActiveId,
      }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  return useContext(DocumentContext);
};
