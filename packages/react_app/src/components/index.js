import styled, { css } from "styled-components";

export const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  font-family: "Harukaze";
`;

export const Header = styled.header`
  background-color: #ffffff;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  text-align: center;
  margin-top: 15px;
`;

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  margin-top: 20px;
`;

export const Title = styled.h1`
  display: flex;
  color: #282c34;
  text-align: center;
`;

export const DivFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export const DivSecret = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 0px 20px 20px 20px;
`;

export const LabelSecret = styled.label`
  font-size: 1em;
  color: #282c34;
`;

export const InputSecret = styled.input`
  border: none;
  border-bottom: 2px solid #282c34;
  font-family: "Harukaze";
  color: #ab2424;
  font-size: 1em;
  margin-top: 4px;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  background-color: white;
  border: solid;
  border-radius: 2px;
  color: #282c34;
  cursor: pointer;
  font-size: 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  font-family: "Harukaze";
`;

export const DivStatus = styled.div`
  margin-top: 15px;
  text-align: center;
  color: #ab2424;
  font-family: "Harukaze";
  font-size: 1em;
  margin: 30px 0px 20px 0px;
`;

export const Image = styled.img`
  height: 35vmin;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #2850a6;
  margin-top: 8px;
  text-decoration: none;
`;

export const BottomText = styled.div`
  font-family: "Harukaze";
  color: #282c34;
  font-size: 1.5em;
  text-align: center;
`;

export const PriceText = styled.div`
  font-family: "Harukaze";
  margin: 0px 0px 20px 0px;
  color: #282c34;
  font-size: 1.25em;
  text-align: center;
`;

export const LinkLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LinkLogo = styled.img`
  height: 7vmin;
  margin: 0px 5px 0px 5px;
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
