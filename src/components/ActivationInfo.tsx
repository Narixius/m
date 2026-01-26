import { useEffect, useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, HeadsetIcon } from "lucide-react";
import { Timer } from "@/components/Timer";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { startCase } from "es-toolkit";
import { SUPPORT_URL } from "astro:env/client";
import type { GetPaymentResponse } from "@/types";

export const ActivationInfo: FC<{
  qrCode: string;
  initialPaymentData: GetPaymentResponse;
  invoiceId: string;
}> = ({ qrCode, initialPaymentData, invoiceId }) => {
  const [p, setPayment] = useState(initialPaymentData);
  useEffect(() => {
    if (["processing", "waiting"].includes(p.paymentStatus)) {
      const interval = setInterval(() => {
        fetch(`/api/get-payment/${invoiceId}`)
          .then((r) => r.json())
          .then((payment) => {
            setPayment(payment as GetPaymentResponse);
          });
      }, 10_000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex items-center justify-center pb-20 border-t pt-5 md:pt-10">
      <div className="md:max-w-xl flex flex-col w-full gap-4 px-5">
        <div className="flex flex-wrap gap-1 items-center justify-between w-full">
          <div>
            Invoice ID: <Badge variant="outline">{p.invoiceId}</Badge>
          </div>
          <div className="items-center text-sm flex justify-center gap-1">
            <Badge
              variant={
                {
                  waiting: "outline",
                  expired: "destructive",
                  success: "green",
                  processing: "outline",
                  finished: "green",
                  failed: "destructive",
                  partially_paid: "yellow",
                }[p.paymentStatus] as ComponentProps<typeof Badge>["variant"]
              }
              className="capitalize"
            >
              Status: {startCase(p.paymentStatus)}
            </Badge>
          </div>
        </div>
        <p className="text-sm">Plan: {p.plan.name}</p>
        {!p.isTrial && (
          <div className="flex gap-3 flex-col md:flex-row">
            <div className={cn("relative flex items-center justify-center")}>
              <div
                dangerouslySetInnerHTML={{ __html: qrCode }}
                className={cn(
                  "[&>svg]:border-2 [&>svg]:border-primary [&>svg]:size-52",
                  {
                    "opacity-20": p.paymentStatus !== "waiting",
                  }
                )}
              />
              <img
                src={`https://nowpayments.io/images/coins/${p.payCurrency}.svg`}
                className={cn("size-14 absolute bg-white p-1", {
                  "opacity-70": p.paymentStatus !== "waiting",
                })}
              />
              {p.paymentStatus === "expired" && (
                <span className="text-red-500 bottom-2 absolute font-bold text-shadow-white text-shadow-lg">
                  EXPIRED
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-col overflow-hidden">
              <span className="text-sm flex flex-col">
                <span className="text-xs">Amount</span>
                <div className="flex justify-between gap-2">
                  <span className="font-mono flex items-center gap-2">
                    {p.payAmount}
                    {p.paymentStatus === "waiting" && (
                      <CopyButton text={p.payAmount} />
                    )}
                  </span>
                </div>
              </span>
              <div className="flex flex-col">
                <span className="text-xs">Address</span>
                <div className="font-mono text-sm flex gap-2">
                  <span
                    className={cn("wrap-anywhere", {
                      "line-through": p.paymentStatus === "expired",
                    })}
                  >
                    {p.payAddress}
                  </span>
                  {p.paymentStatus === "waiting" && (
                    <CopyButton text={p.payAddress} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs">Network</span>
                <div className="font-mono text-sm flex gap-2">
                  <span className="wrap-anywhere uppercase">{p.network}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs">Expiation</span>
                <div className="font-mono text-sm flex gap-2">
                  <span className="wrap-anywhere uppercase">
                    {differenceInSeconds(p.paymentExpiry, new Date()) > 0 ? (
                      <Timer endTime={new Date(p.paymentExpiry)} />
                    ) : (
                      formatDistanceToNow(p.paymentExpiry, {
                        addSuffix: true,
                      })
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {p.paymentStatus === "waiting" && (
          <div className="mt-4 w-full flex flex-col gap-4">
            <p className="text-sm text-center">
              Send the exact amount to the address above with the exact network
              before the timer expires. Please ensure your transaction completes
              within the expiration window, or your payment will be canceled and
              funds may be lost. If you encounter any issues, contact our
              support team on Telegram.
            </p>
          </div>
        )}
        {p.paymentStatus === "partially_paid" && (
          <div className="mt-4 w-full flex flex-col gap-4 items-center">
            <p className="text-sm text-center">
              Your payment has been received but the amount wasn't correct.
              Please reach out to our support team on Telegram with your
              transaction details and invoice id so we can assist you.
            </p>
            <table className="text-sm bg-primary/10">
              <tbody>
                <tr>
                  <td className="p-1 pl-2">Invoice ID</td>
                  <td className="font-mono p-1 pr-2">{p.invoiceId}</td>
                </tr>
                <tr>
                  <td className="p-1 pl-2">Amount requested</td>
                  <td className="font-mono p-1 pr-2">{p.payAmount}</td>
                </tr>
                <tr>
                  <td className="p-1 pl-2">Amount actually paid</td>
                  <td className="font-mono p-1 pr-2">
                    {p.lastUpdate.actually_paid}
                  </td>
                </tr>
              </tbody>
            </table>
            <a href={SUPPORT_URL} target="_blank">
              <Button variant="outline" className="w-fit">
                <HeadsetIcon />
                Contact Support
              </Button>
            </a>
          </div>
        )}
        {p.paymentStatus === "finished" && (
          <div className="mt-4 w-full flex flex-col gap-4 items-center">
            <p className="text-sm text-center">
              Your payment has been complete and your subscription has been
              activated. Enjoy your experience with Marz.
            </p>
            <p className="text-sm">
              Subscription ID:{" "}
              <Badge variant="outline">{p.subscription.uuid}</Badge>
            </p>
          </div>
        )}
        {p.paymentStatus === "expired" && (
          <div className="mt-4 w-full flex flex-col gap-4 items-center">
            <p className="text-sm text-center">
              This payment window has expired. Please do not send any funds to
              this address. If you've already sent funds that haven't been
              verified, please reach out to our support team on Telegram with
              your transaction details and invoice id so we can assist you.
            </p>
            <div className="flex gap-2 w-full justify-center">
              <Button variant="outline" className="w-fit">
                <ArrowLeftIcon />
                Back to activation
              </Button>
              <a href={SUPPORT_URL} target="_blank">
                <Button variant="outline" className="w-fit">
                  <HeadsetIcon />
                  Contact Support
                </Button>
              </a>
            </div>
          </div>
        )}
        {p.paymentStatus === "processing" && (
          <div className="mt-4 w-full flex flex-col gap-4 items-center">
            <p className="text-sm text-center">
              Your payment has been received and we are processing it.
            </p>
          </div>
        )}
        {p.paymentStatus === "failed" && (
          <div className="mt-4 w-full flex flex-col gap-4 items-center">
            <p className="text-sm text-center">
              This payment failed. If you've already sent funds that haven't
              been verified, please reach out to our support team on Telegram
              with your transaction details and invoice id so we can assist you.
            </p>
            <Button variant="outline" className="w-fit">
              <ArrowLeftIcon />
              Back to activation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
