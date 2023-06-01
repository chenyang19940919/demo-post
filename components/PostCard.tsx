import React from "react";
import { useRouter } from "next/router";
import {
  Card,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
  Tooltip,
  Box,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SendIcon from "@mui/icons-material/Send";
import ArchiveIcon from "@mui/icons-material/Archive";
import ConfirmDeleteDialog from "./ConfirmDialog";
import useDialog from "@/hooks/useDialog";

interface PostCardProps {
  data: any;
  onChangeStatus: any;
  onDelete: any;
}

const PostCard = ({ data, onChangeStatus, onDelete }: PostCardProps) => {
  const router = useRouter();
  const { open, setOpen, onClose } = useDialog();
  const [message, setMessage] = React.useState("");

  const handleChangeStatus = (changeStatus: number) => {
    onChangeStatus({ ...data, status: changeStatus });
  };

  const handleEdit = () => {
    router.push(`/post/edit/${data?.id}`);
  };

  const handleDelete = () => {
    setOpen(true);
    setMessage(`確定要將 "${data?.title}" 刪除?`);
  };

  const handleConfirmDelete = () => {
    onDelete(data?.id);
    setOpen(false);
  };

  return (
    <Card sx={{ width: "100%" }}>
      <ListItem>
        <Box>
          <img src={data.thumbnail} width="180" height="110" />
        </Box>
        <ListItemText>
          <Stack sx={{ ml: 3 }} spacing={1}>
            <div>{data.title}</div>
            <div>{data.category}</div>
            <div>
              {data.status === 1 ? (
                <Chip label="已發布" color="success" />
              ) : (
                <Chip label="草稿" />
              )}
            </div>
          </Stack>
        </ListItemText>
        {data.status !== 1 ? (
          <Tooltip title="發布">
            <IconButton color="primary" onClick={() => handleChangeStatus(1)}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="轉為草稿">
            <IconButton color="primary" onClick={() => handleChangeStatus(0)}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="編輯">
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="刪除">
          <IconButton color="error" onClick={handleDelete}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </ListItem>
      <ConfirmDeleteDialog
        title="刪除確認"
        message={message}
        severity="error"
        open={open}
        onConfirm={handleConfirmDelete}
        onCancel={onClose}
      />
    </Card>
  );
};

export default PostCard;
