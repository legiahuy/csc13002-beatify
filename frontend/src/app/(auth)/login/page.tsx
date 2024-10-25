import AuthForm from "@/components/AuthForm";
import Image from "next/image";

const Login = () => {
  return (
    <div className="
      flex 
      min-h-full 
      flex-col 
      justify-center 
      py-12 
      sm:px-6 
      lg:px-8 
      bg-neutral-900
    ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        <h2 
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-white
          "
        >
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  )
}

export default Login;
