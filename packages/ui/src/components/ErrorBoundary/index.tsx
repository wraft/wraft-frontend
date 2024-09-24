import { SomethingWentIcon } from "@wraft/icon";
import { x } from "@xstyled/emotion";
import type { ErrorInfo } from "react";
import { Component } from "react";

import { Button } from "../Button";

class ErrorBoundary extends Component<
  { children: React.ReactNode; message?: string },
  { error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(
    props:
      | { children: React.ReactNode }
      | Readonly<{ children: React.ReactNode }>,
  ) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error, errorInfo });
    // You can also log error messages to an error reporting service here
  }

  handleBack = () => {
    window.history.back();
  };

  render() {
    // do not intercept next-not-found error, allow displaying not-found.tsx page when notFound() is thrown on server side
    if (
      this.state.error !== null &&
      "digest" in this.state.error &&
      this.state.error.digest === "NEXT_NOT_FOUND"
    ) {
      return this.props.children;
    }

    if (this.state.errorInfo) {
      // Error path
      return (
        <x.div
          display="flex"
          flexDirection="column"
          alignItems="center"
          my="24px"
          minWidth="100%"
        >
          <SomethingWentIcon width={"300px"} height={"300px"} />
          <x.h2>{this.props.message || "Something went wrong."}</x.h2>
          {/* <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
          </details> */}
          <Button variant="primary" onClick={this.handleBack}>
            Back
          </Button>
        </x.div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
