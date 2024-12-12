/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { shikiBundledLanguagesInfo } from "prosekit/extensions/code-block";

const Container = styled.div`
  position: relative;
  left: 2px;
  top: 3px;
  height: 0;
  select-none: none;
  overflow: visible;
  content-editable: false;
`;

const StyledSelect = styled.select`
  outline: unset;
  focus: outline-unset;
  position: relative;
  box-sizing: border-box;
  width: auto;
  cursor: pointer;
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  transition: opacity 0.2s ease-in-out;
  color: white;
  opacity: 0;

  &:hover {
    opacity: 0.8;
  }

  [div[data-node-view-root]:hover &] {
    opacity: 0.5;
  }

  [div[data-node-view-root]:hover &]:hover {
    opacity: 0.8;
  }
`;

export default function LanguageSelector({
  language,
  setLanguage,
}: {
  language?: string;
  setLanguage: (language: string) => void;
}) {
  return (
    <Container contentEditable={false}>
      <StyledSelect
        onChange={(event) => setLanguage(event.target.value)}
        value={language || ""}
      >
        <option value="">Plain Text</option>
        {shikiBundledLanguagesInfo.map((info) => (
          <option key={info.id} value={info.id}>
            {info.name}
          </option>
        ))}
      </StyledSelect>
    </Container>
  );
}
