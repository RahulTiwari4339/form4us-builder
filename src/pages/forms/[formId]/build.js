import { useState, useEffect } from "react";
import FormBuilderPagePC from "@/components/Layout/PCBuilder";
import FormBuilderPageMobile from "@/components/Layout/MobileBuilder";
import { getSession } from "next-auth/react";


export default function FormBuilderPage({ userSession }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? (
    <FormBuilderPageMobile userSession={userSession?.user} />
  ) : (
    <FormBuilderPagePC userSession={userSession?.user} />
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
