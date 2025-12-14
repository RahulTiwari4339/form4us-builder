import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Layout/Header";
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  const noHeaderPaths = ["/login", "/register"];

  const hideHeader =
    noHeaderPaths.includes(router.pathname) ||
    router.asPath.startsWith("/forms/") ||
    Component?.name === "Custom404";

  return (
    <SessionProvider session={session}>
      {!hideHeader && <Header />}
      <Component {...pageProps} />
    </SessionProvider>
  );
}