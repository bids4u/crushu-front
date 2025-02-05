// src/app/respond/[id]/page.tsx
"use client"; // Still needed for interactivity

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use `next/navigation` instead of `next/router`
import Head from "next/head";
import confetti from "canvas-confetti";

export default function Respond() {
  const params = useParams();
  const id = params.id;
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [formData, setFormData] = useState<{
    crushName: string;
    userEmail: string;
    yesResponse: string;
    noResponse: string;
  } | null>(null);

  // Fetch form data by ID
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`https://crushu-back.onrender.com/api/crush/${id}`);
        const result = await response.json();

        if (result.success) {
          // Set the form data to state
          setFormData(result.data);
        } else {
          console.error("Failed to fetch form data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id]);

  // Move the "No" button randomly with a delay
  const moveNoButton = () => {
    setTimeout(() => {
      const newPosition = {
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 80}%`,
      };
      setNoButtonStyle(newPosition);
    }, 100); // 100ms delay
  };

  // Handle response submission
  const handleResponse = async(response: "yes" | "no") => {
    setResponse(response);
    setButtonsVisible(false); // Hide buttons after response

    // Trigger confetti for "Yes"
    if (response === "yes") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      // Send email to the user
      try {
        console.log(formData?.crushName,formData?.userEmail)
        const emailResponse = await fetch(
          `https://crushu-back.onrender.com/api/crush/send-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: formData?.userEmail,
              crushName: formData?.crushName,
            }),
          }
        );

        const result = await emailResponse.json();

        if (result.success) {
          console.log("Email sent successfully!");
        } else {
          console.error("Failed to send email:", result.message);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    alert(`You said ${response === "yes" ? "YES" : "NO"}! 🌹`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-pink to-valentine-light-pink flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head>
        <title>Respond 💌 - Crushu</title>
        <meta
          name="description"
          content="Respond to your crush’s question on Crushu."
        />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-dancing text-valentine-white mb-8">
          Will you be my Valentine, {formData?.crushName}? 💘
        </h1>

        {/* Friendly "Yes" Button */}
        {buttonsVisible && (
          <button
            onClick={() => handleResponse("yes")}
            className="bg-valentine-white text-valentine-pink px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform transform-gpu mb-4"
          >
            Yes! 🌹
          </button>
        )}

        {/* Evil "No" Button */}
        {buttonsVisible && (
          <button
            onClick={() => handleResponse("no")}
            onMouseEnter={moveNoButton} // Move on hover (desktop)
            onTouchStart={moveNoButton} // Move on touch (mobile)
            style={noButtonStyle}
            className="bg-valentine-red text-valentine-white px-6 py-3 rounded-lg shadow-lg absolute transition-all transform-gpu"
          >
            No 😢
          </button>
        )}

        {/* Display the response based on user's choice */}
        {response && formData && (
          <div className="mt-8">
            <p className="text-2xl font-dancing text-valentine-white">
              {response === "yes"
                ? `Yay! 🎉 ${formData.yesResponse}`
                : `Aww, maybe next time! 💔 ${formData.noResponse}`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
