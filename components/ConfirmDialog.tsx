import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { type AlertColor } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ConfirmDialogProps {
  open: boolean;
  severity?: AlertColor;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  onConfirm: any;
  onCancel: any;
}

const ConfirmDialog = ({
  open,
  severity,
  title,
  message,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const theme = useTheme();

  let color = null;
  let icon = null;

  switch (severity) {
    case "success":
      icon = <TaskAltIcon />;
      color = theme.palette.success.main;
      break;
    case "info":
      icon = <ErrorOutlineIcon />;
      color = theme.palette.info.main;
      break;
    case "error":
      icon = <ErrorOutlineIcon />;
      color = theme.palette.error.main;
      break;
    case "warning":
      icon = <WarningAmberIcon />;
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.primary.main;
      break;
  }

  return (
    <Dialog open={open} fullWidth onClose={onCancel}>
      <DialogTitle sx={{color:color}}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {children ? children : <Typography>{message}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button variant="contained" color={severity} onClick={onConfirm}>
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
