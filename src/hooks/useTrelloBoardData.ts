import { useState, useEffect } from 'react';
import useInterval from './useInterval';
import useTrelloAuth from './useTrelloAuth';
import { getHashParams } from '../utils/getHashParams';

const useTrelloBoardData = () => {
  const [cards, setCards] = useState(null);
  const [lists, setLists] = useState(null);
  const [error, setError] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [isFetchingLists, setFetchingLists] = useState(false);
  const [isFetchingCards, setFetchingCards] = useState(false);
  const { appKey, loggedIn, token, login, logout } = useTrelloAuth();

  useInterval(() => {
    const { board } = getHashParams() as any;
    if (!board) return setBoardId(null);
    setBoardId(board);
  }, 100);

  useEffect(() => {
    if (!error) return;

    if (error.status === 401) {
      setError(null);
      logout();
      login();
    }
  }, [error, logout, login]);

  useEffect(() => {
    if (isFetchingLists || !loggedIn || !boardId) return;

    setFetchingLists(true);

    fetch(`https://api.trello.com/1/boards/${boardId}/lists`, {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${appKey}", oauth_token="${token}"`,
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setLists(d);
        setError(null);
        setFetchingLists(false);
      })
      .catch((e) => {
        setLists(null);
        setError(e.message);
        setFetchingLists(false);
      });

  }, [loggedIn, token, boardId]);

  useEffect(() => {
    if (isFetchingCards || !loggedIn || !boardId) return;

    setFetchingCards(true);

    fetch(`https://api.trello.com/1/boards/${boardId}/cards`, {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${appKey}", oauth_token="${token}"`,
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setCards(d);
        setError(null);
        setFetchingCards(false);
      })
      .catch((e) => {
        setCards(null);
        setError(e.message);
        setFetchingCards(false);
      });

  }, [loggedIn, token, boardId]);

  return {
    boardId,
    cards,
    lists,
    isFetchingCards,
    isFetchingLists,
    error,
  };
}

export default useTrelloBoardData;
