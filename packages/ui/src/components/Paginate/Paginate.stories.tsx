// Pagination.stories.tsx

import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";

import Pagination, { IProp } from "./index";

export default {
  title: "Navigation/Pagination",
  component: Pagination,
  argTypes: {
    onPageChange: { action: "pageChanged" },
    onPageSizeChange: { action: "pageSizeChanged" },
  },
} as Meta;

const Template: StoryFn<IProp> = (args) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Pagination
      {...args}
      onPageChange={handlePageChange}
      initialPage={currentPage}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  totalPage: 10,
  showGoto: true,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "...",
  numberPageDisplayed: 5,
  numberMarginPagesDisplayed: 2,
};

export const Advanced = Template.bind({});
Advanced.args = {
  type: "advanced",
  totalPage: 15,
  showGoto: true,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "...",
  numberPageDisplayed: 7,
  numberMarginPagesDisplayed: 3,
};

export const Simple = Template.bind({});
Simple.args = {
  type: "simple",
  totalPage: 5,
  showGoto: false,
  previousLabel: "Prev",
  nextLabel: "Next",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 1,
};

export const SinglePage = Template.bind({});
SinglePage.args = {
  totalPage: 1,
  showGoto: false,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 2,
};

export const NoPagination = Template.bind({});
NoPagination.args = {
  totalPage: 0,
  showGoto: false,
  previousLabel: "< Previous",
  nextLabel: "Next >",
  breakLabel: "",
  numberPageDisplayed: 3,
  numberMarginPagesDisplayed: 2,
};
