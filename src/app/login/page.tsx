// app/login/page.tsx
import AuthForm from '@/components/AuthForm';

const LoginPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <AuthForm isLogin={true} />
        </div>
    );
};

export default LoginPage;
