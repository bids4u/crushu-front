"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import confetti from "canvas-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Respond() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [noClickCount, setNoClickCount] = useState(0);
  const [formData, setFormData] = useState<{
    crushName: string;
    userEmail: string;
    yesResponse: string;
    noResponse: string;
  } | null>(null);
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [moving, setMoving] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [noButtonText, setNoButtonText] = useState("No 😢");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(
          `https://crushu-back.onrender.com/api/crush/${id}`
        );
        const result = await response.json();

        if (result.success) {
          if (result.data.status === "expired") {
            alert("This link has expired.");
            router.push("/");
          } else {
            setFormData(result.data);
          }
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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (moving) {
      interval = setInterval(() => {
        setNoButtonStyle({
          left: `${Math.random() * 85}%`,
          top: `${Math.random() * 85}%`,
          transition: `all ${speed / 1000}s ease-in-out`,
        });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [moving, speed]);

  const handleExpireLink = async () => {
    try {
      await fetch(
        `https://crushu-back.onrender.com/api/crush/expire-link/${id}`,
        { method: "POST" }
      );
    } catch (error) {
      console.error("Error expiring link:", error);
    }
  };

  const noButtonTexts = [
    "No 😢",
    "Really? 🥺",
    "Think again! 🤨",
    "Last chance! 💔",
    "Okay... 💀",
  ];

  const handleNoClick = () => {
    if (noClickCount === 0) {
      toast.warning("Please think and try again 🤔");
      setMoving(true);
    } else if (noClickCount === 1) {
      toast.warning("Are you sure? 🤔");
      setSpeed(500);
    } else if (noClickCount === 2) {
      toast.warning("This is the last chance 💔");
      setSpeed(200);
    } else {
      toast.error("Oh no! 💔");
      setResponse("no");
      setButtonsVisible(false);
      setMoving(false);
      handleExpireLink();
    }

    setNoClickCount((prev) => prev + 1);
  };

  const handleResponse = async (response: "yes" | "no") => {
    if (response === "no") return;

    setResponse(response);
    setButtonsVisible(false);
    setMoving(false);

    if (response === "yes") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      try {
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
          toast.success("Email sent successfully! 📧");
          handleExpireLink();
        } else {
          toast.error("Failed to send email: " + result.message);
        }
      } catch (error) {
        toast.error("Error sending email: " + error);
      }
    }

    toast.info(`You said ${response === "yes" ? "YES ❤️" : "NO 💔"}!`);
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

      <ToastContainer />

      <main className="text-center">
        <h1 className="text-4xl font-dancing text-valentine-white mb-8">
          Will you be my Valentine, {formData?.crushName}? 💘
        </h1>

        {buttonsVisible && (
          <button
            onClick={() => handleResponse("yes")}
            className="bg-valentine-white text-valentine-pink px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform transform-gpu mb-4"
          >
            Yes! 🌹
          </button>
        )}

        {buttonsVisible && (
          <button
            onClick={handleNoClick}
            style={noButtonStyle}
            className="bg-valentine-red text-valentine-white px-6 py-3 rounded-lg shadow-lg absolute transition-all transform-gpu"
          >
            {noButtonTexts[Math.min(noClickCount, noButtonTexts.length - 1)]}
          </button>
        )}

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
