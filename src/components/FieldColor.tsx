import React, { useEffect, useState } from "react";
import { Text, Box, Label, Input } from "theme-ui";
import { ChromePicker } from "react-color";

interface Props {
  register: any;
  label: string;
  name: string;
  defaultValue: string;
  mr?: number;
  placeholder?: string;
  sub?: string;
  required?: boolean;
  ftype?: string;
  onChangeColor?: any;
}

const FieldColor: React.FC<Props> = ({
  name,
  label,
  placeholder,
  register,
  defaultValue,
  mr,
  sub,
  ftype = "text",
  onChangeColor,
  required = true,
}) => {
  const [valx, setVal] = useState<string>(defaultValue);

  const changeColor = (_e: any) => {
    console.log("_e", _e);
    const colr = _e && _e.hex;
    setVal(colr);

    if (typeof onChangeColor.onChange === "undefined") { 
      onChangeColor(colr, name );
    }
  };

  const [showPicker, setShowPicker] = useState<Boolean>(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  useEffect(() => {
    const vX: string = defaultValue || "";
    setVal(vX);
  }, [defaultValue]);

  return (
    <Box pb={2} mr={mr} sx={{ position: "relative" }}>
      {/* <Button type="button" onClick={togglePicker}>
        Show Picker
      </Button> */}
      {sub && (
        <Text color="#111" sx={{ position: "absolute", right: 16, top: 32 }}>
          {sub}
        </Text>
      )}
      <Label htmlFor="description" sx={{ color: "#333", pb: 1 }}>
        {label}
      </Label>
      <Input
        placeholder={placeholder ? placeholder : ""}
        id={name}
        name={name}
        type={ftype}
        sx={{ borderRadius: 0, borderColor: "#666", color: "black" }}
        defaultValue={valx || defaultValue || ""}
        ref={register({ required: required })}
      />
      {defaultValue} - {valx}
      <Box
        onClick={() => togglePicker()}
        sx={{
          width: "16px",
          height: "16px",
          bg: valx,
          border: "solid 1px #ddd",
          position: "absolute",
          top: "30%",
          right: "4.5%",
          padding: "5px",
          // background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
      />
      <Box sx={{ position: "fixed", top: 0, zIndex: 9900 }}>
        {showPicker && (
          <ChromePicker
            color={valx}
            disableAlpha
            onChangeComplete={(e: any) => changeColor(e)}
          />
        )}
      </Box>
    </Box>
  );
};

export default FieldColor;
