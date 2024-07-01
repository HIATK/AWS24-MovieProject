import { GetServerSidePropsContext, GetServerSideProps } from "next";

interface HelloProps {
  initialMessage: string;
}

const Hello = ({ initialMessage }: HelloProps) => {
  return (
    <div>
      <h1>{initialMessage}</h1>
    </div>
  );
};

// 서버 측에서 호출할 API URL을 환경 변수 또는 직접 지정
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/hello";

export const getServerSideProps: GetServerSideProps<HelloProps> = async (
  context: GetServerSidePropsContext
) => {
  // 서버에서 필요한 데이터를 가져오기 위해 API 호출 등을 수행합니다.
  const res = await fetch(API_URL); // 예시 URL, 실제 URL에 맞게 수정하세요.
  const initialMessage = await res.text();

  // props로 전달합니다.
  return {
    props: {
      initialMessage,
    },
  };
};

export default Hello;
