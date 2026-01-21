import { useEffect, type FC } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Plan = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export const Plans: FC<{
  onChange: (id: string) => void;
  value: string;
  plans: Plan[];
}> = ({ onChange, value, plans }) => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const plan = searchParams.get("plan");
    if (plan) {
      onChange(plan);
    }
  }, []);

  return (
    <RadioGroup value={value} onValueChange={onChange}>
      {plans.map((plan) => {
        return (
          <FieldLabel
            key={plan.id}
            htmlFor={plan.id}
            className="group-[.invalid]:border-red-500"
          >
            <Field orientation="horizontal" className="relative">
              <FieldContent>
                <FieldTitle>{plan.name}</FieldTitle>
                <div className="flex justify-between w-full items-center">
                  <FieldDescription>{plan.description}</FieldDescription>
                  <span>{plan.cost}$</span>
                </div>
              </FieldContent>
              <RadioGroupItem
                value={plan.id}
                id={plan.id}
                className="absolute top-5 right-4 -translate-y-1/2 bg-white"
              />
            </Field>
          </FieldLabel>
        );
      })}
    </RadioGroup>
  );
};
