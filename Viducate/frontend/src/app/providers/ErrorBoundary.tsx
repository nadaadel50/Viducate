import React from "react";
import ErrorScreen from "../../core/componants/error_screen";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

 

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen errorMessage={this.state.errorMessage} />
      );
    }

    return this.props.children;
  }
}