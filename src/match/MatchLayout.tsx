import ClientContainer from "@/src/match/ClientContainer";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
    console.log("rendering matchlayout")
	 return (
    <ErrorBoundary fallback={<span>Something went wrong in matchlayout.</span>}>
    <ClientContainer>
      <Outlet />
    </ClientContainer>
    </ErrorBoundary>
    )
  }