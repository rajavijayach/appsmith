import styled from "styled-components";
import { getTypographyByKey } from "constants/DefaultTheme";

export const ThreadContainer = styled.div`
  border: 1px solid
    ${(props) => props.theme.colors.comments.threadContainerBorder};
  width: 400px;
  max-width: 100%;
`;

export const ThreadHeader = styled.div`
  padding: ${(props) => props.theme.spaces[6]}px;
  display: flex;
  justify-content: space-between;
`;

export const ThreadHeaderTitle = styled.div`
  ${(props) => getTypographyByKey(props, "h5")}
  color: ${(props) => props.theme.colors.comments.commentBody};
`;

export const CommentsContainer = styled.div`
  position: relative;
  max-height: 285px;
  overflow: auto;
`;
