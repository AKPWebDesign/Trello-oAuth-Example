import { useState, useEffect } from 'react';
import useTrelloAuth from './useTrelloAuth';

const useTrelloBoards = () => {
  const [boards, setBoards] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const { appKey, loggedIn, token, login, logout } = useTrelloAuth();

  useEffect(() => {
    if (!error) return;

    if (error.status === 401) {
      setError(null);
      logout();
      login();
    }
  }, [error, logout, login]);

  useEffect(() => {
    if (isFetching || !loggedIn) return;

    setFetching(true);

    fetch('https://api.trello.com/1/members/me/boards', {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${appKey}", oauth_token="${token}"`,
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setBoards(d);
        setError(null);
        setFetching(false);
      })
      .catch((e) => {
        setBoards(null);
        setError(e.message);
        setFetching(false);
      });

  }, [loggedIn, token]);

  return {
    boards,
    isFetching,
    error,
  };
}

export default useTrelloBoards;
