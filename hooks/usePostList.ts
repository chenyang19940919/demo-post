import useSwr from "swr";
import fetcher from "@/libs/fetcher";

const usePostList = () => {
  const { data, error, isLoading, mutate } = useSwr(
    process.env.NEXT_PUBLIC_APIHOST + "/api/posts",
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default usePostList;
