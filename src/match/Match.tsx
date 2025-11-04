import MatchClient from "@/src/match/Client";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
	 return (
    <ErrorBoundary fallback={<span>Something went wrong in matchlayout.</span>}>
    <MatchClient />
    </ErrorBoundary>
    )
  }