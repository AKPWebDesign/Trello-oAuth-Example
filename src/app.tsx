import * as React from 'react';
import styled from 'styled-components';
import useTrelloAuth from './hooks/useTrelloAuth';
import useTrelloBoards from './hooks/useTrelloBoards';
import useTrelloBoardData from './hooks/useTrelloBoardData';

const Container = styled.div`
  display: flex;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 2.5em;
  background-color: rgba(0, 0, 0, 0.82);
  color: #dcdcdc;
  padding: 25px;
  margin: 2px;
`;

const Loading = styled.div`
  width: 100%;
  font-size: 2.5em;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const { loggedIn, login } = useTrelloAuth();
  const { boards } = useTrelloBoards();
  const { boardId, lists, cards } = useTrelloBoardData();

  if (!loggedIn) {
    return (
      <Container>
        <Loading onClick={login}>Log In to Trello</Loading>
      </Container>
    );
  }

  if (!boards) {
    return (
      <Container>
        <Loading>Loading...</Loading>
      </Container>
    );
  }

  if (lists && cards && boardId) {
    return (
      <>
        {lists.map((list) => (
          <Container key={list.id}>
            {list.name}
          </Container>
        ))}

        {cards.map((card) => (
          <Container key={card.id}>
            {card.name}
          </Container>
        ))}
      </>
    )
  }

  return (
    <>
      {boards.map((board) => (
        <a href={`#board=${board.id}`} key={board.id}>
          <Container>
            {board.name}
          </Container>
        </a>
      ))}
    </>
  );
};

export default App;
