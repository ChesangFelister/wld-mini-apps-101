"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { Button, Input, Select } from "@worldcoin/mini-apps-ui-kit-react";
import { useState } from "react";
import { ChangeEvent } from "react"; // Ensure ChangeEvent is imported

const sendPayment = async (
  recipientAddress: string,
  selectedToken: Tokens,
  amount: number
) => {
  try {
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
    });

    const { id } = await res.json();
    console.log(id);

    const payload: PayCommandInput = {
      reference: id,
      to: recipientAddress,
      tokens: [
        {
          symbol: selectedToken,
          token_amount: tokenToDecimals(amount, selectedToken).toString(),
        },
      ],
      description: "Thanks for the coffee! ☕",
    };
    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePay = async (
  recipientAddress: string,
  selectedToken: Tokens,
  amount: number,
  setStatus: (status: string | null) => void
) => {
  if (!MiniKit.isInstalled()) {
    setStatus("MiniKit is not installed");
    return;
  }

  if (
    !recipientAddress ||
    recipientAddress.length < 42 ||
    !recipientAddress.startsWith("0x")
  ) {
    setStatus("Invalid recipient address");
    return;
  }

  if (amount <= 0) {
    setStatus("Amount must be greater than 0");
    return;
  }

  setStatus("Processing payment...");
  const sendPaymentResponse = await sendPayment(
    recipientAddress,
    selectedToken,
    amount
  );

  const response = sendPaymentResponse?.finalPayload;

  if (!response) {
    setStatus("Payment failed");
    return;
  }

  if (response.status == "success") {
    const res = await fetch(`/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: response }),
    });
    const payment = await res.json();
    if (payment.success) {
      setStatus("Thank you for the coffee! ☕");
    } else {
      setStatus("Payment confirmation failed");
    }
  } else {
    setStatus("Payment failed");
  }
};

export const PayBlock = () => {
  const [recipientAddress, setRecipientAddress] = useState(
    process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ""
  );
  const [selectedToken, setSelectedToken] = useState<Tokens>(Tokens.WLD);
  const [amount, setAmount] = useState<number>(0.5);
  const [status, setStatus] = useState<string | null>(null);

  // Handle recipient address change
  const handleRecipientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  // Handle token selection change (updated for compatibility with Select)
  const handleTokenChange = (value: string) => {
    setSelectedToken(value as Tokens); // Directly use value and cast it to Tokens
  };

  // Handle amount change
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold">Buy me a coffee ☕</h3>
      <p className="text-center text-gray-600 mb-4">
        Enjoyed this app? Buy me a coffee! 🎉 Or change the address to support
        someone else!
      </p>

      <div className="w-full space-y-4">
        <div>
          <label>Recipient Address</label>
          <input
            value={recipientAddress}
            onChange={handleRecipientChange} // Handler for address input
            placeholder="0x..."
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              value={selectedToken}
              onChange={handleTokenChange} // Updated to handle value directly
              options={[
                { label: "WLD", value: Tokens.WLD },
                { label: "USDC", value: Tokens.USDCE },
              ]}
            />
          </div>

          <div className="flex-1">
            <label>Amount</label>
            <input
              type="number"
              value={amount.toString()}
              onChange={handleAmountChange} // Handler for amount input
              placeholder="0.5"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() =>
          handlePay(recipientAddress, selectedToken, amount, setStatus)
        }
        className="w-full mt-2"
      >
        Buy Coffee
      </Button>

      {status && (
        <div
          className={`mt-2 text-center ${
            status.includes("Thank you") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};
