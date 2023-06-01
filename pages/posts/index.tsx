import { useState, useEffect, useMemo } from "react";
import Head from "@/components/Head";
import { getLayout } from "@/components/Layout";
import PostCard from "@/components/PostCard";
import usePostList from "@/hooks/usePostList";
import Loading from "@/components/Loading";
import {
  Container,
  Typography,
  Divider,
  Stack,
  Box,
  MenuItem,
  TextField,
  Pagination,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useSnackbar } from "notistack";
import { NextPageContext } from "next";
import { getSession } from 'next-auth/react';

const host = process.env.NEXT_PUBLIC_APIHOST;

const Post = () => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<number | string>("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const { data = [], isLoading, mutate } = usePostList();
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.value;
    setFilter(e.target.value);
    //過濾
    if (e.target.value !== "all") {
      setPosts(data.filter((x: any) => x.status == status));
    } else {
      setPosts(data);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);

    let filterData = [];

    if (filter !== "all") {
      filterData = data.filter((x: any) => x.status == filter);
    } else {
      filterData = data;
    }

    if (keyword) {
      setPosts(
        filterData.filter((x: any) => x.title.toLowerCase().includes(keyword))
      );
    } else {
      setPosts(filterData);
    }
  };

  const handleChangeStatus = async (changeData: any) => {
    try {
      await axios.put(`${host}/api/posts/${changeData?.id}`, changeData);

      mutate(() => {
        return posts.map((post: any) => {
          if (post.id === changeData.id) {
            return changeData;
          }
          return post;
        });
      });

      enqueueSnackbar("狀態更新成功", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("狀態更新失敗", { variant: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${host}/api/posts/${id}`);

      mutate(posts.filter((post: any) => post.id !== id));

      enqueueSnackbar("刪除成功", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("刪除失敗", { variant: "error" });
    }
  };

  const handleChangePage = (e: React.ChangeEvent<unknown>, page: number) => {
    //因為index從0開始，page需減1
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  const visiblePosts = useMemo(() => {
    return posts.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize
    );
  }, [currentPage, posts]);

  return (
    <>
      <Head title="文章管理" />

      <Container>
        <Stack direction="row" justifyContent="space-between">
          <TextField
            value={filter}
            onChange={handleChangeFilter}
            select
            variant="standard"
            size="small"
            margin="normal"
            sx={{
              width: 100,
            }}
          >
            <MenuItem value="all">全部 ({data.length})</MenuItem>
            <MenuItem value="1">
              已發布 ({data.filter((x: any) => x.status === 1).length})
            </MenuItem>
            <MenuItem value="0">
              草稿 ({data.filter((x: any) => x.status === 0).length})
            </MenuItem>
          </TextField>
          <TextField
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            size="small"
            margin="normal"
          />
        </Stack>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ minHeight: 785 }}
        >
          <Stack spacing={2} sx={{ width: "100%" }}>
            {isLoading ? (
              <Loading />
            ) : (
              visiblePosts.map((item: any) => (
                <PostCard
                  key={item.id}
                  data={item}
                  onChangeStatus={handleChangeStatus}
                  onDelete={handleDelete}
                />
              ))
            )}
          </Stack>
          <Pagination
            size="large"
            shape="rounded"
            count={Math.ceil(posts.length / pageSize)}
            color="primary"
            showFirstButton
            showLastButton
            onChange={handleChangePage}
          />
        </Stack>
      </Container>
    </>
  );
};

export default Post;

Post.getLayout = getLayout;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
