import RegisterForm from '@/components/RegisterForm';
import Head from 'next/head';


export default function Home() {
  return (
    <>
      <Head>
        <title>WePlot - Regístrate</title>
        <meta name="description" content="Regístrate en WePlot" />
      </Head>
      <div className="container">
        <RegisterForm />
      </div>
    </>
  );
}