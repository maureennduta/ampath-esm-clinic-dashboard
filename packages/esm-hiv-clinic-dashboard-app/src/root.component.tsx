import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { HIVListsRoutes } from './routes/hiv-lists.routes';
import { useMessageEventHandler } from './custom-hooks/useMessageEventHandler';

const Root: React.FC = () => {
  const { sendMessage, handleMessage } = useMessageEventHandler();
  React.useEffect(() => {
    sendMessage({ action: 'authenticate' });
  }, [sendMessage]);

  React.useEffect(() => {
    window.addEventListener('message', handleMessage.bind(this));
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  return (
    <BrowserRouter basename={window.spaBase}>
      {HIVListsRoutes.map((hivroute) => (
        <Route
          key={hivroute.name}
          exact
          path={hivroute.path}
          render={(routeProps) => {
            return <hivroute.component {...routeProps} />;
          }}
        />
      ))}
    </BrowserRouter>
  );
};

export default Root;
