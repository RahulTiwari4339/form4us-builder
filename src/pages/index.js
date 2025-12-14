import { getSession } from "next-auth/react";
import HomePage from "@/components/Layout/HomePage";


export default function Home({ userSession }) {
  return (
    <HomePage userSession={userSession} />
  );
}
export async function getServerSideProps(context) {
  const userSession = await getSession(context);

  if (!userSession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userSession,
    },
  };
}
