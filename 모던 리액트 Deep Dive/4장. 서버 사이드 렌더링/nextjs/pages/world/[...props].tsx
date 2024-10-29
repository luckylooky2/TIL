import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPageContext } from "next";

// props로 split path 배열이 전달된다. 요소는 항상 string 타입이다. e.g. ['1', '2']
export default function HiAll({ props: serverProps }: { props: string[] }) {
  // 클라이언트에서 가져오는 방법
  const {
    query: { props },
  } = useRouter();

  useEffect(() => {
    console.log(props, serverProps); // 같다.
    console.log(JSON.stringify(props) === JSON.stringify(serverProps)); // true
  }, [props, serverProps]);

  return (
    <>
      hi{" "}
      <ul>
        {serverProps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export const getServerSideProps = (context: NextPageContext) => {
  // console.log(context);
  // 서버에서 가져오는 방법
  const {
    query: { props },
  } = context;

  return {
    props: {
      props,
    },
  };
};
