import ClientContainer from "@/src/match/ClientContainer";
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
	 return (
    <ClientContainer>
      <Suspense>
      <Outlet />
      </Suspense>
    </ClientContainer>
    )
  }