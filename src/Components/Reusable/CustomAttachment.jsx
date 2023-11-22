import {
  InputAdornment,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import AttachmentIcon from "../../Img/SVG/SVG/Attachment.svg";
import AttachmentActive from "../../Img/SVG/SVG/AttachmentActive.svg";

const CustomTextField = (props) => {
  const { name, control, onChange, errors, label, inputRef } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, value, onChange: setValue } = field;
        console.log(ref.current);
        return (
          <>
            <MuiTextField
              type="file"
              inputRef={inputRef}
              onChange={(e) => {
                setValue(e.target.files[0]);
              }}
              sx={{ display: "none" }}
            />
            <MuiTextField
              readOnly
              type="text"
              size="small"
              label={label}
              autoComplete="off"
              color="secondary"
              value={value?.name || "No file chosen"}
              onClick={() => {
                inputRef.current.click();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={value ? AttachmentActive : AttachmentIcon}
                      width="20px"
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: "12px",
                  color: "#636363",
                },

                ".MuiInputLabel-root.Mui-disabled": {
                  backgroundColor: "transparent",
                },

                ".Mui-disabled": {
                  backgroundColor: "background.light",
                  borderRadius: "12px",
                },
              }}
            />
            {errors && <Typography sx={{ color: "blue" }}>{errors}</Typography>}
          </>
        );
      }}
    />
  );
};

export default CustomTextField;
