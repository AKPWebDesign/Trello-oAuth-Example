import { useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
import { getHashParams } from '../utils/getHashParams';
const useTokenState = createPersistedState('token');

const appKey = '1a3f718294a92d44e99effe926485e6d';

const useTrelloAuth = () => {
  const [token, setToken] = useTokenState(null);

  const logout = () => {
    setToken(null);
  };

  const login = () => {
    const redirectUri = window.location.origin;

    const scope = 'read';

    const urlParams = new URLSearchParams({
      'callback_method': 'postMessage',
      'return_url': redirectUri,
      'scope': scope,
      'expiration': '30days',
      'name': 'Trell-oAuth Test',
      'key': appKey,
      'response_type': 'token',
    });

    const width = 720;
    const height = 800;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const authWindow = window.open(`https://trello.com/1/authorize?${urlParams.toString()}`, 'trello', `width=${width},height=${height},left=${left},top=${top}`);

    const receiveMessage = (evt) => {
      if (evt.origin !== 'https://trello.com' || evt.source !== authWindow) {
        return;
      }

      if (evt.source != null) {
        evt.source.close();
      }

      if (evt.data != null && /[0-9a-f]{64}/.test(evt.data)) {
        setToken(evt.data)
      } else {
        setToken(null);
      }

      window.removeEventListener('message', receiveMessage, false);
    }

    window.addEventListener('message', receiveMessage, false);
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
