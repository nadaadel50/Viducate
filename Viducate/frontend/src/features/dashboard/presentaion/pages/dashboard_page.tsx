import { COLORS } from "../../../../core/constants";

import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { LoadingScreen } from "../../../../core/widgets/advanced_loading";
import { LayoutDashboard } from "lucide-react";
import { ErrorMessage } from "../../../../core/widgets/error";
import {  } from "../context/dashboard_context";
import { useDashboard } from "../hooks/use_dashboard";
import { ContinueLearningPart } from "../widgets/continue_learning/continue_learning_part";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  if (isLoading) {
    return (
      <LoadingScreen
        icon={<LayoutDashboard />}
        titlePrefix="Preparing your"
        titleHighlight="Dashboard"
        subtitle="Loading your learning progress, saved videos, and activity insights..."
      />
    );
  }
  if (error) return <ErrorMessage errorMessage={error.message} />;

  if(data){
    return (
    <div
      style={{ background: COLORS.background.moreLight }}
      className="flex flex-col w-full py-5 px-20 font-display min-h-screen gap-10 "
    >
      {/* user card */}
      <UserCard />

      {/* 3 cards */}

      <ProgressPart />

      {/* contiune learning */}
      <ContinueLearningPart/>

    </div>
  );
  }
}
