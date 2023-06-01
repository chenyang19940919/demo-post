import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/styles/globals.css";
import "@/styles/editor-view.css";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { ReactElement, ReactNode, useEffect } from "react";
import "nprogress/nprogress.css";
import { NextPage } from "next/types";
import { AppProps } from "next/app";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// 呼叫 NProgress.configure 來初始化
NProgress.configure({ showSpinner: false, speed: 500 });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);
  const layout = getLayout(<Component {...pageProps} />);
  const router = useRouter();

  // Integrate nprogress
  useEffect(() => {
    const handleRouteStart = (url: string) => {
      NProgress.start();
    };
    const handleRouteDone = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);
    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
      >
        {layout}
      </SnackbarProvider>
    </SessionProvider>
  );
}

