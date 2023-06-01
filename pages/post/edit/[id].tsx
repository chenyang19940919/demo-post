import { useState, useCallback } from "react";
import Head from "@/components/Head";
import { getLayout } from "@/components/Layout";
import dynamic from "next/dynamic";
import {
  Stack,
  TextField,
  Box,
  Grid,
  MenuItem,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import UploadImage from "@/components/UploadImage";
import useImage from "@/hooks/useImage";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { getSession } from "next-auth/react";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const host = process.env.NEXT_PUBLIC_APIHOST;

interface EditPostProps {
  data: any;
}

const EditPost = ({ data }: EditPostProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const width = 360;
  const height = 220;
  const { onChange, onRemove } = useImage();
  const [title, setTitle] = useState<string | undefined>(data?.title);
  const [category, setCategory] = useState<string | undefined>(
    data?.category ?? ""
  );
  const [content, setContent] = useState<string | undefined>(data?.content);
  const [thumbnail, setThumbnail] = useState<
    string | ArrayBuffer | null | undefined
  >(data?.thumbnail);

  const handleChangeImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files as FileList;

      if (files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (readerEvent) => {
          setThumbnail(readerEvent.target?.result);
        };
      }

      onChange(e);
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    onRemove();
    setThumbnail("");
  }, []);

  const handleEditChange = (editor: any) => {
    setContent(editor.getHtml());
  };

  const handleSave = async (status: number) => {
    try {
      if (!title || !content) {
        enqueueSnackbar("請輸入標題跟內容", {
          variant: "warning",
        });
        return;
      }

      if (router.query?.id) {
        const id = router.query?.id;
        const res = await axios.put(`${host}/api/posts/${id}`, {
          id,
          title,
          category,
          content,
          thumbnail,
          status: status,
        });

        if (res.data) {
          enqueueSnackbar(status === 1 ? "發布成功" : "儲存成功", {
            variant: "success",
          });
          router.push("/posts");
        }
      }
    } catch (err) {
      enqueueSnackbar(status === 1 ? "發布失敗" : "儲存失敗", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Head title="文章編輯" />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Grid container spacing={2} sx={{ width: "80%" }}>
          <Grid item xs={12}>
            <TextField
              value={title}
              label="標題"
              fullWidth
              onChange={(event) => setTitle(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Editor value={content} onChange={handleEditChange} />
          </Grid>
        </Grid>
        <Box>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                color="inherit"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => handleSave(0)}
              >
                儲存草稿
              </Button>
              <Button
                startIcon={<SendIcon />}
                variant="contained"
                onClick={() => handleSave(1)}
              >
                發佈
              </Button>
            </Stack>
            <TextField
              label="分類"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              select
              fullWidth
            >
              <MenuItem value="1">日常</MenuItem>
              <MenuItem value="2">環境</MenuItem>
              <MenuItem value="3">疾病相關</MenuItem>
            </TextField>
            <Box>
              <Typography variant="h6">
                文章縮圖 (建議尺寸 {width}x{height} 像素)
              </Typography>
              <UploadImage
                src={thumbnail}
                width={width}
                height={height}
                onChange={handleChangeImage}
                onRemove={handleRemoveImage}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default EditPost;

EditPost.getLayout = getLayout;

export const getServerSideProps = async (ctx: any) => {
  
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  
  const { params } = ctx;

  if (params?.id) {
    const { id } = params;
    const res = await axios.get(`${host}/api/posts/${id}`);

    return {
      props: { data: res.data },
    };
  }

  

  return {
    props: {},
  };
};
