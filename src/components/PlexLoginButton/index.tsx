import React, { useState } from 'react';
import PlexOAuth from '../../utils/plex';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  loginwithplex: 'Login with Plex',
  loading: 'Loading...',
  loggingin: 'Logging in...',
});

const plexOAuth = new PlexOAuth();

interface PlexLoginButtonProps {
  onAuthToken: (authToken: string) => void;
  isProcessing?: boolean;
  onError?: (message: string) => void;
}

const PlexLoginButton: React.FC<PlexLoginButtonProps> = ({
  onAuthToken,
  onError,
  isProcessing,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  const getPlexLogin = async () => {
    setLoading(true);
    try {
      const authToken = await plexOAuth.login();
      setLoading(false);
      onAuthToken(authToken);
    } catch (e) {
      if (onError) {
        onError(e.message);
      }
      setLoading(false);
    }
  };
  return (
    <span className="block w-full pb-4 rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          plexOAuth.preparePopup();
          setTimeout(() => getPlexLogin(), 1500);
        }}
        disabled={loading || isProcessing}
        className="plex-button"
      >
        {loading
          ? intl.formatMessage(messages.loading)
          : isProcessing
          ? intl.formatMessage(messages.loggingin)
          : intl.formatMessage(messages.loginwithplex)}
      </button>
    </span>
  );
};

export default PlexLoginButton;
