import { GetServerSidePropsContext, GetServerSideProps } from 'next';

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

export const getServerSideProps: GetServerSideProps<HelloProps> = async (context: GetServerSidePropsContext) => {
    // 서버에서 필요한 데이터를 가져오기 위해 API 호출 등을 수행합니다.
    const res = await fetch('/api/hello'); // 예시 URL, 실제 URL에 맞게 수정하세요.
    const initialMessage = await res.text();

    // props로 전달합니다.
    return {
        props: {
            initialMessage,
        },
    };
};

export default Hello;
