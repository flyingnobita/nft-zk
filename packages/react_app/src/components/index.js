import styled, { css } from "styled-components";

export const Container = styled.div`
  background-color: #475b9b;
  display: flex;
  flex-direction: column;
  height: calc(100vh);
`;

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  /* font-size: calc(10px + 2vmin); */
  justify-content: center;
  margin-top: 20px;
`;

const buttonStyle = css`
  background-color: white;
  border: solid;
  border-radius: 2px;
  color: #282c34;
  cursor: pointer;
  font-size: 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
`;
export const Button = styled.button(buttonStyle);
export const FormInputButton = styled.input(buttonStyle);

export const DivStatus = styled.div`
  margin-top: 5px;
  text-align: center;
  color: #fbff00;
  font-family: "Harukaze";
  font-size: 1em;
  margin: 30px 0px 20px 0px;
`;

export const DivFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export const DivScrollable = styled.div`
  overflow-y: scroll;
  height: 300px;
  margin-left: 10%;
  margin-right: 10%;
`;

export const Pre = styled.pre`
  border: 10;
  border-color: black;
`;
