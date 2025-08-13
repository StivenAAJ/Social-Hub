"use client";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "../../../axios"; // Usa tu instancia configurada

export default function TwoFactorAuthenticationForm() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("idle");

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const { data } = await axios.get("/two-factor-status");
        setTwoFactorEnabled(Boolean(data.two_factor_enabled));
      } catch (e) {
        console.error("No pude leer estado 2FA", e);
      }
    };
    fetch2FAStatus();
  }, []);

  const start2FASetup = async () => {
    setProcessing(true);
    try {
      const { data } = await axios.get("/two-factor/setup");
      if (typeof data.otpauth === "string" && data.otpauth.length > 0) {
        setQrCode(data.otpauth);
        setStep("confirming");
      } else {
        console.error("El QR recibido no es válido:", data.otpauth);
        alert("No se pudo generar el código QR.");
      }
    } catch (error) {
      console.error("Error al iniciar configuración 2FA:", error);
      alert("Error al iniciar configuración 2FA.");
    } finally {
      setProcessing(false);
    }
  };

  const confirm2FA = async () => {
    try {
      await axios.post("/two-factor/confirm", { code: otpCode });
      setStep("enabled");
      setTwoFactorEnabled(true);
      alert("¡2FA activado correctamente!");
    } catch (e) {
      console.error("Error confirmando 2FA:", e.response?.data || e);
      alert("Código inválido");
    }
  };

  const disable2FA = async () => {
    try {
      await axios.post("/two-factor-toggle", { enabled: false });
      setTwoFactorEnabled(false);
      setStep("idle");
      alert("2FA desactivado");
    } catch (e) {
      console.error("Error al desactivar 2FA:", e.response?.data || e);
      alert("No se pudo desactivar 2FA");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold">Autenticación de dos factores</h2>

      {twoFactorEnabled ? (
        <div>
          <p className="text-green-700">Tu cuenta tiene 2FA activo.</p>
          <button
            onClick={disable2FA}
            className="bg-red-500 text-white px-4 py-2 rounded mt-3"
          >
            Desactivar 2FA
          </button>
        </div>
      ) : step === "confirming" ? (
        <div>
          {qrCode && typeof qrCode === "string" && qrCode.length > 0 ? (
            <>
              <p className="mb-2">Escanea el código con Google Authenticator:</p>
              <QRCode value={qrCode} size={200} />
              <div className="mt-4">
                <label className="block mb-2">
                  Ingresa el código de 6 dígitos:
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="border px-3 py-2 rounded w-1/2"
                  maxLength={6}
                />
                <button
                  onClick={confirm2FA}
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Confirmar
                </button>
              </div>
            </>
          ) : (
            <p className="text-red-500">
              Error: no se pudo generar el código QR.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={start2FASetup}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          Activar 2FA
        </button>
      )}
    </div>
  );
}
