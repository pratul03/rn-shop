import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const useOrderUpdateSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const subscriptionResponse = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "order" },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ["orders"],
          });
        }
      )
      .subscribe();

    return () => {
      subscriptionResponse.unsubscribe();
    };
  }, []);
};
