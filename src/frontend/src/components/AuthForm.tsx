<<<<<<< Updated upstream
// "use client"

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import Button from "./Button";
// import Input from "./Input";
// import Link from "next/link";

// export type Variant = 'LOGIN' | 'REGISTER';

// const AuthForm = () => {
//   const router = useRouter();
//   const [variant, setVariant] = useState<Variant>('LOGIN');
//   const [isLoading, setIsLoading] = useState(false);

//   const toggleVariant = () => {
//     if (variant === 'LOGIN') {
//       setVariant('REGISTER');
//     } else {
//       setVariant('LOGIN');
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: {
//       errors,
//     }
//   } = useForm<FieldValues>({
//     defaultValues: {
//       name: '',
//       email: '',
//       password: ''
//     }
//   });

//   const onSubmit: SubmitHandler<FieldValues> = (data) => {
//     setIsLoading(true);
    
//     if (variant === 'REGISTER') {
//       Register API call
//     }

//     if (variant === 'LOGIN') {
//       Login API call
//     }
//   }

//   return (
//     <div className="
//       mt-8
//       sm:mx-auto
//       sm:w-full
//       sm:max-w-md
//     ">
//       <div className="
//         bg-neutral-800
//         px-4
//         py-8
//         shadow
//         sm:rounded-lg
//         sm:px-10
//       ">
//         <form
//           className="space-y-6"
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           {variant === 'REGISTER' && (
//             <Input
//               id="name"
//               label="Name"
//               register={register}
//               errors={errors}
//               disabled={isLoading}
//             />
//           )}
//           <Input
//             id="email"
//             label="Email address"
//             type="email"
//             register={register}
//             errors={errors}
//             disabled={isLoading}
//           />
//           <Input
//             id="password"
//             label="Password"
//             type="password"
//             register={register}
//             errors={errors}
//             disabled={isLoading}
//           />
//           <div>
//             <Button
//               disabled={isLoading}
//               fullWidth
//               type="submit"
//             >
//               {variant === 'LOGIN' ? 'Sign in' : 'Register'}
//             </Button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="
//               absolute
//               inset-0
//               flex
//               items-center
//             ">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-neutral-800 px-2 text-gray-300">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-2">
//             <Button
//               fullWidth
//               onClick={() => {}}
//             >
//               Google
//             </Button>
//           </div>
//         </div>

//         <div className="
//           flex
//           gap-2
//           justify-center
//           text-sm
//           mt-6
//           px-2
//           text-gray-300
//         ">
//           <div>
//             {variant === 'LOGIN' ? 'New to Beatify?' : 'Already have an account?'} 
//           </div>
//           <div
//             onClick={toggleVariant}
//             className="underline cursor-pointer"
//           >
//             {variant === 'LOGIN' ? 'Create an account' : 'Login'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
=======
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import Button from "./Button";
import Input from "./Input";

const AuthForm = () => {
  const { signup, error, isLoading } = useAuthStore();
  const router = useRouter();
  const [variant, setVariant] = useState<"LOGIN" | "REGISTER">("LOGIN");

  const toggleVariant = () => setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (variant === "REGISTER") {
      try {
        const { email, password, name } = data;
        await signup(email, password, name);
        router.push("/verify-email");
      } catch (error) {
        console.log(error);
      }
    }
    // Handle LOGIN variant here if needed
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-neutral-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button
              disabled={isLoading}
              fullWidth
              type="submit"
            >
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-neutral-800 px-2 text-gray-300">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button fullWidth onClick={() => {}}>
              Google
            </Button>
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-300">
          <div>
            {variant === 'LOGIN' ? 'New to Beatify?' : 'Already have an account?'} 
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> Stashed changes

// export default AuthForm;
