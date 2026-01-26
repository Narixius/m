import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";

import type { NowPaymentCurrency } from "@/types";

import { CurrenciesList } from "@/components/checkout/CurrenciesList";
import { Plans } from "@/components/checkout/Plans";
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  FieldDescription,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sha256 } from "@/lib/hash";
import { cn } from "@/lib/utils";
import { plans } from "@/plans";

const schema = z
  .object({
    plan: z.enum(plans.map((p) => p.id) as [string, ...string[]], {
      message: "Please select one of the plans",
    }),
    domain: z
      .string()
      .min(1, "This field is required")
      .regex(/^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
        message: "The URL pattern doesn't seem to be fine",
      }),
    currency: z.string().optional(),
    currencyData: z.any(),
  })
  .superRefine((data, ctx) => {
    if (data.plan !== "trial") {
      const currencySchema = z.string().min(1, "Please select a currency");
      const result = currencySchema.safeParse(data.currency);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error.errors[0].message,
          path: ["currency"],
        });
      }
    }
  });

export const CheckoutForm: FC<{
  currencies: NowPaymentCurrency[];
}> = ({ currencies }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      domain: "",
      plan: "",
      currency: "",
      currencyData: null,
    },
    resolver: zodResolver(schema),
  });
  const selectedPlan = form.watch("plan");
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const domain = searchParams.get("domain");
    if (domain) {
      form.setValue("domain", domain);
    }
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
  };
  const handleSubmit = async () => {
    const data = form.getValues() as z.infer<typeof schema>;
    setLoading(true);
    data.domain = await sha256(data.domain.toLowerCase().trim());
    if (data.plan === "trial") delete data.currency;
    delete data.currencyData;

    fetch("/api/create-payment", {
      method: "post",
      body: JSON.stringify(data),
    })
      .then(async (r) => {
        if (!r.ok) throw await r.json();
        return r.json();
      })
      .then((data: any) => {
        window.location.href = `/activation/${data.id}`;
      })
      .catch((r) => {
        form.setError("root", {
          message: r.message || "An unexpected error occurred",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="md:max-w-xl flex flex-col w-full gap-4 px-5">
      <Field className="flex flex-col gap-1">
        <FieldLabel htmlFor="subscription_url">Subscription domain</FieldLabel>
        <Input
          id="subscription_url"
          className="rounded-sm"
          placeholder="sub.example.com"
          aria-invalid={!!form.formState.errors.domain}
          {...form.register("domain")}
        />
        <FieldError>{form.formState.errors.domain?.message}</FieldError>
        <FieldDescription className="prose text-sm text-muted-foreground">
          Enter only the domain part of your subscription link (no https://, no
          path).
        </FieldDescription>
      </Field>
      <Field
        className={cn("flex flex-col gap-1 group", {
          invalid: !!form.formState.errors.plan,
        })}
      >
        <FieldLabel
          aria-invalid={!!form.formState.errors.plan?.message}
          htmlFor="currency"
          ref={form.register("plan").ref}
        >
          Plan
        </FieldLabel>
        <Controller
          control={form.control}
          name="plan"
          render={({ field }) => {
            return (
              <Plans
                onChange={field.onChange}
                value={field.value!}
                plans={plans}
              />
            );
          }}
        />
        <FieldError>{form.formState.errors.plan?.message}</FieldError>
      </Field>
      {selectedPlan !== "trial" && (
        <Field
          className={cn("flex flex-col gap-1 group", {
            invalid: !!form.formState.errors.currency,
          })}
        >
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <Controller
            control={form.control}
            name="currency"
            render={({ field }) => {
              return (
                <CurrenciesList
                  currencies={currencies}
                  onChange={(value, item) => {
                    field.onChange(value);
                    form.setValue("currencyData", item);
                  }}
                />
              );
            }}
          />
          <FieldError>{form.formState.errors.currency?.message}</FieldError>
        </Field>
      )}

      <FieldDescription className="text-sm text-muted-foreground px-1">
        <b>Note:</b> We never store your domain subscription as plain text. This
        domain is securely converted to a one-way SHA-256 hash and cannot be
        reversed.
      </FieldDescription>

      <Button
        className="w-full"
        type="button"
        onClick={form.handleSubmit(openDialog)}
      >
        Submit
      </Button>
      <Dialog
        open={dialogOpen}
        onOpenChange={loading ? undefined : setDialogOpen}
      >
        <DialogContent showCloseButton={!loading}>
          <DialogHeader className="flex gap-1 flex-row items-center font-medium">
            <Logo withText={false} className="[&>img]:size-5" />
            Verify Information
          </DialogHeader>
          <span className="text-sm">
            Please before proceed, make sure the information you've entered is
            correct
          </span>
          <div className="text-sm rounded-sm border p-4 border-primary bg-primary/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              Subscription domain{" "}
              <span className="font-medium">{form.getValues("domain")}</span>
            </div>
            <div className="flex items-center justify-between">
              Plan{" "}
              <span className="font-medium">
                {plans.find((p) => p.id === form.watch("plan"))?.name}
              </span>
            </div>
            {form.getValues("currency") && (
              <div className="flex items-center justify-between">
                Currency{" "}
                <div className="font-medium flex items-center gap-1">
                  <img
                    src={
                      `https://nowpayments.io` +
                      form.getValues("currencyData").logo_url
                    }
                    className="size-4"
                  />
                  {form.getValues("currencyData").name}
                  <span className="text-muted-foreground">
                    ({form.getValues("currencyData").code})
                  </span>
                </div>
              </div>
            )}
          </div>
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="animate-spin size-4" />}
            Proceed Payment
          </Button>
        </DialogContent>
      </Dialog>
    </form>
  );
};
