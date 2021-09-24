import { Router, Route } from "wouter";
import { PipelineStatusPage } from "./pages/pipelineStatus";

export const App = () => (
  <Router>
    <Route path="/pipeline/:id/status">
      {({ id }: { id: string }) => <PipelineStatusPage id={id} />}
    </Route>
  </Router>
);
