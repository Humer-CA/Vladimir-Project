import React from "react";
import { Box } from "@mui/system";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cards = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");

  return (
    <Card
      className="parentSidebar__card"
      onClick={() => navigate(`${data.path}`)}
    >
      <CardActionArea component="div" className="parentSidebar__action-area">
        <CardContent className="parentSidebar__content">
          {isSmallScreen ? null : (
            <IconButton className="parentSidebar__icon">{data.icon}</IconButton>
          )}
          <Stack flexDirection="column" gap={0.2} alignItems="flex-start">
            <Stack flexDirection="row" alignItems="center" gap={2}>
              {isSmallScreen ? (
                <IconButton className="parentSidebar__icon">
                  {data.icon}
                </IconButton>
              ) : null}

              <Stack>
                <Typography component="div" fontWeight="bold" color="secondary">
                  {data.label}
                </Typography>

                {isSmallScreen ? (
                  <Typography
                    variant="span"
                    color="text.secondary"
                    fontSize="12px"
                  >
                    {data.description}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
            {isSmallScreen ? null : (
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="12px"
              >
                {data.description}
              </Typography>
            )}
          </Stack>

          {isSmallScreen ? null : (
            <IconButton
              size="small"
              sx={{
                alignSelf: "flex-end",
                ":hover": {
                  backgroundColor: "secondary.main",
                  color: "white",
                },

                backgroundColor: "secondary.main",
                color: "white",
              }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Cards;
