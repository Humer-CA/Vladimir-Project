import {
  InputAdornment,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import AttachmentIcon from "../../Img/SVG/SVG/Attachment.svg";

const CustomTextField = (props) => {
  const { name, control, onChange, errors, label } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, value } = field;

        return (
          <>
            <MuiTextField
              size="small"
              label={label}
              autoComplete="off"
              inputRef={ref}
              value={value}
              type="file"
              color="secondary"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={AttachmentIcon} width="20px" />
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
