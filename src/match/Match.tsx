import MatchClient from "@/src/match/Client";
import ErrorDialog from "@/src/site/errorHandling/ErrorDialog";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";

export default function MatchLayout() 
  {
	 return (
    <ErrorBoundary FallbackComponent={ErrorDialog}>
      <MatchClient />
    </ErrorBoundary>
    )
  }