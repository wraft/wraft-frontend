import React, { ReactElement, ReactNode, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import {
  Input,
  Label as InputLabel,
  Button as InvisibleButton,
  Close,
} from 'theme-ui';
// import InputLabel from 'Atoms/Input/InputLabel';
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop';
// import { ReactComponent as Close } from 'Assets/Close.svg';
import 'react-image-crop/dist/ReactCrop.css';
import { isString } from 'remirror';
// import InvisibleButton from 'Atoms/Button/InvisibleButton';
// import { isString } from 'Types/General';

const ImagePickerStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabelStyled = styled(InputLabel)`
  padding: 6px 10px;
  border-radius: 8px;
  display: block;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  transition: all 300ms ease;
`;

const InputStyled = styled(Input)`
  display: none;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &[data-has-image='true'] {
    margin-top: 10px;
  }
`;

const ReactCropStyled = styled(ReactCrop)`
  max-width: 512px;
  border-radius: 8px;
`;

const CloseStyled = styled(Close)`
  width: 30px;
  height: 30px;
`;

const InvisibleButtonStyled = styled(InvisibleButton)`
  display: flex;
  margin: 0 0 0 20px;
`;

const InvisibleButtonMobileStyled = styled(InvisibleButton)`
  display: flex;
  margin: 0 0 0 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  className?: string;
  onCropComplete?: () => void;
  children?: ReactNode;
  crop: Crop;
  image?: string | null;
  onCropChange: (crop: Crop, percentCrop: PercentCrop) => void;
  onImageChange: (image: string) => void;
  onImageClear?: () => void;
  inputLabel: string;
};

const ImagePicker = ({
  className,
  children,
  onCropComplete,
  crop,
  image,
  onCropChange,
  onImageChange,
  onImageClear,
  inputLabel,
}: Props): ReactElement => {
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.files || event.target.files.length <= 0) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if (isString(reader?.result)) {
          onImageChange(reader?.result);
        }
      },
      false,
    );
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <ImagePickerStyled className={className}>
      {image && (
        <ReactCropStyled
          keepSelection
          circularCrop
          minWidth={128}
          minHeight={128}
          crop={crop}
          // src={image || ''}
          onChange={onCropChange}
          onComplete={onCropComplete}
        />
      )}
      <ButtonContainer data-has-image={!!image}>
        <LabelContainer>
          <InputLabelStyled htmlFor="image-picker" color="primaryLight">
            {inputLabel}
          </InputLabelStyled>
          {onImageClear && image && (
            <InvisibleButtonMobileStyled onClick={onImageClear}>
              <CloseStyled />
            </InvisibleButtonMobileStyled>
          )}
        </LabelContainer>
        {children}
        <InputStyled
          name="image-picker"
          id="image-picker"
          type="file"
          accept="image/*"
          onChange={onChange}
        />
        {onImageClear && image && (
          <InvisibleButtonStyled onClick={onImageClear}>
            <CloseStyled />
          </InvisibleButtonStyled>
        )}
      </ButtonContainer>
    </ImagePickerStyled>
  );
};

export default ImagePicker;
