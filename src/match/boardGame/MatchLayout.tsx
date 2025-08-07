import ClientContainer from "@/src/match/boardGame/ClientContainer";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
	 return (
    <ErrorBoundary fallback={<span>Something went wrong in matchlayout.</span>}>
      <p>MatchLayout</p>
    <ClientContainer>
      <Outlet />
    </ClientContainer>
    </ErrorBoundary>
    )
  }