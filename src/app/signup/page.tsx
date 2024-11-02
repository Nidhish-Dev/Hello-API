// app/signup/page.tsx
import AuthForm from '@/components/AuthForm';

const SignupPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <AuthForm isLogin={false} />
        </div>
    );
};

export default SignupPage;
