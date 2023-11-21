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

        return (
          <>
            <MuiTextField
              size="small"
              label={label}
              autoComplete="off"
              inputRef={inputRef}
              type="file"
              color="secondary"
              onChange={(e) => {
                const inputValue = e.target.files;
                setValue(inputValue);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={value === false ? AttachmentIcon : AttachmentActive}
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
                cursor: "pointer!important",
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
