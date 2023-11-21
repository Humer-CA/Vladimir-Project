import { Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete, TextField } from "@mui/material";

const Autocomplete = ({
  name,
  control,
  onChange: onValueChange,
  ...autocomplete
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <MuiAutocomplete
            {...autocomplete}
            disablePortal
            // autoComplete
            // autoHighlight
            value={value}
            // onChange={(_, value) => onChange(value)}
            onChange={(e, value) => {
              if (onValueChange) return setValue(onValueChange(e, value));
              setValue(value);
            }}
            slotProps={{
              popper: {
                placement: "bottom",
                disablePortal: true,
                modifiers: [
                  {
                    name: "flip",
                    enabled: true,
                    options: {
                      altBoundary: true,
                      rootBoundary: "document",
                      padding: 8,
                    },
                  },
                  {
                    name: "preventOverflow",
                    enabled: true,
                    options: {
                      altAxis: true,
                      altBoundary: true,
                      tether: true,
                      rootBoundary: "document",
                      padding: 8,
                    },
                  },
                ],
              },
            }}
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "12px",
                // backgroundColor: "white",
              },

              ".MuiInputLabel-root.Mui-disabled": {
                backgroundColor: "transparent",
              },

              ".Mui-disabled": {
                backgroundColor: "background.light",
              },
            }}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
