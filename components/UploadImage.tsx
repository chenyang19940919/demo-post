import { useState } from "react";
import { Paper, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadImageProps {
  src: string | ArrayBuffer | null | undefined;
  width: string | number;
  height: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const UploadImage = ({
  src,
  width,
  height,
  onChange,
  onRemove,
}: UploadImageProps) => {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { width },
          height: { height },
          backgroundColor: "rgba(0,0,0,0.015)",
          backgroundImage: `url("${src}")`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {src ? (
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            上傳圖片
            <input hidden accept="image/*" type="file" onChange={onChange} />
          </Button>
        )}
      </Paper>
    </>
  );
};

export default UploadImage;
