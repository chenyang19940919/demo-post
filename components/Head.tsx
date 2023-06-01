import NextHead from "next/head";

interface HeadProps {
  title: string;
  description?: string;
  keywords?: string;
}

const Head = ({ title, description, keywords }: HeadProps) => {
  return (
    <NextHead>
      <title>{title} - demo post</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </NextHead>
  );
};

export default Head;
