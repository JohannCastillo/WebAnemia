import Head from "next/head";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/app";
import { DashboardLayout } from "@/dashboard/Layout";
import Provider from "@/context/Provider";

function MyApp({ Component, pageProps }: AppProps) {
  const isLoginPage = Component.name === "HomePage"; 
  return (
    <Provider>
      <Head>
        <title>Web Anemia</title>
      </Head>
      {isLoginPage? (
        <Component {...pageProps} />
      ) : (
          <DashboardLayout >
            <Component {...pageProps} />
          </DashboardLayout>
      )}
    </Provider>
  );
}

export default MyApp;
