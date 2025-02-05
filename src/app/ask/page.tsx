"use client"
// pages/ask.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define validation schema with Yup
const schema = yup.object().shape({
  crushName: yup.string().required('Crush’s name is required'),
  userEmail: yup.string().email('Invalid email').required('Your email is required'),
  yesResponse: yup.string().required('Please fill out what happens if they say YES'),
  noResponse: yup.string().required('Please fill out what happens if they say NO'),
});

type FormInputs = {
  crushName: string;
  userEmail: string;
  yesResponse: string;
  noResponse: string;
};

export default function Ask() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });


  // pages/ask.tsx
const onSubmit: SubmitHandler<FormInputs> = async (data) => {
  try {
    const response = await fetch(`https://crushu-back.onrender.com/api/crush/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      debugger
      // Redirect to the success page with the form ID
      router.push(`/respond/${result.data._id}`);
    } else {
      alert('Failed to submit form. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-pink to-valentine-light-pink flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>Ask Your Crush 💌 - Crushu</title>
        <meta name="description" content="Ask your crush out with Crushu. No escape from saying yes!" />
      </Head>

      {/* Back Button */}
      <Link href="/" passHref>
        <div className="absolute top-4 left-4 flex items-center text-valentine-white hover:text-valentine-red transition-colors cursor-pointer">
          <FaArrowLeft className="mr-2" /> Back
        </div>
      </Link>

      <main className="text-center z-10 w-full max-w-md">
        <h1 className="text-4xl font-dancing text-valentine-white mb-8">
          Ask Your Crush Out! 💌
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Crush’s Name */}
          <div>
            <input
              type="text"
              placeholder="Your crush's name"
              {...register('crushName')}
              className="w-full p-2 rounded-lg border border-valentine-red focus:outline-none focus:ring-2 focus:ring-valentine-red"
            />
            {errors.crushName && (
              <p className="text-valentine-red text-sm mt-1">{errors.crushName.message}</p>
            )}
          </div>

          {/* User Email */}
          <div>
            <input
              type="email"
              placeholder="Your email (to notify you)"
              {...register('userEmail')}
              className="w-full p-2 rounded-lg border border-valentine-red focus:outline-none focus:ring-2 focus:ring-valentine-red"
            />
            {errors.userEmail && (
              <p className="text-valentine-red text-sm mt-1">{errors.userEmail.message}</p>
            )}
          </div>

          {/* What if they say YES? */}
          <div>
            <textarea
              placeholder="What if they say YES? (e.g., 'Let’s go on a date!')"
              {...register('yesResponse')}
              className="w-full p-2 rounded-lg border border-valentine-red focus:outline-none focus:ring-2 focus:ring-valentine-red"
            />
            {errors.yesResponse && (
              <p className="text-valentine-red text-sm mt-1">{errors.yesResponse.message}</p>
            )}
          </div>

          {/* What if they say NO? */}
          <div>
            <textarea
              placeholder="What if they say NO? (e.g., 'We can still be friends!')"
              {...register('noResponse')}
              className="w-full p-2 rounded-lg border border-valentine-red focus:outline-none focus:ring-2 focus:ring-valentine-red"
            />
            {errors.noResponse && (
              <p className="text-valentine-red text-sm mt-1">{errors.noResponse.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-valentine-white text-valentine-pink px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Send to Crush <FaHeart className="inline-block ml-2" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}