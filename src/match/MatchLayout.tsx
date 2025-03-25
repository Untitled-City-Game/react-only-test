import ClientContainer from "@/src/match/ClientContainer";
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
    console.log("rendering matchlayout")
	 return (
    <ClientContainer>
      <Suspense>
      <Outlet />
      </Suspense>
    </ClientContainer>
    )
  }