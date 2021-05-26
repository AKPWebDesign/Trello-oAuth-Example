import { useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
import { getHashParams } from '../utils/getHashParams';
const useTokenState = createPersistedState('token');

const appKey = '1a3f718294a92d44e99effe926485e6d';

const useTrelloAuth = () => {
  const [token, setToken] = useTokenState(null);

  useEffect(() => {
    const { token } = getHashParams() as any;

    if (token) {
      setToken(token);
      window.history.pushState('','','/');
    }
  }, []);

  const logout = () => {
    setToken(null);
  };

  const login = () => {
    const redirectUri = window.location.origin;

    const scope = 'read';

    const urlParams = new URLSearchParams({
      'callback_method': 'fragment',
      'return_url': redirectUri,
      'scope': scope,
      'expiration': '30days',
      'name': 'Trell-oAuth Test',
      'key': appKey,
      'response_type': 'token',
    });

    window.location.assign(`https://trello.com/1/authorize?${urlParams.toString()}`);
  }

  return {
    login,
    loggedIn: Boolean(token),
    logout,
    token,
    appKey,
  };
}

export default useTrelloAuth;
