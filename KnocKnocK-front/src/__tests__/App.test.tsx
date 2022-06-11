import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

test("renders learn react link", () => {
  const fn = jest.fn(() => {});
  let wrapper = render(<div onClick={fn}>learn react</div>);
  const linkElement = wrapper.getByText("learn react");
  fireEvent.click(linkElement);
  expect(fn).toHaveBeenCalled();
  expect(linkElement).toBeTruthy();
});
