import Head from "next/head";

const HeadElement = () => {
  return (
    <Head>
      <title>Zello</title>
      <meta name="description" content="Messaging app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default HeadElement;
